# Documento de Visão — Turma da Bomba

Grupo 1 · Academia · SENAI — Programador Full-Stack · Versão documental 1.0 · 11/11/2026

## 1. Problema

O controle de alunos e matrículas em planilhas dificulta identificar vínculos ativos, evitar duplicidades e calcular a receita prevista por plano. A recepção precisa consultar cadastros e alterar matrículas com segurança; a gestão precisa acompanhar indicadores sem reunir manualmente várias planilhas.

O guia também menciona planos vencidos e turmas lotadas. A implementação atual registra duração e capacidade, mas ainda não calcula vencimento nem controla ocupação de turmas. Essas necessidades permanecem como evolução do produto.

## 2. Persona

Persona ilustrativa para orientar o produto, sem representar pesquisa realizada: Ana, 32 anos, recepcionista de academia. Usa o computador durante o atendimento, especialmente no começo da noite. Quer localizar alunos, conferir planos e matricular sem repetir cadastros. Suas dificuldades são dados dispersos, e-mails duplicados e dúvidas sobre matrículas trancadas. Em um atendimento, consulta o aluno, seleciona um plano e um instrutor ativos e registra a matrícula com início no dia.

## 3. Proposta de valor

Centralizar cadastros e matrículas, aplicar regras no servidor e oferecer à gestão indicadores de alunos e receita mensal prevista por plano.

## 4. Escopo do MVP

Inclui cinco cadastros operacionais, relatórios, login, cadastro público de conta de consulta e criação administrativa de usuários. As listagens permitem filtros específicos e alternância entre tabela e cartões. Alunos, planos, instrutores e modalidades têm exclusão lógica; matrículas mantêm histórico por status.

Fora do MVP: cobrança e pagamento, emissão fiscal, recuperação de senha, envio de e-mail, controle de presença, prescrição de treinos, agenda e ocupação real de turmas, vencimento automático, preço histórico de contratação e paginação.

## 5. Módulos e responsáveis

| Integrante | Módulo | Papel transversal | Entrega |
| --- | --- | --- | --- |
| Vinicius | A — Alunos | PO / Scrum Master | Identificação, contato, nascimento e objetivo |
| Tiago | B — Planos | Git e Integração | Preço mensal, duração e modalidade |
| Wolfegan | C — Matrículas | Segurança | Vínculos, datas e estados; autenticação e perfis |
| Andrieli | D — Instrutores | Testes e Qualidade | Contatos, CREF e turno |
| Bruno | E — Modalidades | UX/UI e Acessibilidade | Intensidade e capacidade declarada |
| Alexa | F — Relatórios | Documentação e Apresentação | Totais e agregações do negócio |

Responsabilidades transcritas do README da raiz; a tabela não comprova autoria de commits nem execução de atividades individuais.

## 6. Requisitos funcionais

Os identificadores RF01–RF24 acompanham o manual de Academia. Prioridade alta para todos no MVP; a validação visual está separada no Plano de Testes.

| Código | Módulo | O sistema deve permitir/exibir |
| --- | --- | --- |
| RF01 | Alunos | Que admin e atendente cadastrem aluno |
| RF02 | Alunos | Que os três perfis consultem alunos ativos e filtrem por objetivo |
| RF03 | Alunos | Que admin e atendente editem aluno |
| RF04 | Alunos | Que admin inative aluno |
| RF05 | Planos | Que admin e atendente cadastrem plano ligado a modalidade |
| RF06 | Planos | Que os três perfis consultem planos ativos e filtrem por duração |
| RF07 | Planos | Que admin e atendente editem plano |
| RF08 | Planos | Que admin inative plano |
| RF09 | Matrículas | Que admin e atendente criem matrícula ativa |
| RF10 | Matrículas | Que os três perfis consultem matrículas e filtrem por status |
| RF11 | Matrículas | Que admin e atendente editem os dados da matrícula |
| RF12 | Matrículas | Que admin e atendente alterem status conforme transições permitidas |
| RF13 | Instrutores | Que admin e atendente cadastrem instrutor |
| RF14 | Instrutores | Que os três perfis consultem instrutores ativos e filtrem por turno |
| RF15 | Instrutores | Que admin e atendente editem instrutor |
| RF16 | Instrutores | Que admin inative instrutor |
| RF17 | Modalidades | Que admin e atendente cadastrem modalidade |
| RF18 | Modalidades | Que os três perfis consultem modalidades e filtrem por intensidade |
| RF19 | Modalidades | Que admin e atendente editem modalidade |
| RF20 | Modalidades | Que admin inative modalidade |
| RF21 | Relatórios | A admin os totais de alunos ativos e matrículas ativas/trancadas |
| RF22 | Relatórios | A admin matrículas ativas e receita mensal agrupadas por plano |
| RF23 | Relatórios | A admin alunos ativos agrupados por objetivo |
| RF24 | Relatórios | Mensagens explicativas quando não houver dados |
| RF25 | Autenticação | Login e consulta da identidade da sessão |
| RF26 | Autenticação | Cadastro público com perfil fixo consulta |
| RF27 | Usuários | Que admin crie usuário escolhendo um dos três perfis |

## 7. Requisitos não funcionais e evidências

| Código | Critério mensurável | Situação |
| --- | --- | --- |
| RNF01 | Senhas persistidas apenas como bcrypt com custo 10; respostas sem hash | Implementado; testes unitários |
| RNF02 | Rotas de negócio sem token retornam 401; perfil sem permissão recebe 403 | Guards globais; testes unitários e suíte integrada disponível |
| RNF03 | Erros têm sucesso, status, message, caminho e dataHora; 500 não expõe stack | Filtro implementado e testado |
| RNF04 | Campos não previstos nos DTOs são recusados com 400 | ValidationPipe global com forbidNonWhitelisted |
| RNF05 | JWT HS256 expira em uma hora; sessão no sessionStorage | Configuração e código implementados |
| RNF06 | Fluxos principais utilizáveis por teclado em 360 px e desktop | Critério de aceitação; validação manual pendente |
| RNF07 | Listagem responde em até 2 s com 500 registros em ambiente de teste definido | Meta proposta; desempenho não medido |

## 8. Regras de negócio

| Código | Regra implementada | Violação / resultado | Evidência em backend/src |
| --- | --- | --- | --- |
| RN01 | E-mail de aluno único, normalizado | 409 | alunos/alunos.service.ts e schema |
| RN02 | Aluno tem no mínimo 14 anos, inclusive na edição | 400 | academia/validacao.ts e alunos service |
| RN03 | Nome de plano único sem distinguir maiúsculas/minúsculas | 409 | planos service e índice com collation |
| RN04 | Modalidade informada ao plano existe e está ativa | 404 inexistente; 400 inativa | planos/planos.service.ts |
| RN05 | No máximo uma matrícula ativa por aluno | 409 | matriculas service e índice único parcial |
| RN06 | Início novo ou alterado não é anterior a hoje em São Paulo | 400 | academia/validacao.ts e matriculas service |
| RN07 | Status respeita o mapa de transições | 400 | matriculas/matriculas.service.ts |
| RN08 | CREF de instrutor único | 409 | instrutores service e schema |
| RN09 | E-mail de instrutor único | 409 | instrutores service e schema |
| RN10 | Nome de modalidade único sem distinguir maiúsculas/minúsculas | 409 | modalidades service e índice com collation |
| RN11 | Excluir modalidade apenas a inativa; listagem padrão mostra ativas | 204 sem corpo | modalidades service |
| RN12 | Excluir os quatro cadastros apenas define ativo=false | 204 sem corpo | métodos remover dos services |
| RN13 | Aluno, plano e instrutor informados à matrícula devem existir e estar ativos | 404 inexistente; 400 inativo | matriculas service |
| RN14 | Receita soma o valor mensal atual dos planos das matrículas ativas | Trancadas/canceladas não entram | relatorios/relatorios.service.ts |
| RN15 | Cadastro público sempre cria perfil consulta | Campo perfil enviado é recusado com 400 | auth controller e CadastroDto |
| RN16 | Atualização de matrícula verifica o status lido antes de gravar | 409 se status mudou durante operação | findOneAndUpdate no matriculas service |
| RN17 | Capacidade é inteiro entre 1 e 50 | 400 | modalidades DTO e schema |

RN01–RN11 preservam a numeração temática; RN12–RN17 explicitam comportamentos adicionais do código. Um cadastro inativado mantém seus campos únicos reservados. Inativação não cancela automaticamente matrículas existentes.

## 9. Fluxo de estados

| Estado atual | Destinos permitidos | Quem altera |
| --- | --- | --- |
| ativa | trancada, cancelada | admin, atendente |
| trancada | ativa, cancelada | admin, atendente |
| cancelada | nenhum | — |

A criação define ativa. Alteração de status usa rota própria; repetir o estado atual também é inválido. Reativação verifica referências ativas e matrícula ativa única. A edição de uma matrícula preserva a data histórica se ela não for alterada. O código ainda permite editar os demais dados de matrícula cancelada; cancelamento encerra as transições de status.

## 10. Perfis de acesso

| Ação | admin | atendente | consulta |
| --- | --- | --- | --- |
| Consultar os cinco recursos operacionais | Sim | Sim | Sim |
| Criar/editar recursos e mudar status | Sim | Sim | Não |
| Inativar os quatro cadastros | Sim | Não | Não |
| Relatórios e indicadores na página inicial | Sim | Não | Não |
| Criar usuário com perfil escolhido | Sim | Não | Não |

Não existe vínculo entre conta de acesso e aluno: consulta não é um portal individual e pode ler os cadastros operacionais disponíveis na API.

## 11. Dependências, restrições e aceite

Angular 21, NestJS 11, Mongoose 9 e MongoDB; ambiente local com Node compatível com os manifests. O CI usa Node 22. É necessário configurar JWT_SECRET com ao menos 32 caracteres e sem o prefixo de exemplo troque-. FRONTEND_ORIGIN admite configurar a origem da interface.

Aceite técnico: cumprir o contrato documentado, aprovar testes unitários, executar a suíte integrada com MongoDB e validar manualmente a interface nos três perfis. O resultado observado nesta revisão está em plano-de-testes.md; aprovação pedagógica, ensaio, prints e publicação de tag não são presumidos.
