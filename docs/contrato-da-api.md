# Contrato da API — Turma da Bomba

Grupo 1 · Academia · Versão documental 1.0 · 11/11/2026

## Convenções

Base local: http://localhost:3000/api/v1. Swagger: http://localhost:3000/api/docs. Enviar JSON com Content-Type: application/json. O prefixo /api/v1 está implícito nas tabelas. Toda rota de negócio exige Authorization: Bearer TOKEN, exceto login e cadastro público.

Sucesso com conteúdo: `{"sucesso":true,"dados":...}`. Listagens retornam array diretamente em dados, sem paginação. DELETE bem-sucedido responde 204 sem corpo. Falhas inesperadas podem retornar 500 em qualquer operação.

```json
{
  "sucesso": false,
  "status": 400,
  "message": ["Informe um e-mail válido"],
  "caminho": "/api/v1/alunos",
  "dataHora": "2026-11-11T15:00:00.000Z"
}
```

message pode ser texto ou array. Datas de entrada são AAAA-MM-DD para nascimento e início, com validação de calendário; datas persistidas e timestamps saem como ISO 8601. IDs são ObjectId serializados como texto hexadecimal. Campo extra no corpo é erro 400; propriedades de criação obrigatórias não aceitam null. PATCH aceita subconjunto dos campos; campos obrigatórios do modelo, quando enviados como null, são inválidos. descricao é opcional e usa IsOptional, que também dispensa validação quando null.

Perfis abreviados: A=admin, T=atendente, C=consulta. Nos recursos protegidos, 401 indica token ausente/inválido/expirado ou usuário indisponível/inativo; 403 indica perfil sem permissão. O guard consulta o usuário no banco para usar seu perfil atual.

## Autenticação e usuários

| Método | Rota | Corpo | dados / sucesso | Perfis | Erros previstos |
| --- | --- | --- | --- | --- | --- |
| POST | /auth/login | email, senha | 200: accessToken, usuario | Público | 400, 401 |
| POST | /auth/cadastro | nome, email, senha | 201: usuário sem senhaHash, perfil consulta | Público | 400, 409 |
| GET | /auth/me | — | 200: usuário atual sem senhaHash | A,T,C | 401 |
| POST | /usuarios | nome, email, senha, perfil opcional | 201: usuário sem senhaHash | A | 400, 401, 403, 409 |

Nome de usuário: 3–80 caracteres. E-mail válido, com trim e lowercase. Nova senha: 8–72 caracteres e no máximo 72 bytes UTF-8. Login admite senha não vazia com os mesmos limites máximos. perfil aceita admin, atendente e consulta; omitido na criação administrativa, assume consulta. Cadastro público não aceita perfil.

```json
{"email":"admin@sistema.com","senha":"Admin@123"}
```

```json
{
  "sucesso": true,
  "dados": {
    "accessToken": "TOKEN_JWT",
    "usuario": {"_id":"665f1c2b9a1e4b0012345670","nome":"Administrador","perfil":"admin"}
  }
}
```

O token é HS256, válido por uma hora, com sub, nome, perfil e os campos temporais gerados pela biblioteca (iat/exp). A senha ilustrativa acima corresponde ao seed padrão somente quando a conta foi criada sem SEED_PASSWORD personalizado. Não existem rotas de refresh, logout no servidor, recuperação, edição ou listagem de usuários. Logout remove a sessão no navegador.

## Cadastros A, B, D e E

Responsáveis: Alunos/Vinicius, Planos/Tiago, Instrutores/Andrieli, Modalidades/Bruno.

As cinco operações abaixo existem para cada um dos recursos /alunos, /planos, /instrutores e /modalidades.

| Método | Rota | Corpo | dados / sucesso | Perfis | Erros previstos |
| --- | --- | --- | --- | --- | --- |
| GET | /recurso | — | 200: array de registros | A,T,C | 400, 401 |
| GET | /recurso/:id | — | 200: registro | A,T,C | 400, 401, 404 |
| POST | /recurso | Campos da tabela seguinte | 201: registro criado | A,T | 400, 401, 403, 409; plano também 404 |
| PATCH | /recurso/:id | Campos parciais + ativo opcional | 200: registro atualizado | A,T | 400, 401, 403, 404, 409 |
| DELETE | /recurso/:id | — | 204: inativação, sem corpo | A | 400, 401, 403, 404 |

| Recurso | Campos obrigatórios de POST | Campo opcional de POST | Filtro de GET |
| --- | --- | --- | --- |
| /alunos | nome, email, telefone, dataNascimento, objetivo | — | objetivo: emagrecimento, hipertrofia, condicionamento, saude |
| /planos | nome, modalidade, valorMensal, duracaoMeses | — | duracaoMeses: 1, 3, 6, 12 |
| /instrutores | nome, email, telefone, cref, turno | — | turno: manha, tarde, noite |
| /modalidades | nome, intensidade, capacidadeMaxima | descricao | intensidade: leve, moderada, intensa |

Todos aceitam `?todos=true` para incluir inativos, combinado com o filtro específico, por exemplo `/alunos?objetivo=saude&todos=true`. todos aceita somente os textos true ou false; enum de filtro inválido responde 400. Ordenação por nome crescente. GET por ID pode recuperar inativos. Não há parâmetro de busca textual implementado. Parâmetros de query desconhecidos não são validados por DTO e não devem ser tratados como filtros suportados.

POST não aceita ativo. PATCH aceita ativo booleano, permitindo reativar via API tanto a admin quanto a atendente. A interface atual não oferece uma tela de recuperação de inativos. Não há exclusão física desses quatro recursos.

Validações dos campos e índices estão detalhados em dicionario-de-dados.md. Plano só aceita referência de modalidade existente e ativa quando enviada; e-mails, CREF e nomes únicos continuam reservados mesmo em documentos inativos.

### Exemplos de criação

Os IDs abaixo são ilustrativos; substitua pelos devolvidos pelos cadastros reais.

```json
{"nome":"Maria Souza","email":"maria.souza@email.com","telefone":"(51) 99876-5432","dataNascimento":"2004-08-10","objetivo":"condicionamento"}
```

```json
{"nome":"Musculação","descricao":"Treino com pesos e aparelhos","intensidade":"moderada","capacidadeMaxima":20}
```

```json
{"nome":"Musculação trimestral","modalidade":"665f1c2b9a1e4b0012345671","valorMensal":99.90,"duracaoMeses":3}
```

```json
{"nome":"João Lima","email":"joao.personal@academia.com","telefone":"(51) 99876-5432","cref":"012345-G/RS","turno":"noite"}
```

### Formato de saída dos cadastros

Cada registro contém seus campos, _id, ativo, createdAt e updatedAt; pode incluir __v do Mongoose. A API não possui uma transformação global que remova __v. dataNascimento é devolvida em ISO. Nas consultas de planos e no PATCH de plano, modalidade é populada como objeto com _id, nome e ativo, ou null se a referência foi removida fora da aplicação. No POST de plano, modalidade permanece ID. Os demais cadastros não têm referências.

```json
{
  "sucesso": true,
  "dados": {
    "_id":"665f1c2b9a1e4b0012345672",
    "nome":"Musculação trimestral",
    "modalidade":{"_id":"665f1c2b9a1e4b0012345671","nome":"Musculação","ativo":true},
    "valorMensal":99.9,"duracaoMeses":3,"ativo":true,
    "createdAt":"2026-11-11T15:00:00.000Z","updatedAt":"2026-11-11T15:00:00.000Z"
  }
}
```

## Módulo C — Matrículas (Wolfegan)

| Método | Rota | Corpo | dados / sucesso | Perfis | Erros previstos |
| --- | --- | --- | --- | --- | --- |
| GET | /matriculas | — | 200: array; filtro status opcional | A,T,C | 400, 401 |
| GET | /matriculas/:id | — | 200: matrícula | A,T,C | 400, 401, 404 |
| POST | /matriculas | aluno, plano, instrutor, dataInicio | 201: matrícula ativa | A,T | 400, 401, 403, 404, 409 |
| PATCH | /matriculas/:id | Subconjunto dos campos de criação | 200: matrícula atualizada | A,T | 400, 401, 403, 404, 409 |
| PATCH | /matriculas/:id/status | status | 200: matrícula com novo estado | A,T | 400, 401, 403, 404, 409 |

Não existe DELETE. status só entra na rota própria; não é permitido no POST nem no PATCH comum. Filtro e corpo aceitam ativa, trancada, cancelada. Ordenação por dataInicio decrescente e _id decrescente. GET popula aluno, plano e instrutor com _id, nome e ativo; POST e PATCH retornam referências como IDs.

```json
{"aluno":"665f1c2b9a1e4b0012345673","plano":"665f1c2b9a1e4b0012345672","instrutor":"665f1c2b9a1e4b0012345674","dataInicio":"2099-12-01"}
```

```json
{"status":"trancada"}
```

Criação exige referências existentes e ativas, início a partir de hoje no fuso America/Sao_Paulo e ausência de outra matrícula ativa do aluno. PATCH valida as referências enviadas; se altera aluno de uma matrícula ativa, verifica duplicidade. Data histórica inalterada continua válida. Reativação valida todas as três referências e unicidade. Transições: ativa → trancada/cancelada; trancada → ativa/cancelada; cancelada → nenhum destino. Conflito na comparação do status durante gravação resulta em 409. Esse mecanismo não impede toda edição simultânea quando o status permanece igual.

## Módulo F — Relatórios (Alexa)

Somente admin; sem corpo ou filtro. Erros comuns: 401, 403 e 500. Todos retornam 200 com o envelope de sucesso.

| GET | Conteúdo de dados |
| --- | --- |
| /relatorios/resumo | Objeto com alunos, matriculasAtivas, matriculasTrancadas |
| /relatorios/receita-por-plano | Array com plano, matriculas, receitaMensal |
| /relatorios/alunos-por-objetivo | Array com _id (objetivo), quantidade |

```json
{"sucesso":true,"dados":{"alunos":5,"matriculasAtivas":2,"matriculasTrancadas":2}}
```

```json
{"sucesso":true,"dados":[{"plano":"Musculação mensal","matriculas":1,"receitaMensal":99.9}]}
```

```json
{"sucesso":true,"dados":[{"_id":"saude","quantidade":2}]}
```

Sem dados, totais são zero e agregações retornam []. Receita usa apenas matrículas ativas e o preço mensal atual do plano, arredondado para duas casas; não representa pagamentos recebidos. Ordenação por receita decrescente/nome e quantidade decrescente/objetivo. Um plano inativo ainda participa se houver matrícula ativa ligada a ele. Os relatórios não possuem coleção própria.

## Histórico de consolidação

| Data | Alteração documental | Motivo | Validação do PO |
| --- | --- | --- | --- |
| 11/11/2026 | Inventário das 32 rotas ativas: 20 cadastros, 5 matrículas, 3 relatórios, 3 auth, 1 usuários | Consolidar implementação existente | Pendente de revisão da equipe |
| 11/11/2026 | /auth/me e /auth/cadastro em lugar de assumir /auth/perfil do template | Controllers reais são a referência de comportamento | Pendente |
| 11/11/2026 | Variação de referências populadas, inativação dos quatro cadastros e conflitos de estado | Registrar respostas e regras reais | Pendente |

Produtos é exemplo preservado da base, mas ProdutosModule não está importado no AppModule: suas rotas não integram esta API ativa.
