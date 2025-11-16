import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordModule} from 'primeng/password';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';




@Component({
  selector: 'app-c-login',
  standalone: true,
  imports: [FormsModule, PasswordModule,
    BreadcrumbModule, MenubarModule,
    InputTextModule, CommonModule, ToastModule],
  templateUrl: './c-login.component.html',
  styleUrls: ['./c-login.component.scss']
})
export class CLoginComponent {
  senha = '';
  login: string = '';
  carregando = false;

  ocultarSenha = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  alternarVisibilidadeSenha(event: MouseEvent) {
    this.ocultarSenha = !this.ocultarSenha;
    event.stopPropagation();
  }

  fazerLogin() {
    if (!this.login || !this.senha) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Login e senha são obrigatórios',
        life: 5000
      });
      return;
    }

    this.carregando = true;

    this.authService.fazerLogin(this.login, this.senha)
      .subscribe({
        next: (response) => {
          if (response && response.access_token && response.id_cliente) {
            this.authService.salvarDadosLogin(response);

            const usuario = {
              id_cliente: response.id_cliente,
              id_perfil: response.id_perfil,
              id_usuario: response.id_usuario,
              nome: response.nome_cliente,
              login: this.login
            };
            this.authService.salvarUsuarioLocal(usuario);

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Login realizado com sucesso!',
              life: 5000
            });

            if (this.authService.isAdmin()) {
              this.router.navigate(['/inicio-admin']);
            } else {
              this.router.navigate(['/inicio']);
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Login ou senha incorretos',
              life: 5000
            });
          }
          this.carregando = false;
        },
        error: (err: any) => {
          // Log detalhado para debug
          console.error('❌ Erro no login:', {
            error: err,
            errorError: err.error,
            errorMessage: err.message,
            errorDetail: err.error?.detail,
            status: err.status
          });

          // Tenta extrair a mensagem de erro específica
          let mensagemErro = 'Erro ao conectar com o servidor.';

          // 1. Verifica se o erro vem do backend FastAPI (err.error.detail)
          if (err.error?.detail) {
            mensagemErro = err.error.detail;
          }
          // 2. Verifica se vem como err.error.message
          else if (err.error?.message) {
            mensagemErro = err.error.message;
          }
          // 3. Verifica se é uma string direta
          else if (typeof err.error === 'string') {
            mensagemErro = err.error;
          }
          // 4. Mensagens específicas baseadas no status code
          else if (err.status === 400) {
            mensagemErro = 'Usuário não encontrado ou credenciais inválidas. Verifique seu login e senha.';
          } else if (err.status === 401) {
            mensagemErro = 'Credenciais inválidas. Verifique seu login e senha.';
          } else if (err.status === 403) {
            mensagemErro = 'Acesso negado. Entre em contato com o suporte.';
          } else if (err.status === 404) {
            mensagemErro = 'Serviço não encontrado. Tente novamente mais tarde.';
          } else if (err.status === 500) {
            mensagemErro = 'Erro interno do servidor. Tente novamente mais tarde.';
          } else if (err.status === 0) {
            mensagemErro = 'Erro de conexão. Verifique sua internet e tente novamente.';
          }

          // Remove prefixos desnecessários
          mensagemErro = mensagemErro
            .replace(/^Erro na requisição:\s*/i, '')
            .replace(/^Error:\s*/i, '')
            .trim();

          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: mensagemErro,
            life: 5000
          });
          this.carregando = false;
        }
      });
  }
}
