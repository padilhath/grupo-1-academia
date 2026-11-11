# Documentação — Turma da Bomba

Grupo 1 · Academia · SENAI — Programador Full-Stack · Consolidação em 11/11/2026.

Documentos elaborados com base nos Markdown da raiz e de `guia/`, nas seções dos templates e na implementação Angular/NestJS/MongoDB. O contrato descreve o código ativo; exemplos de outros temas não foram incorporados como requisitos de Academia.

## Documentos do grupo

| Documento | Fonte editável | Word para entrega |
| --- | --- | --- |
| Visão: problema, persona, escopo, requisitos e regras | [Markdown](documento-de-visao.md) | [DOCX](documento-de-visao.docx) |
| Contrato: 32 rotas, perfis, entradas, saídas e erros | [Markdown](contrato-da-api.md) | [DOCX](contrato-da-api.docx) |
| Dicionário: seis coleções, campos, índices e relações | [Markdown](dicionario-de-dados.md) | [DOCX](dicionario-de-dados.docx) |
| Testes: cenários, rastreabilidade, execução e cobertura | [Markdown](plano-de-testes.md) | [DOCX](plano-de-testes.docx) |
| Manual: acesso e tarefas de cada módulo | [Markdown](manual-do-usuario.md) | [DOCX](manual-do-usuario.docx) |
| Apresentação: roteiro de 17 minutos e preparação | [Markdown](roteiro-da-apresentacao.md) | [DOCX](roteiro-da-apresentacao.docx) |

Complemento técnico: [Operação e Arquitetura](operacao-e-arquitetura.md), com instalação, configuração, seed, decisões técnicas, diferenças em relação aos exemplos e limitações. [Fontes e rastreabilidade](fontes-e-rastreabilidade.md) lista os materiais e arquivos de referência.

## Respostas de verificação

Bases técnicas por módulo, organizadas pelas aulas 01–14, para revisão individual. Não atribuem experiências ou autoria aos integrantes e não substituem a redação pessoal solicitada pelo guia.

| Integrante | Módulo | Arquivo |
| --- | --- | --- |
| Vinicius | Alunos | [Respostas](respostas-vinicius.md) |
| Tiago | Planos | [Respostas](respostas-tiago.md) |
| Wolfegan | Matrículas | [Respostas](respostas-wolfegan.md) |
| Andrieli | Instrutores | [Respostas](respostas-andrieli.md) |
| Bruno | Modalidades | [Respostas](respostas-bruno.md) |
| Alexa | Relatórios | [Respostas](respostas-alexa.md) |

## Evidências e revisão final

Na revisão passaram **89 testes unitários e 14 testes integrados com MongoDB**. Cobertura global de linhas do Jest: **48,29%**. Detalhes, comandos e percentuais por service estão no Plano de Testes.

Permanecem como atividades da entrega: testes manuais no navegador, capturas reais exigidas pelo manual, revisão individual das respostas, aprovação da equipe e ensaio. Não foram declarados concluídos. O README da raiz ainda tem seções de preenchimento; não foi alterado por esta tarefa restrita à pasta docs. A versão documental 1.0 não significa que uma tag de entrega foi publicada.

## Atualização dos arquivos Word

Editar primeiro os `.md`; depois executar, a partir da raiz:

```powershell
python docs/gerar-docx.py
```

O exportador usa somente a biblioteca padrão do Python e gera os seis arquivos com títulos, tabelas e exemplos. Valida a integridade do ZIP e do XML de cada DOCX. A organização de conteúdo segue os [templates](../guia/templates/) do professor; o layout foi gerado para esta documentação. A renderização final no Word/LibreOffice ainda precisa ser conferida junto com a inclusão de prints reais.

Materiais originais preservados: [Guia](../guia/README.md), [Academia](../guia/temas/academia.md), [Exemplos](../guia/exemplos/README.md) e [Contribuição](../CONTRIBUTING.md).
