# Aula 15 — Banca Final e Entrega do Projeto Integrador

> Apresentação: **Entrega Profissional de Projetos Full-Stack — Aulas 14 e 15** (slides 11 a 16, no Classroom).
> Versão usada em todo o projeto: **Tag v1.0 na branch main · Checkpoint C5**.

Esta aula marca a conclusão da Sprint 5 e do Projeto Integrador. O grupo apresenta o sistema funcionando de ponta a ponta para a banca examinadora, defende as decisões arquiteturais tomadas e fecha a entrega oficial do projeto com a tag `v1.0`.

## Onde ver cada conceito no projeto

| Slide | Conceito | Onde está no projeto |
| --- | --- | --- |
| 11 | Apresentação em equipe e estrutura do pitch (Problema → Proposta → Solução → Demonstração ao vivo) | Roteiro ensaiado a partir de `guia/exemplos/roteiro-da-apresentacao.docx` |
| 11 | Roteiro de 17 minutos cronometrados por grupo | `README.md` e divisão entre PO, Documentação e todos os integrantes |
| 12 | Pitch técnico em 4 passos e postura profissional (visão crítica com maturidade) | `README.md` (seções de ADRs, limitações e próximos passos) |
| 13 | Perguntas típicas que a banca costuma fazer | Código dos services, testes, Swagger, MongoDB Compass e logs da API |
| 14 | Erros que comprometem a entrega e boas práticas de handoff | Checklist de revisão final do projeto |
| 15 | Síntese de engenharia: Robustez técnica + Documentação e rastreabilidade + Comunicação | Sistema completo integrado |
| 16 | Checkpoint C5: versão final oficial do projeto | Branch `main` com tag `v1.0` e documentação completa |

## 1. O Roteiro da Banca (17 minutos cronometrados) (slide 11)

A apresentação tem tempo rigoroso e deve ser ensaiada previamente com a equipe:

| Tempo | O que apresentar | Quem fala |
| --- | --- | --- |
| **1 min** | **Problema e Persona:** contexto real, dores do usuário e quem é impactado pelo sistema | PO / Scrum Master |
| **1 min** | **Proposta de Valor e Escopo:** o que o sistema resolve e o que ficou delimitado no MVP | PO / Scrum Master |
| **7 min** | **Demonstração ao Vivo:** cada aluno demonstra o seu módulo funcionando pela tela (~1 min por aluno), mostrando o fluxo normal de cadastro/listagem e o login com perfis | Todos os alunos |
| **2 min** | **Decisões Técnicas e Limitações:** as principais ADRs adotadas, limitações conhecidas com visão crítica e os próximos passos | Documentação e Apresentação |
| **6 min** | **Perguntas da Banca:** o professor/banca faz perguntas técnicas para qualquer integrante | Quem o professor chamar |

> **Atenção (slide 11):** na banca, **qualquer aluno** pode ser chamado para responder ou explicar qualquer camada do projeto (incluindo o módulo de um colega ou as configurações de autenticação/banco).

## 2. As Perguntas que a Banca Costuma Fazer (slide 13)

Estude em dupla antes da apresentação. Pratiquem responder mostrando diretamente o código na tela:

| A banca pergunta | Onde mostrar | O que explicar |
| --- | --- | --- |
| *"Mostre no código a regra de negócio que você acabou de demonstrar."* | `<modulo>.service.ts` e o arquivo `.service.spec.ts` | Mostre o `if` que valida a regra contextual e o teste unitário com mock que garante que ela não é violada. |
| *"E se eu chamar essa rota sem token? E com o perfil errado?"* | Swagger (`http://localhost:3000/api/docs`) | Chame sem o botão Authorize → `401 Unauthorized`; chame autenticado como atendente em rota `@Perfis('admin')` → `403 Forbidden`. |
| *"Por que essa relação é referência e não dado embutido?"* | `<modulo>.schema.ts`, Dicionário de Dados e ADR no `README` | Explique a justificativa do negócio (ex.: dado com vida própria que abastece múltiplos registros × subdocumento que só existe dentro do pai). |
| *"Como a senha é guardada? Dá para descobrir olhando o banco?"* | MongoDB Compass e `usuario.schema.ts` | Mostre o hash `$2b$10$...` com salt gerado pelo `bcryptjs` e o `select: false` que impede o hash de vazar nas consultas normais. |
| *"O que o usuário vê quando acontece um erro? E onde fica registrado para os desenvolvedores?"* | Resposta da API no Swagger/tela e terminal da API | Mostre o JSON amigável retornado pelo `ExcecoesFilter` e a linha detalhada com método, URL e stack gerada pelo `this.logger` no terminal. |
| *"Se vocês fossem continuar o projeto na próxima sprint, o que fariam primeiro?"* | Seção de Limitações e Próximos Passos do `README.md` | Demonstre maturidade: fale sobre as limitações conhecidas (ex.: paginação, envio de e-mails, dashboard com gráficos) e a estratégia técnica para implementá-las. |

## 3. Ambiente Preparado Antes de Começar (slide 13)

Não perca tempo da banca abrindo programas na hora:

1. **Terminal 1:** API NestJS rodando (`npm run start:dev`) e visível para exibir os logs;
2. **Terminal 2:** Front-end Angular rodando (`npm start`);
3. **Navegador:** abas abertas com:
   - Aplicação em `http://localhost:4200` (com login já testado e banco populado via `npm run seed`);
   - Swagger em `http://localhost:3000/api/docs`;
4. **MongoDB Compass:** conectado e com a coleção aberta;
5. **VS Code:** com o projeto aberto e arquivos principais acessíveis (`README.md`, schemas, services e testes).

> Tenha **prints de reserva** das telas e respostas caso ocorra alguma instabilidade de rede ou energia durante a apresentação.

## 4. Finalização Oficial: Tag `v1.0` (slide 16)

Com todos os Pull Requests revisados e aprovados na branch `develop`, o responsável por **Git e Integração** realiza o merge final para a branch `main`:

```bash
# 1. Garanta que a develop do grupo está atualizada e com todos os testes verdes
git checkout develop
git pull

# 2. Vá para a branch principal main
git checkout main
git pull

# 3. Faça o merge da develop na main
git merge develop -m "chore: consolidação da versão v1.0 para a banca final"

# 4. Crie a tag oficial de lançamento v1.0
git tag -a v1.0 -m "Versão 1.0 — Entrega final da Sprint 5"

# 5. Envie a main e a tag para o GitHub do grupo
git push origin main --tags
```

## Atividade da aula (slide 16 — Entrega do Checkpoint C5)

- [ ] **Git e Integração:** realizar o merge de `develop` para `main`, gerar a tag **`v1.0`** e enviar para o repositório remoto
- [ ] **Documentação:** garantir que `README.md`, `docs/dicionario-de-dados.docx`, `docs/plano-de-testes.docx` e `docs/manual-do-usuario.docx` estão atualizados na `main`
- [ ] **Todos os alunos:** conferir se as respostas às perguntas de verificação (aulas 01 a 14) estão completas em `docs/respostas-<nome>.md`
- [ ] **Equipe:** realizar um ensaio completo da apresentação de 17 minutos com cronômetro
- [ ] **Apresentação:** realizar o pitch e a demonstração ao vivo para a banca avaliadora

### Critérios de avaliação da Banca (Checkpoint C5)

| Critério | Atende quando |
| --- | --- |
| **Erros padronizados e no log** | Erros tratados retornam JSON uniforme via `ExcecoesFilter` e falhas graves são registradas no logger sem expor dados sensíveis |
| **Documentação suficiente** | `README.md` completo com ADRs e limitações; Swagger com descrição em todas as rotas; manual do usuário compreensível |
| **Demonstração com regra** | Cada aluno demonstra o módulo funcionando pela interface gráfica e aponta a regra de negócio implementada no código |
| **Domínio e visão crítica** | A equipe demonstra conhecimento de ponta a ponta do projeto, responde às perguntas da banca sem evasão e discute as limitações com transparência técnica |

