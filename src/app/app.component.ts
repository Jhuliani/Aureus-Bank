import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    MenubarModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Aureus-Bank';
  showLayout = true;
  userMenuItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.urlAfterRedirects || e.url;
        this.showLayout = !(
          url.startsWith('/login') ||
          url.startsWith('/cadastro')
        );
      });

    this.initializeUserMenu();
  }

  private initializeUserMenu() {
    this.userMenuItems = [
      {
        label: this.getUsuarioNome(),
        icon: 'pi pi-user',
        items: [
          {
            label: 'Sair',
            icon: 'pi pi-sign-out',
            command: () => {
              this.logout();
            }
          }
        ]
      }
    ];
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUsuarioNome(): string {
    const authData = this.authService.obterDadosLogin();
    if (authData && authData.nome_cliente) {
      return authData.nome_cliente;
    }

    const usuario = this.authService.obterUsuarioLocal();
    if (usuario && usuario.nome) {
      return usuario.nome;
    }

    return 'Usuário';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
