import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordModule} from 'primeng/password';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';




@Component({
  selector: 'app-c-login',
  standalone: true,
  imports: [FormsModule, PasswordModule,
    BreadcrumbModule, MenubarModule,
    InputTextModule, CommonModule],
  templateUrl: './c-login.component.html',
  styleUrls: ['./c-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CLoginComponent {
  senha = '';
  email: string = '';
  loading = signal(false);
  error = signal('');

  hide = signal(true);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  fazerLogin() {
    if (!this.email || !this.senha) {
      this.error.set('Email e senha são obrigatórios');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.fazerLogin(this.email, this.senha)
      .subscribe({
        next: (usuarios: any[]) => {
          if (usuarios && usuarios.length > 0) {
            const usuario = usuarios[0];
            this.authService.salvarUsuarioLocal(usuario);
            this.router.navigate(['/inicio']);
          } else {
            this.error.set('Email ou senha incorretos');
          }
          this.loading.set(false);
        },
        error: (err: any) => {
          console.error('Erro na requisição:', err);
          this.error.set('Erro ao conectar com o servidor. Verifique se o JSON Server está rodando.');
          this.loading.set(false);
        }
      });
  }
}
