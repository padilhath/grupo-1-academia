import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-acesso-negado',
  imports: [RouterLink],
  template: `<h1>Acesso negado</h1>
    <p role="alert">Seu perfil não tem permissão para acessar esta página.</p>
    <a routerLink="/">Voltar ao início</a>`,
})
export class AcessoNegado {}
