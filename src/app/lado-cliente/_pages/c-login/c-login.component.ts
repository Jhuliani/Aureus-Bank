import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordModule} from 'primeng/password';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';




@Component({
  selector: 'app-c-login',
  standalone: true,
  imports: [FormsModule, PasswordModule,
    BreadcrumbModule, MenubarModule,
    InputTextModule, CommonModule, ToastModule],
  templateUrl: './c-login.component.html',
  styleUrls: ['./c-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CLoginComponent {
  senha = '';
  login: string = '';
  loading = signal(false);

  hide = signal(true);

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  fazerLogin() {
    if (!this.login || !this.senha) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Login e senha são obrigatórios'
      });
      return;
    }

    this.loading.set(true);

    this.authService.fazerLogin(this.login, this.senha)
      .subscribe({
        next: (response) => {

          // Verificar se a resposta contém os dados necessários
          if (response && response.access_token && response.id_cliente) {
            // Salvar dados de autenticação no localStorage
            this.authService.salvarDadosLogin(response);

            // Criar objeto usuário com os dados disponíveis
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
              detail: 'Login realizado com sucesso!'
            });
            this.router.navigate(['/inicio']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Login ou senha incorretos'
            });
          }
          this.loading.set(false);
        },
        error: (err: any) => {
          console.error('Erro na requisição:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao conectar com o servidor.'
          });
          this.loading.set(false);
        }
      });
  }
}
