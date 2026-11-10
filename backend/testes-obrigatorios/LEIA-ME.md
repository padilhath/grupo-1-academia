# Testes obrigatórios (Autenticação e Robustez)

Estes testes definem o comportamento que o sistema PRECISA ter.
Eles ficam fora de `src/` para não rodar antes da hora.

| Arquivo | Copie para | Aula |
| --- | --- | --- |
| `usuarios.service.spec.ts` | `src/usuarios/usuarios.service.spec.ts` | 12 |
| `auth.service.spec.ts` | `src/auth/auth.service.spec.ts` | 12 |
| `perfis.guard.spec.ts` | `src/auth/guards/perfis.guard.spec.ts` | 13 |
| `excecoes.filter.spec.ts` | `src/common/filters/excecoes.filter.spec.ts` | 14 |

Depois de copiar, rode `npm test`. A tarefa só está pronta quando **todos** passam.
Não altere os testes para fazê-los passar: altere o seu código.
