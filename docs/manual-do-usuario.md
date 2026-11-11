# Manual do Usuário — Turma da Bomba

Grupo 1 · Academia · Versão 1.0 · 11/11/2026

## 1. Para que serve

O sistema organiza alunos, modalidades, planos, instrutores e matrículas da academia. A gestão também acompanha o total de alunos e a receita mensal prevista por plano. Essa receita é uma estimativa com base nas matrículas ativas; não é uma confirmação de pagamento.

## 2. Como entrar e criar conta

1. Com o sistema disponível, abra http://localhost:4200.
2. Informe seu e-mail e senha e clique em **Entrar**.
3. Se não tiver conta, clique em **Criar conta**, preencha nome, e-mail e senha e clique em **Cadastrar**. A nova conta permite apenas consultas.
4. Após a confirmação, entre com os dados cadastrados.

A senha de uma nova conta deve ter de 8 a 72 caracteres. Alguns caracteres ocupam mais espaço: se a senha for recusada por tamanho, use uma combinação mais curta respeitando o mínimo.

| Perfil | O que pode fazer |
| --- | --- |
| Consulta | Consultar os cinco cadastros operacionais |
| Atendente | Consultar, cadastrar, editar e alterar situações de matrículas |
| Administrador | Todas as ações anteriores, excluir cadastros, ver relatórios e criar usuários |

Ter uma conta não cadastra automaticamente uma pessoa como aluno. O acesso de consulta não é uma área particular do aluno: permite consultar os cadastros disponíveis ao perfil.

Para sair, clique em **Sair** no topo. Depois de uma hora, a sessão expira e será necessário entrar novamente. Ao atualizar a página, uma sessão ainda válida é recuperada.

## 3. Navegação

O menu apresenta Início, Matrículas, Alunos, Planos, Instrutores e Modalidades. Administradores também veem Relatórios e Novo usuário. O topo mostra o nome e o perfil da pessoa conectada.

Nas listagens, use o filtro para reduzir os registros exibidos. **Tabela** e **Cartões** apresentam os dados de maneiras diferentes. Caso uma ação não apareça, confira se seu perfil permite executá-la. As telas de cadastro e edição indicam campos obrigatórios com asterisco.

Para preparar novos cadastros relacionados, siga esta ordem: modalidade, plano, aluno e instrutor; depois matrícula. Aluno e instrutor podem ser cadastrados independentemente da modalidade e do plano.

## 4. Alunos

| Tarefa | Passos |
| --- | --- |
| Consultar | Clique em Alunos e escolha um Objetivo no filtro; limpe a seleção para ver todos os ativos |
| Cadastrar | Clique em Novo aluno; informe nome, e-mail, telefone, nascimento e objetivo; clique em Salvar |
| Editar | Localize o aluno, clique em Editar, ajuste os campos e salve |
| Excluir | Como administrador, clique em Excluir e confirme |

O nome deve ter de 3 a 80 caracteres. O telefone segue o exemplo **(51) 99876-5432**. O e-mail não pode repetir o de outro aluno, inclusive inativo. O aluno precisa ter pelo menos 14 anos. Os objetivos disponíveis são emagrecimento, hipertrofia, condicionamento e saude.

Excluir retira o aluno da lista de ativos, preservando o registro. Não cancela matrículas existentes.

## 5. Planos

| Tarefa | Passos |
| --- | --- |
| Consultar | Clique em Planos e filtre por Duração (meses) |
| Cadastrar | Clique em Novo plano; informe nome, selecione modalidade, valor mensal e duração; salve |
| Editar | Clique em Editar no plano desejado, ajuste os dados e salve |
| Excluir | Como administrador, clique em Excluir e confirme |

Cadastre a modalidade antes de criar o plano. Ela deve estar ativa para ser selecionada. O nome tem de 3 a 60 caracteres e não pode repetir, mesmo mudando apenas maiúsculas e minúsculas. O valor mensal mínimo é R$ 1,00, com até duas casas decimais. As durações são 1, 3, 6 ou 12 meses.

Alterar o valor mensal muda a receita prevista exibida nos relatórios das matrículas ativas ligadas ao plano. A duração cadastrada ainda não gera vencimento automático.

## 6. Matrículas

| Tarefa | Passos |
| --- | --- |
| Consultar | Clique em Matrículas e filtre por ativa, trancada ou cancelada |
| Cadastrar | Clique em Nova matrícula; selecione aluno, plano e instrutor; informe o início e salve |
| Editar | Use Editar para ajustar aluno, plano, instrutor ou início |
| Trancar | No modo Tabela, localize matrícula ativa e clique em Trancar |
| Reativar | No modo Tabela, localize matrícula trancada e clique em Reativar |
| Cancelar | Localize a matrícula e clique em Cancelar; confirme quando solicitado |

Aluno, plano e instrutor precisam estar cadastrados e ativos. Uma nova data de início não pode ser anterior ao dia atual. Cada aluno pode ter somente uma matrícula ativa. Uma matrícula trancada só pode ser reativada se as referências continuarem ativas e não houver outra matrícula ativa do mesmo aluno.

| Situação atual | Alterações possíveis |
| --- | --- |
| Ativa | Trancar ou cancelar |
| Trancada | Reativar ou cancelar |
| Cancelada | Nenhuma mudança de situação |

Para acessar todas as ações de situação, use **Tabela**. O cancelamento é definitivo para a situação da matrícula; o registro permanece consultável. Não existe botão para apagar matrícula. O sistema ainda permite editar seus dados cadastrais mesmo depois do cancelamento.

## 7. Instrutores

| Tarefa | Passos |
| --- | --- |
| Consultar | Clique em Instrutores e filtre por Turno |
| Cadastrar | Clique em Novo instrutor; informe nome, e-mail, telefone, CREF e turno; salve |
| Editar | Clique em Editar, altere os campos e salve |
| Excluir | Como administrador, clique em Excluir e confirme |

O nome tem de 3 a 80 caracteres; telefone segue o formato com DDD. O CREF deve ter de 6 a 15 caracteres. CREF e e-mail não podem repetir os de outro instrutor. Os turnos são manha, tarde e noite. A exclusão inativa o instrutor e preserva matrículas anteriores.

## 8. Modalidades

| Tarefa | Passos |
| --- | --- |
| Consultar | Clique em Modalidades e filtre por Intensidade |
| Cadastrar | Clique em Nova modalidade; preencha nome, descrição opcional, intensidade e capacidade; salve |
| Editar | Clique em Editar, ajuste os dados e salve |
| Excluir | Como administrador, clique em Excluir e confirme |

O nome tem de 3 a 50 caracteres e não pode repetir o de outra modalidade. A descrição aceita até 300 caracteres. A intensidade pode ser leve, moderada ou intensa. A capacidade é um número inteiro entre 1 e 50. Essa capacidade é informativa: o sistema ainda não organiza turmas nem reserva vagas.

## 9. Relatórios e novos usuários

Como administrador, abra **Relatórios** para ver alunos ativos, matrículas ativas e trancadas, receita mensal por plano e alunos ativos por objetivo. Os cartões de totais também aparecem no Início. O relatório de receita considera apenas matrículas ativas e o valor mensal atual de cada plano; não inclui matrículas trancadas ou canceladas.

Não se cadastra, edita ou exclui um relatório. Os números são calculados a partir dos cadastros. Sem registros, o sistema apresenta totais zerados e mensagens explicativas. Se a consulta falhar, use **Tentar novamente**. Para atualizar indicadores depois de alterações, reabra a tela.

Para cadastrar uma conta com permissão de atendimento ou administração, um administrador abre **Novo usuário**, informa nome, e-mail, senha e perfil e clica em **Cadastrar**. A pessoa criada poderá entrar com as credenciais informadas.

## 10. Dúvidas frequentes

| Dúvida / mensagem | Orientação |
| --- | --- |
| Credenciais inválidas | Confira e-mail e senha; não existe recuperação automática de senha nesta versão |
| E-mail, nome ou CREF já cadastrado | Procure o registro existente em vez de cadastrá-lo novamente; um registro inativo também mantém seus dados reservados |
| Não vejo Excluir ou Relatórios | Essas ações são exclusivas de administrador |
| Não vejo botões para cadastrar/editar | Sua conta pode ter perfil de consulta; solicite uma conta adequada ao responsável |
| A lista de planos/modalidades/instrutores está vazia no formulário | Cadastre e mantenha ativos os registros necessários antes de continuar |
| O aluno já possui matrícula ativa | Consulte a matrícula existente; tranque ou cancele apenas se corresponder ao atendimento desejado |
| A matrícula foi alterada | Reabra ou atualize a lista e confira a situação antes de tentar novamente |
| Data de início no passado | Escolha hoje ou uma data futura; a data antiga pode ser mantida ao editar uma matrícula existente |
| Excluí e o registro sumiu | A lista mostra ativos; exclusão preserva o registro, mas ainda não há tela de recuperação de inativos |
| A data parece diferente da esperada | Confira a data informada no formulário; nascimento e início são exibidos como datas de calendário |
| Erro interno ou falha de conexão | Tente novamente; persistindo, informe ao responsável a tela e a ação realizada |

## Capturas da interface

As instruções foram conferidas nos componentes e telas do código. Capturas reais e validação visual não foram produzidas nesta revisão; não foram inseridas imagens simuladas. Para a entrega com prints exigida pelo guia, seguir o inventário abaixo, usando dados fictícios.

| Captura | Tela / conteúdo esperado |
| --- | --- |
| P01 | Login e criação de conta de consulta |
| P02 | Início administrativo com menu e totais |
| P03 | Lista e formulário de Alunos, incluindo validação |
| P04 | Lista e formulário de Planos com modalidade selecionada |
| P05 | Matrículas em Tabela, com ações dos estados |
| P06 | Lista e formulário de Instrutores |
| P07 | Lista e formulário de Modalidades |
| P08 | Relatórios completos e estado sem dados |
| P09 | Novo usuário e acesso negado para perfil comum |

Este inventário é uma pendência de evidência da entrega acadêmica; não indica existência dos arquivos de imagem.
