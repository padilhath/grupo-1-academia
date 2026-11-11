# Respostas de verificação — Tiago

Módulo: Planos · Papel no README: Git e Integração · Base técnica de 11/11/2026

Este texto foi preparado a partir do código para estudo e revisão pelo integrante. Não é um relato pessoal de execução, autoria ou aprendizado. Cada integrante deve revisar e adequar suas respostas com suas palavras antes da entrega individual; atividades e correções históricas não foram inventadas.

## Aula 01 — Produto

**1. Qual problema e para quem?**

A recepção e a gestão da academia precisam centralizar cadastros e matrículas, evitar vínculos ativos duplicados e acompanhar receita mensal prevista por plano. Ver [Visão](documento-de-visao.md).

**2. O que ficou fora do escopo e por quê?**

Pagamento online: exige integração financeira e regras de cobrança que não fazem parte da implementação atual. Também não há controle efetivo de turmas ou vencimento automático.

**3. Requisito funcional e regra de negócio?**

Requisito descreve uma ação oferecida pelo sistema; regra determina as condições de aceitação. No módulo Planos: Modalidade ativa existente e nome livre → criar plano → vínculo salvo. Modalidade inexistente resulta em 404; inativa em 400; nome repetido em 409. Fonte: [service](../backend/src/planos/planos.service.ts).

## Aula 02 — Repositório e estrutura

**1. Por que branches?**

Isolam mudanças e permitem revisão e testes antes da integração em develop, conforme [CONTRIBUTING](../CONTRIBUTING.md). Não se presume que proteções de branch tenham sido configuradas no remoto.

**2. O que muda com loadChildren?**

A configuração de rotas do módulo é carregada quando necessária, reduzindo o código inicial. Ver [app.routes.ts](../frontend/src/app/app.routes.ts).

## Aula 03 — Componentes

**1. Página e componente reutilizável? **

A página [plano-lista/plano-lista.ts](../frontend/src/app/features/planos/plano-lista/plano-lista.ts) carrega dados e coordena estado. O componente [plano-card/plano-card.ts](../frontend/src/app/features/planos/plano-card/plano-card.ts) recebe dados por input. O cartão emite eventos para a página realizar operações; não acessa diretamente a persistência.

**2. Para que serve track?**

Identifica a chave estável de cada item no @for para reutilizar elementos da tela. Nos cadastros usa _id; em relatórios usa a chave do agrupamento, como plano ou objetivo.

## Aula 04 — Formulários

**1. O que acontece ao salvar um formulário inválido?**

Em [plano-form/plano-form.ts](../frontend/src/app/features/planos/plano-form/plano-form.ts), salvar verifica form.invalid, chama markAllAsTouched e retorna sem enviar. Enquanto carrega edição ou salva, também impede envio indevido.

**2. Por que validar no backend?**

Chamadas diretas podem ignorar as telas. DTOs, guards, services e schemas aplicam as validações no servidor. Ver [configurar-aplicacao.ts](../backend/src/configurar-aplicacao.ts).

## Aula 05 — Mocks

**1. Por que depender da classe abstrata?**

O contrato PlanosService permite injetar implementação mock ou API em app.config.ts, sem acoplar as telas à origem dos dados. Ver [serviços](../frontend/src/app/features/planos/services/planos.service.ts).

**2. Para que serve delay no mock?**

Simula latência e permite observar estados intermediários de carregamento. A implementação do módulo está em [planos-mock.service.ts](../frontend/src/app/features/planos/services/planos-mock.service.ts); não comprova o desempenho da API real.

## Aula 06 — Rotas e revisão do front

**1. Como distingue criação e edição?**

O formulário recebe id da rota :id/editar por input, habilitado por withComponentInputBinding. Com id busca/preenche e atualiza; sem id cria.

**2. Quais itens do checklist precisaram de correção?**

Não há evidência suficiente para atribuir correções pessoais. O código atual tem estados de erro/carregamento e componentes de apresentação; a validação visual ainda deve ser registrada nos casos M01–M10 do [Plano de Testes](plano-de-testes.md).

## Aula 07 — Dados

**1. Quem referencia quem?**

Referencia modalidades pelo campo modalidade; matriculas.plano referencia planos.

**2. Referência ou embutido?**

Modalidade é referência porque tem cadastro próprio e pode ser usada por vários planos.

**3. Qual índice e consulta?**

duracaoMeses, para GET /planos?duracaoMeses=3. Fonte: [schema](../backend/src/planos/schemas/plano.schema.ts).

## Aula 08 — Schemas

**1. Por que type:String para enum textual?**

Tipos união do TypeScript não preservam o tipo textual nos metadados de execução. type:String informa ao Mongoose como armazenar/validar o enum. O enum duracaoMeses de planos é numérico e usa type:Number. Relatórios não define schema próprio.

**2. Duas validações que recusam documento?**

valorMensal menor que 1 e duracaoMeses fora de 1,3,6,12. Regras contextuais de idade, atividade de referência e transição ficam nos services; não são todas garantidas por escrita direta no banco.

## Aula 09 — Controller e service

**1. Onde fica a regra e por quê?**

No [service](../backend/src/planos/planos.service.ts), separado do transporte HTTP. Controllers recebem parâmetros e delegam; a regra pode ser testada com modelos simulados.

**2. Qual código de exclusão e por que sem corpo?**

DELETE retorna 204 No Content: inativa o registro e não envia conteúdo na resposta. O documento continua persistido.

## Aula 10 — DTOs, testes e cobertura

**1. O que whitelist faz com campos extras?**

whitelist filtra propriedades sem validação, mas neste projeto também está ativo forbidNonWhitelisted:true. A combinação rejeita campo extra com 400; não o remove silenciosamente. Exemplo: perfil no cadastro público é recusado.

**2. Por que Model dublê?**

Isola a lógica do service, sem depender de MongoDB disponível, e permite simular ausência, duplicidade e falhas. A suíte integrada separada verifica HTTP e persistência real.

**3. Qual cobertura do service?**

100% das linhas em planos.service.ts na execução de 11/11/2026. Cobertura global: 48,29%. O [Plano de Testes](plano-de-testes.md) registra 89 testes unitários e 14 integrados aprovados; percentuais não comprovam testes de interface.

## Aula 11 — Regras

**1. Pré-condição → ação → pós-condição?**

Modalidade ativa existente e nome livre → criar plano → vínculo salvo. Modalidade inexistente resulta em 404; inativa em 400; nome repetido em 409.

**2. E se chamar direto a API?**

Guards e validações do backend continuam valendo. Uma chamada sem sessão recebe 401, perfil indevido recebe 403 e violação de regra retorna o erro documentado no [Contrato](contrato-da-api.md).

## Aula 12 — Autenticação

**1. Autenticação e autorização?**

Autenticação identifica a conta por login/JWT; autorização compara o perfil atual com os perfis da rota. JwtAuthGuard e PerfisGuard executam globalmente nessa ordem.

**2. Por que hash?**

bcrypt produz hash não reversível com salt e custo 10; a senha recebida é comparada com bcrypt.compare. Hash não revela a senha original diretamente, mas senhas fracas ainda podem ser descobertas por tentativas. senhaHash usa select:false e não é devolvido em respostas públicas.

**3. Conteúdo do token?**

sub, nome, perfil e campos temporais iat/exp. É assinado por HS256 com validade de uma hora; seu conteúdo é legível, portanto não leva senha, hash ou e-mail. O guard consulta a conta para verificar atividade e perfil atual.

## Aula 13 — Integração e perfis

**1. O que faz o interceptor e o 401?**

Adiciona Bearer somente nas URLs sob a apiUrl configurada. Um 401 dessas chamadas encerra a sessão e leva ao login, exceto 401 do próprio login, que permanece como mensagem de credenciais inválidas. Ver [interceptor](../frontend/src/app/core/auth/auth.interceptor.ts).

**2. Por que esconder botão não basta?**

Uma pessoa pode chamar a rota sem usar a tela; @Perfis e os guards impedem a operação na API. A ocultação apenas ajusta a interface às permissões.

**3. O que muda ao trocar mock pela API?**

O provider em app.config.ts escolhe o serviço HTTP quando usarMock:false. Telas dependem do mesmo contrato, e o serviço HTTP extrai resposta.dados e trata erros. Isso descreve a estrutura atual, sem afirmar quais mudanças históricas o integrante realizou.

## Aula 14 — Robustez e limitações

**1. Resposta ao usuário versus log?**

O filtro envia mensagem acionável e formato estável; em falha inesperada responde 500 genérico sem stack. O servidor registra warn para 4xx e error com stack para 5xx; services registram eventos por identificador. Não há coleção persistente de auditoria.

**2. Limitação e evolução?**

Listagens não têm paginação. Uma evolução deve definir parâmetros/limites, total de registros e índices conforme medição, mantendo o contrato entre front e API.

## Papel transversal e revisão individual

O papel de Git e Integração está atribuído no README. Não há registro documental suficiente para declarar tarefas pessoais concluídas, revisões de PR, ensaios, medições ou correções antigas. Complementar o relato individual somente com evidências verificáveis.
