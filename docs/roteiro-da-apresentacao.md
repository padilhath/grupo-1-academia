# Roteiro da Apresentação — Turma da Bomba

Grupo 1 · Academia · Consolidação: Alexa · Versão 1.0 · 11/11/2026

## Distribuição dos 17 minutos

| Intervalo | Duração | Quem | Conteúdo |
| --- | --- | --- | --- |
| 00:00–01:00 | 1 min | Vinicius | Problema das planilhas; persona ilustrativa da recepção |
| 01:00–02:00 | 1 min | Vinicius | Proposta de valor; seis módulos e limites do MVP |
| 02:00–09:00 | 7 min | Todos | Demonstração guiada abaixo |
| 09:00–11:00 | 2 min | Alexa, com apoio da equipe | Decisões, evidências de testes e próximos passos |
| 11:00–17:00 | 6 min | Quem a banca chamar | Perguntas técnicas com código, testes e Swagger |

Divisão sugerida conforme os módulos do README, sem afirmar que o ensaio já ocorreu.

## Preparação

1. Usar um banco de demonstração e seguir operacao-e-arquitetura.md para configurar o ambiente. Conferir JWT_SECRET antes de iniciar a API.
2. Executar o seed nesse ambiente: preserva dados já existentes, portanto não garante restaurar um cenário anteriormente alterado.
3. Conferir login dos três perfis. Usuários iniciais: admin@sistema.com, atendente@sistema.com e consulta@sistema.com. Senha padrão Admin@123 somente se criados com o seed padrão; SEED_PASSWORD pode ser diferente.
4. Preparar um aluno sem matrícula ativa e nomes/e-mails inéditos para a demonstração. Não reutilizar exemplos já inativados com campos únicos.
5. Deixar abertos interface, Swagger, código e MongoDB Compass. Preparar registros descartáveis para cancelamento e inativação.
6. Executar os casos manuais do Plano de Testes, capturar as telas do Manual e ensaiar com cronômetro.

## Demonstração de sete minutos

| Intervalo | Quem | Ação | Regra / explicação |
| --- | --- | --- | --- |
| 02:00–03:00 | Wolfegan | Entrar como consulta, mostrar ausência de ações de edição; sair e entrar como admin | Autenticação e autorização; cadastro público não eleva perfil |
| 03:00–04:00 | Bruno | Abrir Modalidades, filtrar intensidade e criar modalidade inédita | Capacidade inteira de 1 a 50 e nome único |
| 04:00–05:00 | Tiago | Criar plano ligado à modalidade recém-criada e filtrar duração | Referência existente/ativa e duração em 1,3,6,12 |
| 05:00–06:00 | Andrieli | Mostrar instrutor ativo e edição de turno; demonstrar tentativa com CREF repetido | Unicidade do CREF; referência para matrícula |
| 06:00–07:00 | Vinicius | Criar aluno adulto com e-mail inédito e filtrar objetivo | Idade mínima de 14; e-mail único |
| 07:00–08:00 | Wolfegan | Criar matrícula com início no dia, trancar e reativar em Tabela | Uma ativa por aluno; transições e validação no servidor |
| 08:00–09:00 | Alexa | Abrir relatórios e localizar o plano da matrícula | Receita mensal prevista usa preço atual e apenas matrículas ativas |

Evitar cancelar a matrícula principal antes de mostrar a receita. Se sobrar tempo, cancelar um registro descartável e demonstrar que não pode reativá-lo. Campos preenchidos previamente e registros de apoio ajudam a respeitar o tempo.

## Decisões técnicas a defender

| Decisão | Justificativa | Alternativa e consequência |
| --- | --- | --- |
| Cadastro compartilhado por ObjectId | Atualizar uma entidade em um lugar; reutilizar em planos/matrículas | Embutir tudo duplicaria contatos e nomes |
| Inativação de cadastros | Preservar referências e histórico | Remoção física criaria referências ausentes |
| Índice único parcial por aluno ativo | Garante a regra inclusive em concorrência | Apenas findOne antes de criar admite corrida |
| Status em rota específica | Impede mudança pelo PATCH de dados e centraliza transições | Status livre permitiria transições inválidas |
| JWT e perfil atual consultado no banco | Identidade assinada com permissão atual, inclusive após mudança de perfil | Confiar apenas no perfil do token mantém permissão antiga até expirar |
| Relatórios por agregação | Calcular sobre os dados atuais sem coleção duplicada | Totais armazenados exigiriam sincronização |

As ADRs em operacao-e-arquitetura.md descrevem decisões observadas no código; autoria e aprovação histórica não foram inferidas.

## Evidências e limitações para os dois minutos finais

Em 11/11/2026 passaram 89 testes unitários e 14 integrados. Cobertura global de linhas do Jest: 48,29%; os seis services do domínio possuem de 94,82% a 100%. A cobertura global inclui código que a suíte unitária não executa; não apresentar o percentual dos services como cobertura total do sistema.

Identificamos ausência de paginação, recuperação de senha, vencimento automático e ocupação de turmas. O MVP prioriza integridade de cadastros, acesso por perfil e ciclo da matrícula. Próximos passos: concluir evidência visual e testes de interface, paginar listas, guardar valor histórico se houver cobrança, modelar turmas/vencimentos conforme necessidade do negócio. A receita é prevista, não recebimento financeiro.

## Perguntas da banca e onde demonstrar

| Pergunta | Evidência |
| --- | --- |
| Onde é validada a idade? | backend/src/academia/validacao.ts e alunos.service.spec.ts |
| Como evita duas matrículas simultâneas? | Índice parcial no schema e teste integrado de concorrência |
| Por que não basta esconder botão? | @Perfis no controller e chamada direta no Swagger com perfil consulta |
| Onde a senha fica? | usuarios.service.ts, bcrypt.hash com custo 10 e select:false no schema |
| O que o JWT contém? | auth.service.ts e configuração de uma hora em auth.module.ts |
| Como o nome da referência aparece? | populate nos services e textoDe/idDe no front |
| O que acontece em erro inesperado? | ExcecoesFilter e teste que preserva mensagem genérica e registra stack no servidor |
| O que significa a receita? | Pipeline receitaPorPlano: match de ativa, lookup e soma de valorMensal atual |

## Checklist da entrega

- [ ] API, interface e contas conferidas no ambiente da banca.
- [ ] Casos manuais executados e capturas reais disponíveis como reserva.
- [ ] Ensaio completo com os seis integrantes e cronômetro.
- [ ] README da raiz revisado pela equipe: ainda contém seções de preenchimento.
- [ ] Documentos e respostas individuais revisados pelos responsáveis.
- [ ] PRs integrados conforme CONTRIBUTING.md; CI aprovado.
- [ ] Merge para main e tag v1.0 realizados pelo fluxo de entrega da equipe.

A versão 1.0 dos documentos não afirma que exista tag v1.0, aprovação do PO, merge final ou apresentação realizada.
