import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, Perfil } from '../../core/auth/auth.service';
@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './auth-form.html',
})
export class AuthForm implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly cadastro = signal(this.route.snapshot.data['cadastro'] === true);
  readonly administrativo = signal(this.route.snapshot.data['administrativo'] === true);
  private readonly fb = inject(FormBuilder);
  protected readonly enviando = signal(false);
  protected readonly mensagem = signal('');
  protected readonly erro = signal('');
  protected readonly form = this.fb.nonNullable.group({
    nome: [''],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.maxLength(72)]],
    perfil: ['consulta' as Perfil],
  });
  ngOnInit(): void {
    if (this.cadastro()) {
      this.form.controls.nome.setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(80),
      ]);
      this.form.controls.senha.addValidators(Validators.minLength(8));
    }
    this.form.controls.nome.updateValueAndValidity();
    this.form.controls.senha.updateValueAndValidity();
    if (this.route.snapshot.queryParamMap.get('contaCriada') === 'true')
      this.mensagem.set('Conta criada. Entre com seu e-mail e senha.');
  }
  protected invalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.invalid && c.touched;
  }
  protected enviar(): void {
    if (this.enviando()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.enviando.set(true);
    this.erro.set('');
    const { nome, email, senha, perfil } = this.form.getRawValue();
    const operacao = this.cadastro()
      ? this.auth.cadastrar({ nome, email, senha }, this.administrativo() ? perfil : undefined)
      : this.auth.login(email, senha);
    operacao.subscribe({
      next: () => {
        this.enviando.set(false);
        if (this.cadastro()) {
          if (this.administrativo()) {
            this.mensagem.set('Usuário criado com sucesso.');
            this.form.reset();
          } else void this.router.navigate(['/login'], { queryParams: { contaCriada: 'true' } });
        } else {
          const retorno = this.route.snapshot.queryParamMap.get('retorno');
          void this.router.navigateByUrl(
            retorno?.startsWith('/') && !retorno.startsWith('//') && !retorno.startsWith('/login')
              ? retorno
              : '/',
          );
        }
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.enviando.set(false);
      },
    });
  }
}
