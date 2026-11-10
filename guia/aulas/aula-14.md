# Aula 14 — Robustez, Tratamento Global de Erros, Logs e Documentação

> Apresentação: **Entrega Profissional de Projetos Full-Stack — Aulas 14 e 15** (slides 1 a 10 e 16, no Classroom).
> Versão usada em todo o projeto: **NestJS 11 · ExceptionFilter · Logger · Swagger · Jest 30**.

Esta página liga cada conceito da **Aula 14 (Robustez e Documentação)** a arquivos **reais** do projeto. O objetivo é transformar o sistema em uma aplicação profissional: padronizar respostas de erro, registrar logs para auditoria e diagnóstico, rodar a validação completa com testes e fechar a documentação antes da banca final.

## Onde ver cada conceito no projeto

| Slide | Conceito | Onde está no projeto |
| --- | --- | --- |
| 2–4 | Robustez e ciclo do tratamento de erros (identificação → captura → classificação → resposta → registro) | `backend/src/common/filters/excecoes.filter.ts` |
| 3 | Tipos de falha: entrada (400), inconsistência (401), regra (403/409) e inesperada (500) | `main.ts` (`ValidationPipe`), `auth/` (Guards), `service.ts` e `excecoes.filter.ts` |
| 5 | Filtro global de exceções (`ExcecoesFilter`) e formato padrão de erro | `backend/src/common/filters/excecoes.filter.ts` · registro em `backend/src/main.ts` |
| 5 | Teste obrigatório do filtro (6 testes) | `backend/testes-obrigatorios/excecoes.filter.spec.ts` |
| 6 | Uma mensagem para cada público: usuário (acionável) × desenvolvedor (no log) | `excecoes.filter.ts`: resposta JSON amigável × `logger.warn` e `logger.error` |
| 7 | Logs: a memória do sistema (eventos de negócio, falhas, contexto e auditoria) | `backend/src/produtos/produtos.service.ts` (`this.logger.log`) e terminal da API |
| 8 | Validação final: funcionamento, casos extremos, testes (`npm run test:cov`) e plano de testes | `docs/plano-de-testes.docx` · `backend/` |
| 9 | Documentação técnica no `README.md` e decisões de arquitetura (ADRs) | `README.md` na raiz do projeto · template preenchido em `guia/exemplos/` |
| 10 | Swagger completo e Manual do Usuário | Swagger em `http://localhost:3000/api/docs` · `docs/manual-do-usuario.docx` |

## Experimente antes de começar

1. Abra [`backend/src/produtos/produtos.service.ts`](../../backend/src/produtos/produtos.service.ts) e veja os logs de evento adicionados:
   ```ts
   private readonly logger = new Logger(ProdutosService.name);
   // ao criar:
   this.logger.log(`Produto criado: ${criado._id}`);
   // ao remover:
   this.logger.log(`Produto excluído: ${id}`);
   ```
2. Abra [`backend/src/common/filters/excecoes.filter.ts`](../../backend/src/common/filters/excecoes.filter.ts): este é o esqueleto do filtro global entregue pelo professor.
3. Abra [`backend/testes-obrigatorios/excecoes.filter.spec.ts`](../../backend/testes-obrigatorios/excecoes.filter.spec.ts): ele contém os **6 testes obrigatórios** que definem o comportamento do filtro global.

## 1. Tratamento Global de Erros: `ExcecoesFilter` (slides 4 a 6)

Sem um filtro global, erros inesperados (como banco fora do ar ou propriedade de `undefined`) devolvem mensagens técnicas com stack trace ou saem sem formato previsível. O filtro global captura **qualquer** erro da aplicação, classifica e devolve um JSON padronizado:

```json
{
  "sucesso": false,
  "status": 404,
  "message": "Produto não encontrado",
  "caminho": "/api/v1/produtos/6720f1a2e611",
  "dataHora": "2026-11-09T19:42:10.123Z"
}
```

> **Atenção (slide 5):** o campo principal de erro chama-se `message` — o mesmo nome que o método `tratarErro` do `ProdutosApiService` no front-end já lê. Assim, a integração com o Angular continua funcionando perfeitamente sem alterar o front!

### Como implementar os TODOs do filtro

Em `backend/src/common/filters/excecoes.filter.ts`:

1. **Mensagem (`TODO 1`):**
   - Se a exceção for instância de `HttpException`: use a mensagem vinda de `excecao.getResponse()`.
   - Se for um erro inesperado do servidor (não-HttpException): devolva sempre a mensagem amigável `'Erro interno. Tente novamente mais tarde.'` (nunca exponha o stack trace ou comandos SQL/Mongo no JSON!).
2. **Log (`TODO 2`):**
   - Se `status >= 500`: registre com `this.logger.error(`${metodo} ${url} → ${status}`, stack)`.
   - Se erro do cliente (`status < 500`): registre aviso com `this.logger.warn(`${metodo} ${url} → ${status} ${mensagem}`)`.

### Como rodar os testes obrigatórios

O responsável por **Testes e Qualidade** conduz este passo:

1. Copie `backend/testes-obrigatorios/excecoes.filter.spec.ts` para `backend/src/common/filters/excecoes.filter.spec.ts`.
2. Rode `npm test` no terminal do `backend`.
3. Quando os **6 testes passarem**, registre o filtro global no `backend/src/main.ts`:
   ```ts
   import { ExcecoesFilter } from './common/filters/excecoes.filter';

   // dentro de bootstrap(), antes do app.listen:
   app.useGlobalFilters(new ExcecoesFilter());
   ```

## 2. Logs e Rastreabilidade (slide 7)

Cada aluno adiciona logs de evento nos métodos principais do seu service (`criar`, `atualizar`, `mudarStatus`, `remover`):

```ts
private readonly logger = new Logger(MeuService.name);

async criar(dto: CreateDto) {
  // ... regras e criação ...
  this.logger.log(`Item criado com sucesso: ${criado._id}`);
  return criado;
}
```

> **Atenção à segurança (slide 7):** o log também pode vazar dados! Registre identificadores (`_id`), método e rota. **Nunca** registre senhas, hashes, tokens JWT ou dados sensíveis (como números de cartão ou senhas de usuários).

## 3. Validação Completa do Sistema (slide 8)

O papel **Testes e Qualidade** reúne a equipe e executa a checagem ponta a ponta:

1. **Testes automatizados e cobertura:**
   ```bash
   cd backend
   npm run test:cov
   ```
   Abra `coverage/lcov-report/index.html` no navegador e confira se todos os services e testes obrigatórios estão cobertos.
2. **Plano de testes executado:**
   Atualize o arquivo `docs/plano-de-testes.docx` marcando os cenários testados com sucesso e registrando o histórico de correções (bugs encontrados e resolvidos).
3. **Fluxos no navegador:**
   - Login como atendente e como admin;
   - Criar, listar, filtrar e editar registros reais em cada tela;
   - Tentar exclusão como atendente (deve exibir aviso amigável e bloquear com `403`);
   - Testar campos vazios e validações de formulário.

## 4. Documentação Técnica: README e ADRs (slide 9)

O papel **Documentação e Apresentação** coordena o preenchimento do `README.md` na raiz do projeto (veja o exemplo em [`guia/exemplos/`](../exemplos/)):

- **Sobre o sistema:** 3 a 5 linhas explicando o problema, público e proposta de valor;
- **Integrantes, módulos e papéis:** tabela com o nome de cada aluno e seu respectivo módulo e papel transversal;
- **Regras de negócio implementadas:** tabela com código (RN01, RN02...), regra, módulo e arquivo onde ela vive;
- **Perfis de acesso:** o que cada perfil (`admin`, `atendente`) pode e não pode fazer;
- **Decisões Técnicas (ADRs):** cada integrante da equipe escreve pelo menos uma ADR explicando uma decisão importante tomada no seu módulo. Formato:
  ```markdown
  ### ADR 01 — Atendimento referencia o cliente por id
  - **Contexto:** o mesmo cliente aparece em vários atendimentos ao longo do tempo.
  - **Decisão:** guardar apenas o `clienteId` e usar `.populate('cliente')` nas consultas.
  - **Consequência:** o telefone e endereço do cliente ficam sempre atualizados em todos os registros antigos; gera uma consulta adicional com join virtual.
  ```
- **Limitações conhecidas e próximos passos:** visão crítica com sinceridade técnica (ex.: falta de paginação com grandes volumes, recuperação de senha por e-mail).

## 5. Swagger Completo e Manual do Usuário (slide 10)

- **Swagger:** confira se todas as rotas de todos os módulos têm descrição clara (`@ApiOperation`), exemplos nos campos (`@ApiProperty`), parâmetros de query (`@ApiQuery`) e todas as respostas possíveis (`@ApiResponse`).
- **Manual do Usuário:** preencha `docs/manual-do-usuario.docx` com linguagem simples voltada para quem usa o sistema, contendo o passo a passo com prints das telas do sistema.

## Atividade da aula (slide 16 — Checkpoint C5, parte 1)

Antes de começar, o papel **Git e Integração** traz esta atualização da base (`base-v1.7`) para a branch `develop`.

- [ ] **Testes e Qualidade:** copiar `excecoes.filter.spec.ts`, implementar os TODOs de `backend/src/common/filters/excecoes.filter.ts` até os 6 testes passarem, registrar o filtro em `main.ts` e rodar `npm run test:cov`
- [ ] **Testes e Qualidade:** executar o plano de testes completo e consolidar `docs/plano-de-testes.docx`
- [ ] **Todos os alunos:** adicionar logs com `this.logger.log(...)` nos métodos de ação dos seus services
- [ ] **Todos os alunos:** escrever pelo menos uma ADR do seu módulo na seção de Decisões Técnicas do `README.md`
- [ ] **Documentação:** preencher o `README.md` do grupo e finalizar o `docs/manual-do-usuario.docx`
- [ ] **Todos os alunos:** responder às **perguntas de verificação da Aula 14** em `docs/respostas-<nome>.md`:
  1. Qual a diferença entre a mensagem que o usuário vê na resposta e o que vai para o log do servidor?
  2. Cite uma limitação conhecida do seu módulo e como você a resolveria em uma versão futura.

> Na **Aula 15**, a equipe faz o merge final na `main`, gera a tag **`v1.0`** e realiza a apresentação para a banca examinadora. Siga para [`guia/aulas/aula-15.md`](aula-15.md).

