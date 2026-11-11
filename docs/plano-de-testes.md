# Plano de Testes — Turma da Bomba

Grupo 1 · Academia · Qualidade: Andrieli · Consolidação documental: Alexa · 11/11/2026

## Estratégia e ambiente

U = unitário com Jest e mocks; I = integração HTTP com Supertest, NestJS e MongoDB real; S = segurança; M = manual no navegador. Testes automatizados foram executados nesta revisão; inspeção de código não equivale a teste visual. Nenhuma correção de implementação foi realizada nesta tarefa documental.

| Nível | Ferramenta | Meta / abrangência |
| --- | --- | --- |
| Unitário | Jest 30, ts-jest, modelos simulados | Regras de services, autenticação, guards, filtro e schemas |
| Integração | node:test + Supertest + MongoDB | Contratos HTTP, persistência, referências e concorrência |
| Manual | Navegador e Swagger | Fluxos de telas, mensagens, teclado e responsividade |
| Desempenho | Medição futura em ambiente definido | Meta proposta de até 2 s para listagens com 500 registros |

Em backend, executar os comandos abaixo; no PowerShell deste ambiente foi necessário usar npm.cmd, pois npm.ps1 é bloqueado pela política de execução.

```powershell
npm.cmd run test:cov -- --runInBand --silent
npm.cmd run test:e2e
```

Resultado de 11/11/2026: **13 suítes e 89 testes unitários aprovados; 1 suíte e 14 testes integrados aprovados, sem falhas ou casos ignorados**. Os testes integrados criam um banco exclusivo academia_teste_PID_TIMESTAMP em mongodb://127.0.0.1:27017, configuram segredo aleatório e removem somente esse banco ao concluir. Não usam o banco operacional nem dependem do seed.

Os logs de erro 500 durante o teste do filtro são provocados pelo cenário de falha simulado e não representam falha da suíte.

## Casos automatizados e rastreabilidade

OK significa cenário coberto por suíte executada e aprovada; o resultado não declara que todas as variações possíveis foram testadas.

| ID | Tipo | Referência | Entrada / passos | Resultado esperado | Obtido |
| --- | --- | --- | --- | --- | --- |
| CT01 | U/I/S | RNF02 | GET sem token nos seis módulos | 401, erro padronizado | OK |
| CT02 | U/I/S | RF25 | Token malformado, forjado ou expirado | 401 | OK |
| CT03 | U/S | RNF02 | Usuário inativo ou perfil alterado após emissão | Recusa inativo e usa perfil atual do banco | OK |
| CT04 | U/I/S | RF25 | Login com senha incorreta/e-mail inexistente | 401 Credenciais inválidas | OK |
| CT05 | U/S | RNF01 | Criar usuário e autenticar | Hash bcrypt no banco; hash ausente da resposta | OK |
| CT06 | I/S | RF26, RN15 | Cadastro público; repetir enviando perfil admin | Conta consulta; tentativa com perfil retorna 400 | OK |
| CT07 | I/S | RF27 | Atendente tenta criar usuário com perfil admin | 403 | OK; criação administrativa positiva fica em M01 |
| CT08 | U/I/S | Perfis | Atendente cria/edita e tenta DELETE/relatórios | Escrita permitida; ações de admin 403 | OK |
| CT09 | I/S | Perfis | Consulta lê listas/detalhes e tenta escrever | 200 para leitura; 403 para escrita | OK |
| CT10 | U/I | RF01–RF20 | Criar, consultar, filtrar e editar quatro cadastros | Dados persistidos e filtros coerentes | OK |
| CT11 | U/I | RN01 | Repetir e-mail de aluno | 409, sem segundo cadastro | OK |
| CT12 | U/I | RN02 | Nascimento abaixo de 14 anos na criação/edição | 400; aniversário exato de 14 aceito no teste unitário | OK |
| CT13 | U/I | RN03 | Plano com nome repetido, incluindo outra caixa | 409 | OK |
| CT14 | U/I | RN04 | Plano com modalidade inexistente ou inativa | 404 ou 400, respectivamente | OK |
| CT15 | U/I | RN08, RN09 | Repetir CREF/e-mail de instrutor | 409 | OK |
| CT16 | U/I | RN10 | Modalidade com nome repetido em outra caixa | 409 | OK |
| CT17 | I | RN17 | Capacidade fracionária; datas impossíveis; IDs inválidos | 400 | OK |
| CT18 | I | RNF04 | Propriedade extra ou null em campo obrigatório | 400, antes de persistir | OK |
| CT19 | U/I | RN11, RN12 | DELETE nos quatro cadastros e consultar de novo | 204 sem corpo; inativo ausente da lista padrão | OK |
| CT20 | U | RN12 | Listar com todos=true | Inclui inativos | OK |
| CT21 | U/I | RF09, RN13 | Criar matrícula com referências válidas e inválidas | 201 válida; 404 inexistente; 400 inativa | OK |
| CT22 | U/I | RN05 | Segunda matrícula ativa para o mesmo aluno | 409 | OK |
| CT23 | I | RN05 | Enviar duas criações simultâneas para o mesmo aluno | Somente uma ativa persiste; outra 409 | OK |
| CT24 | U/I | RN06 | Criar com data anterior a hoje | 400 | OK |
| CT25 | U/I | RF11, RN06 | Editar matrícula mantendo data histórica | Aceita sem invalidar a data antiga | OK |
| CT26 | U/I | RF12, RN07 | Ativa → trancada → ativa → cancelada | 200 em transições válidas | OK |
| CT27 | U/I | RN07 | Cancelada → ativa | 400, estado preservado | OK |
| CT28 | U | RN05 | Reativar quando outra matrícula já está ativa | 409 | OK |
| CT29 | U | RN16 | Estado muda entre leitura e gravação | 409 com orientação para atualizar a lista | OK |
| CT30 | U/I | RF21, RN14 | Consultar resumo e receita com documentos conhecidos | Totais coerentes e receita só de matrículas ativas | OK |
| CT31 | U/I | RF23 | Agrupar objetivos | Conta apenas alunos ativos | OK |
| CT32 | U | RF24 | Model de agregação retorna [] | Retorna [] sem inventar dados | OK |
| CT33 | U | RNF03 | HttpException e erro inesperado | Formato estável; 500 genérico; warn/error adequados | OK |
| CT34 | U | Modelagem | Inspecionar tipos de referências, índice parcial e seleção de senha | ObjectId, unicidade parcial e select:false | OK |

Fontes: backend/src/*/*.service.spec.ts, backend/src/auth/guards/*.spec.ts, backend/src/academia/schemas.spec.ts, backend/src/common/filters/excecoes.filter.spec.ts e backend/test/academia.e2e-spec.ts. Os testes de Produtos também são executados pelo Jest, embora o módulo não esteja ativo na API.

## Casos manuais a executar

Pré-condição: ambiente configurado conforme operacao-e-arquitetura.md, dados de demonstração e contas dos três perfis. Usar registros descartáveis nos testes de inativação/cancelamento.

| ID | Referência | Passos | Resultado esperado | Situação |
| --- | --- | --- | --- | --- |
| M01 | RF25–RF27 | Criar conta, entrar, sair e criar usuário como admin | Mensagens coerentes, perfil correto e navegação funcional | Não executado |
| M02 | RF01–RF20 | Em cada cadastro criar, filtrar, editar e excluir como admin | Confirmação; lista atualizada; dado inativado preservado | Não executado |
| M03 | RF09–RF12 | Matricular, editar, trancar, reativar e cancelar em modo Tabela | Botões válidos e mensagens claras | Não executado |
| M04 | RF02,06,10,14,18 | Alternar Tabela/Cartões com os três perfis | Mesmos registros, ações compatíveis com perfil | Não executado |
| M05 | RNF04 | Salvar formulários vazios e com telefone/preço/capacidade inválidos | Não enviar inválidos; mensagens junto aos campos | Não executado |
| M06 | RNF05 | Atualizar página autenticada e aguardar expiração | Restaura sessão válida; expiração leva ao login | Não executado |
| M07 | RF21–RF24 | Abrir relatórios; depois banco de demonstração vazio separado | Dados coerentes; estados vazios e tentativa após erro | Não executado |
| M08 | RNF06 | Navegar por Tab/Enter em 360 px e desktop | Foco visível, rótulos e conteúdo alcançáveis | Não executado |
| M09 | Robustez | Interromper API durante consulta e restabelecer | Mensagem compreensível; nova consulta funciona | Não executado |
| M10 | Perfis | Abrir URL de edição como consulta e relatório como atendente | Tela de acesso negado; API também recusa | Não executado |

## Cobertura medida

Métrica de linhas calculada pelo relatório Jest/Istanbul desta execução. Cobertura de linhas não mede automaticamente qualidade das asserções nem valida interface.

| Arquivo | Testes na suíte | Linhas cobertas |
| --- | --- | --- |
| alunos.service.ts | 9 | 100% |
| planos.service.ts | 10 | 100% |
| matriculas.service.ts | 13 | 94,82% |
| instrutores.service.ts | 9 | 100% |
| modalidades.service.ts | 8 | 100% |
| relatorios.service.ts | 4 | 100% |
| auth.service.ts | 5 | 100% |
| usuarios.service.ts | 3 | 79,16% |
| jwt-auth.guard.ts | 5 | 96,29% |
| perfis.guard.ts | 3 | 100% |
| excecoes.filter.ts | 6 | 78,57% |
| Todos os arquivos de src coletados pelo Jest | 89 no total | 48,29% |

As outras suítes são schemas/validações (6 testes) e Produtos (8). A cobertura global inclui controllers, DTOs, módulos, bootstrap e seed que o Jest unitário não executa. A suíte integrada roda separadamente e não contribui para esses percentuais. Relatório local gerado: backend/coverage/lcov-report/index.html, não versionado.

## Ocorrências e pendências

| ID | Caso | Observação | Impacto | Encaminhamento |
| --- | --- | --- | --- | --- |
| DOC01 | Preparação | README não orienta substituir JWT_SECRET de exemplo; API rejeita esse valor | Ambiente pode não iniciar | Procedimento correto documentado em operacao-e-arquitetura.md |
| DOC02 | Seed | README do backend descreve limpeza, mas código preserva dados | Expectativa incorreta | Comportamento real documentado |
| DOC03 | M01–M10 | Interface não foi exercitada nesta revisão | Evidência visual ainda ausente | Executar casos e anexar prints antes da banca |
| DOC04 | RNF07 | Nenhum benchmark realizado | Meta sem comprovação | Medir em massa de dados e ambiente definidos |

Não há registro de bug de implementação corrigido nesta tarefa. O critério para fechar a entrega pedagógica inclui os casos manuais e capturas, além das suítes automatizadas aprovadas. Build/lint do produto não foram reexecutados para esta alteração exclusivamente documental; o CI os executa no fluxo normal do repositório.
