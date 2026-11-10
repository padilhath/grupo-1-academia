# Atualizações do repositório base

Cada atualização tem uma etiqueta (*tag*) e diz se o grupo precisa fazer alguma coisa depois do merge.
Para receber: veja o **Passo 4** de [`COMECE-AQUI.md`](COMECE-AQUI.md).

---

## v1.7 — Aulas 14 e 15 · Robustez, Logs, Documentação e Banca Final (C5)

**Etiqueta:** `base-v1.7`

- Novo esqueleto do filtro global de exceções em `backend/src/common/filters/excecoes.filter.ts`, padronizando o formato de erros `{ sucesso: false, status, message, caminho, dataHora }` e separando mensagens amigáveis de logs técnicos (aula 14, slides 4 a 6).
- Novo teste obrigatório com 6 cenários em `backend/testes-obrigatorios/excecoes.filter.spec.ts` (atualizado em `backend/testes-obrigatorios/LEIA-ME.md`).
- `backend/src/produtos/produtos.service.ts` atualizado com exemplo de logs de eventos de negócio (`this.logger.log`) para auditoria e rastreabilidade (aula 14, slide 7).
- Roteiros das aulas em `guia/aulas/aula-14.md` (tratamento global de erros, logs, validação ponta a ponta e ADRs) e `guia/aulas/aula-15.md` (roteiro da banca de 17 min, postura, perguntas da banca e tag final `v1.0` na main — Checkpoint C5).

**O que o grupo precisa fazer:** só o merge. Nenhum arquivo do grupo foi alterado.

---

## v1.6 — Aulas 11, 12 e 13 · Regras de Negócio, JWT, Perfis e Integração (C4)

**Etiqueta:** `base-v1.6`

- `backend/src/produtos/produtos.controller.ts` atualizado com o decorator `@ApiBearerAuth()` para autorização no Swagger (aula 12, slide 9).
- `backend/.env.example` atualizado com a variável `JWT_SECRET` (mínimo de 32 caracteres para assinatura de tokens).
- Roteiros das aulas em `guia/aulas/aula-11.md` (regras no service, validação contextual, estados e relatórios com aggregation), `guia/aulas/aula-12.md` (autenticação com JWT, bcrypt, guard global e testes obrigatórios) e `guia/aulas/aula-13.md` (autorização por perfis, login no front, `usarMock: false` e entrega do Checkpoint C4).

**O que o grupo precisa fazer:** só o merge. Nenhum arquivo do grupo foi alterado.

---

## v1.5 — Aulas 09 e 10 · MVC, CRUD, DTOs, Testes e Swagger

**Etiqueta:** `base-v1.5`

- `backend/src/produtos/produtos.controller.ts` atualizado com todos os `@ApiResponse` (200, 201, 204, 400, 404 e 409) em todas as rotas do CRUD, alinhado aos slides das aulas 09 e 10.
- `backend/src/produtos/produtos.service.spec.ts` atualizado com os comentários de estrutura AAA (`Arrange` / `Act` / `Assert`) e dica para `.populate()`.
- Roteiros das aulas em `guia/aulas/aula-09.md` (MVC no NestJS e as 5 rotas do CRUD) e `guia/aulas/aula-10.md` (DTOs com `class-validator`, testes unitários com Jest, Swagger e entrega do Checkpoint C3).

**O que o grupo precisa fazer:** só o merge. Nenhum arquivo do grupo foi alterado.

---

## v1.4 — Aulas 07 e 08 · Banco de Dados com Mongoose

**Etiqueta:** `base-v1.4`

- `backend/src/produtos/schemas/produto.schema.ts` atualizado com as mensagens de validação nos `@Prop` (`required`, `minlength`, `maxlength`, `min` e `enum`), alinhado aos slides das aulas 07 e 08.
- Roteiros das aulas em `guia/aulas/aula-07.md` (modelagem e Dicionário de Dados) e `guia/aulas/aula-08.md` (schema, `forFeature`, `seed` e entrega do Checkpoint C2).

**O que o grupo precisa fazer:** só o merge. Nenhum arquivo do grupo foi alterado.

---

## v1.3 — Exemplos dos documentos do grupo

**Etiqueta:** `base-v1.3`

- Nova pasta `guia/exemplos/` com um exemplo preenchido de cada documento: Documento de Visão, Contrato da API, Dicionário de Dados, Plano de Testes, Manual do Usuário, Roteiro da Apresentação e as respostas às perguntas de verificação.
- Os exemplos descrevem um sistema fictício (*Bom Preço — Gestão do Mercadinho*), que não é um dos temas da turma.
- Links para os exemplos em `docs/LEIA-ME.md`, `guia/README.md` e `COMECE-AQUI.md`.

**O que o grupo precisa fazer:** só o merge. Se o grupo já tinha mudado o `docs/LEIA-ME.md` e der conflito, aceite as duas versões (**Accept Both Changes**).

---

## v1.2 — Ajuste dos temas e guia de Git

**Etiqueta:** `base-v1.2`

- O tema **Restaurante / delivery** saiu da disciplina: agora são **5 temas para 5 grupos**, um por grupo.
- Removido `guia/temas/restaurante-delivery.md` e as referências no `COMECE-AQUI.md` e em `guia/README.md`.
- Manual de Construção atualizado: o sorteio distribui os 5 temas entre os 5 grupos.
- Novo `guia/GIT-E-GITHUB.md`: passo a passo de Git e GitHub para iniciantes, com links no `COMECE-AQUI.md`, no `CONTRIBUTING.md`, em `guia/README.md` e em `guia/aulas/aula-02.md`.

**O que o grupo precisa fazer:** só o merge. Nenhum arquivo do grupo foi alterado.

---

## v1.1 — Aula 02 · Front-end com Angular

**Etiqueta:** `base-v1.1`

- Novo componente reutilizável `ProdutoCard` (`features/produtos/produto-card/`), com `input()` e `output()`.
- A listagem de Produtos ganhou os botões **Tabela / Cartões** (exemplo de `@if`, evento e componente filho).
- Estilos do cartão em `styles.css`.
- Roteiro da aula em `guia/aulas/aula-02.md`: onde ver cada conceito no projeto, atividade, entrega e critérios.

**O que o grupo precisa fazer:** só o merge. Nenhum arquivo do grupo foi alterado.

---

## v1.0 — Aula 01 · versão inicial

**Etiqueta:** `base-v1.0`

- Projeto base: Angular 21 + NestJS 11 + MongoDB, com o módulo de exemplo Produtos.
- Manuais dos 6 temas em `guia/temas/`.
- Receitas comuns em `guia/RECEITAS.md`.
- Manual de Construção, templates e responsabilidades em `guia/`.
- Testes automáticos em cada Pull Request (`.github/workflows/ci.yml`).
- Tipo `Referencia` e funções `idDe` / `textoDe` em `frontend/src/app/core/models/referencia.ts`.
- Arquivo `frontend/src/estilos-do-grupo.css` para os estilos do grupo.

**O que o grupo precisa fazer:** seguir o `COMECE-AQUI.md`.
