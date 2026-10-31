import { Injectable } from '@angular/core';
import { Aluno, AlunoEntrada, Objetivo } from '../aluno.model';

@Injectable({
    providedIn: 'root',
})
export class AlunosMockService {
    private proximoId = 4;

    private alunos: Aluno[] = [
        {
            _id: '1',
            nome: 'Maria Souza',
            email: 'maria.souza@email.com',
            telefone: '(51) 99876-5432',
            dataNascimento: '2004-08-10',
            objetivo: 'condicionamento',
            ativo: true,
        },
        {
            _id: '2',
            nome: 'João Lima',
            email: 'joao.lima@email.com',
            telefone: '(51) 99123-4567',
            dataNascimento: '2000-03-15',
            objetivo: 'hipertrofia',
            ativo: true,
        },
        {
            _id: '3',
            nome: 'Ana Costa',
            email: 'ana.costa@email.com',
            telefone: '(51) 99456-7890',
            dataNascimento: '1995-12-20',
            objetivo: 'emagrecimento',
            ativo: true,
        },
    ];

    async listarComEspera(): Promise<Aluno[]> {
        await new Promise<void>((resolve) => {
            setTimeout(resolve, 400);
        });

        return this.listar();
    }

    listar(objetivo?: Objetivo): Aluno[] {
        return this.alunos
            .filter(
                (aluno) =>
                    aluno.ativo &&
                    (!objetivo || aluno.objetivo === objetivo),
            )
            .map((aluno) => ({ ...aluno }));
    }

    buscarPorId(id: string): Aluno {
        const aluno = this.alunos.find((aluno) => aluno._id === id);

        if (!aluno) {
            throw new Error('Aluno não encontrado.');
        }

        return { ...aluno };
    }

    criar(entrada: AlunoEntrada): Aluno {
        const aluno: Aluno = {
            ...entrada,
            _id: String(this.proximoId++),
            ativo: true,
        };

        this.alunos.push(aluno);

        return { ...aluno };
    }

    atualizar(id: string, entrada: AlunoEntrada): Aluno {
        const indice = this.alunos.findIndex(
            (aluno) => aluno._id === id,
        );

        if (indice === -1) {
            throw new Error('Aluno não encontrado.');
        }

        const aluno: Aluno = {
            ...this.alunos[indice],
            ...entrada,
            _id: id,
        };

        this.alunos[indice] = aluno;

        return { ...aluno };
    }

    remover(id: string): void {
        const aluno = this.alunos.find((aluno) => aluno._id === id);

        if (!aluno) {
            throw new Error('Aluno não encontrado.');
        }

        aluno.ativo = false;
    }
}