# Dicionário de Dados — Turma da Bomba

Grupo 1 · Academia · Versão documental 1.0 · 11/11/2026

## Convenções e visão geral

Banco padrão: projeto-integrador, substituível por MONGODB_URI. Tipos abaixo são de persistência Mongoose/MongoDB; o contrato HTTP usa strings para IDs e datas. Obrigatoriedade distingue campos enviados pelo cliente daqueles gerados ou preenchidos por padrão. A coluna Pessoal indica dados associados a uma pessoa ou credencial, conforme a classificação solicitada pelo template; não constitui enquadramento jurídico.

| Coleção | Responsável | Referencia | Referenciada por |
| --- | --- | --- | --- |
| alunos | Vinicius | — | matriculas.aluno |
| planos | Tiago | modalidades via modalidade | matriculas.plano |
| matriculas | Wolfegan | alunos, planos, instrutores | Relatórios (leitura) |
| instrutores | Andrieli | — | matriculas.instrutor |
| modalidades | Bruno | — | planos.modalidade |
| usuarios | Segurança / Wolfegan | — | JWT sub e guard de sessão |

Relatórios calcula dados das coleções existentes; não cria coleção. Produtos permanece como exemplo de código, sem módulo registrado na aplicação ativa e sem população no seed atual.

## Campos automáticos comuns às seis coleções

| Campo | Tipo | Obrigatoriedade | Regra | Pessoal | Exemplo |
| --- | --- | --- | --- | --- | --- |
| _id | ObjectId | Gerado | Chave primária e índice único automático | Sim quando identifica pessoa/vínculo | 665f1c2b9a1e4b0012345678 |
| createdAt | Date | Gerado | timestamps: true | Associável ao registro | 2026-11-11T15:00:00.000Z |
| updatedAt | Date | Gerado | Atualizado pelo Mongoose | Associável ao registro | 2026-11-11T15:30:00.000Z |
| __v | Number | Interno | Chave de versão padrão do Mongoose; pode aparecer na resposta | Não isoladamente | 0 |

Os campos de auditoria temporal não registram o usuário autor de cada alteração. A proteção de concorrência das matrículas compara status, não utiliza __v como controle geral de versão.

## alunos — A / Vinicius

Fonte: backend/src/alunos/schemas/aluno.schema.ts, DTOs e alunos.service.ts.

| Campo | Tipo | Obrigatoriedade | Regras | Pessoal | Exemplo |
| --- | --- | --- | --- | --- | --- |
| nome | String | Sim | trim; 3–80 caracteres | Sim | Maria Souza |
| email | String | Sim | trim, lowercase, único; DTO valida e-mail | Sim | maria.souza@email.com |
| telefone | String | Sim | trim; DTO exige (DD) DDDD-DDDD ou (DD) DDDDD-DDDD | Sim | (51) 99876-5432 |
| dataNascimento | Date | Sim | DTO recebe AAAA-MM-DD válido; service exige idade ≥14 | Sim | 2004-08-10T00:00:00.000Z |
| objetivo | String | Sim | emagrecimento, hipertrofia, condicionamento, saude | Sim, associado ao aluno | condicionamento |
| ativo | Boolean | Padrão | true; PATCH aceita booleano | Sim, associado ao cadastro | true |

Índices declarados: email único (unicidade e consulta de duplicidade), objetivo ascendente (filtro de GET /alunos?objetivo=saude), além de _id. A idade mínima pertence ao service, não é uma restrição de idade no schema.

## planos — B / Tiago

Fonte: backend/src/planos/schemas/plano.schema.ts, DTOs e planos.service.ts.

| Campo | Tipo | Obrigatoriedade | Regras | Pessoal | Exemplo |
| --- | --- | --- | --- | --- | --- |
| nome | String | Sim | trim; 3–60 caracteres; único com collation pt strength 2 | Não | Musculação trimestral |
| modalidade | ObjectId | Sim | ref Modalidade; service exige existente e ativa quando enviada | Não | 665f1c2b9a1e4b0012345671 |
| valorMensal | Number | Sim | ≥1; DTO limita a duas casas decimais | Não | 99.9 |
| duracaoMeses | Number | Sim | enum numérico 1, 3, 6, 12 | Não | 3 |
| ativo | Boolean | Padrão | true; exclusão define false | Não | true |

Índices: modalidade ascendente (consulta por vínculo), duracaoMeses ascendente (filtro da lista), nome único com collation (duplicidade sem distinguir caixa) e _id. A aplicação consulta nome exato por regex escapada; não há medição que comprove uso do índice nessa regex. Consultas que desejem usar a comparação por collation devem utilizar a mesma collation do índice.

A relação com modalidade é referência: a modalidade tem cadastro e ciclo de vida próprios e abastece vários planos. GET e PATCH populam nome e ativo; POST mantém ID. Não há cópia histórica do valor mensal na matrícula.

## matriculas — C / Wolfegan

Fonte: backend/src/matriculas/schemas/matricula.schema.ts, DTOs e matriculas.service.ts.

| Campo | Tipo | Obrigatoriedade | Regras | Pessoal | Exemplo |
| --- | --- | --- | --- | --- | --- |
| aluno | ObjectId | Sim | ref Aluno; existente e ativo na criação/reativação | Sim | 665f1c2b9a1e4b0012345673 |
| plano | ObjectId | Sim | ref Plano; existente e ativo na criação/reativação | Sim no contexto do vínculo | 665f1c2b9a1e4b0012345672 |
| instrutor | ObjectId | Sim | ref Instrutor; existente e ativo na criação/reativação | Sim | 665f1c2b9a1e4b0012345674 |
| dataInicio | Date | Sim | DTO AAAA-MM-DD; início novo/alterado ≥ hoje em São Paulo | Sim | 2099-12-01T00:00:00.000Z |
| status | String | Padrão | ativa; enum ativa, trancada, cancelada; transições no service | Sim | ativa |

Índices: aluno único parcial com partialFilterExpression status=ativa, nome uma_matricula_ativa_por_aluno; plano, instrutor e status ascendentes; _id automático. O índice parcial impede duas matrículas ativas do mesmo aluno inclusive sob criação simultânea, permitindo histórico trancado/cancelado. Não existe índice composto correspondente à ordenação dataInicio/_id atual; não presumir otimização dessa ordenação.

Referências evitam repetir os cadastros e permitem vários vínculos históricos. MongoDB não fornece chave estrangeira automática: a aplicação valida existência/atividade. Não existe remoção de matrícula pela API. Não há campos de dataFim, preço contratado ou data de pagamento. O schema garante o enum; o mapa de transições e as validações contextuais ficam no service.

## instrutores — D / Andrieli

Fonte: backend/src/instrutores/schemas/instrutor.schema.ts, DTOs e instrutores.service.ts.

| Campo | Tipo | Obrigatoriedade | Regras | Pessoal | Exemplo |
| --- | --- | --- | --- | --- | --- |
| nome | String | Sim | trim; 3–80 caracteres | Sim | João Lima |
| email | String | Sim | trim, lowercase, único; DTO valida e-mail | Sim | joao.personal@academia.com |
| telefone | String | Sim | trim; formato de telefone brasileiro no DTO | Sim | (51) 99876-5432 |
| cref | String | Sim | trim, uppercase; 6–15 caracteres; único | Sim | 012345-G/RS |
| turno | String | Sim | manha, tarde, noite | Sim | noite |
| ativo | Boolean | Padrão | true; exclusão define false | Sim | true |

Índices: email e cref únicos; turno ascendente para filtro; _id. O service consulta CREF sem distinguir caixa; o schema normaliza para maiúsculas. O formato exato de registro profissional não é verificado em serviço externo. Instrutores não referenciam modalidades; a referência ao instrutor pertence à matrícula.

## modalidades — E / Bruno

Fonte: backend/src/modalidades/schemas/modalidade.schema.ts, DTOs e modalidades.service.ts.

| Campo | Tipo | Obrigatoriedade | Regras | Pessoal | Exemplo |
| --- | --- | --- | --- | --- | --- |
| nome | String | Sim | trim; 3–50 caracteres; único com collation pt strength 2 | Não | Musculação |
| descricao | String | Não | trim; até 300 caracteres; DTO permite ausência/null | Não | Treino com pesos e aparelhos |
| intensidade | String | Sim | leve, moderada, intensa | Não | moderada |
| capacidadeMaxima | Number | Sim | Inteiro entre 1 e 50, validado em DTO e schema | Não | 20 |
| ativo | Boolean | Padrão | true; exclusão define false | Não | true |

Índices: intensidade ascendente (filtro), nome único com collation e _id. A capacidade é apenas atributo do cadastro; não há coleção de turmas nem contagem de vagas vinculada à matrícula. Relação com planos é referência porque modalidades são compartilhadas por vários planos.

## usuarios — Segurança / Wolfegan

Fonte: backend/src/usuarios/schemas/usuario.schema.ts, DTOs, usuarios.service.ts e auth/.

| Campo | Tipo | Obrigatoriedade | Regras | Pessoal | Exemplo |
| --- | --- | --- | --- | --- | --- |
| nome | String | Sim | trim; 3–80 caracteres | Sim | Administrador |
| email | String | Sim | trim, lowercase, único; DTO valida e-mail | Sim | admin@sistema.com |
| senhaHash | String | Gerado pelo service | bcrypt custo 10; required; select:false | Credencial | Hash bcrypt, nunca a senha |
| perfil | String | Padrão | consulta; admin, atendente, consulta | Sim | admin |
| ativo | Boolean | Padrão | true; guard recusa usuário inativo | Sim | true |

Índices: email único para login/duplicidade; perfil ascendente; _id. O campo senha recebido no DTO não é persistido. senhaHash é selecionado explicitamente apenas na consulta necessária ao login e removido da resposta de criação. Não existe relação de usuario com aluno. O token fica no sessionStorage do navegador; não há coleção de sessões.

## Dados derivados dos relatórios

| Consulta | Campos e tipos | Origem / regra |
| --- | --- | --- |
| resumo | alunos:Number; matriculasAtivas:Number; matriculasTrancadas:Number | countDocuments com filtros |
| receitaPorPlano | plano:String; matriculas:Number; receitaMensal:Number | Matrículas ativas, lookup de planos, soma do preço atual e round 2 |
| alunosPorObjetivo | _id:String; quantidade:Number | Alunos ativos agrupados por objetivo |

## Ciclo de vida e dados de exemplo

O seed usa upsert/$setOnInsert para preservar registros existentes, e insere matrícula de exemplo somente se o aluno ainda não tem matrícula. Em banco vazio produz cinco registros em cada uma das cinco coleções operacionais e três usuários de perfis diferentes. Ordem de dependência: modalidade antes do plano; aluno, plano e instrutor antes da matrícula. Não apaga/recria o banco, apesar da descrição antiga em backend/README.md.

Inativação preserva referências e histórico; não há cascata. Uma matrícula ativa pode continuar apontando para cadastro posteriormente inativado. As validações de service não constituem uma transação única envolvendo todas as coleções. O relatório utiliza os vínculos e valores presentes no momento da consulta.
