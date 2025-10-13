import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ContratosService, Contrato } from '../../../services/contratos.service';

@Component({
  selector: 'app-meuscontratos',
  standalone: true,
  imports: [TableModule,
    CommonModule,
    TabMenuModule,
  ],
  templateUrl: './c-meuscontratos.component.html',
  styleUrl: './c-meuscontratos.component.scss',
})
export class CMeuscontratosComponent implements OnInit{
  contratos: Contrato[] = [];
  loading = false;
  usuario: any = null;

  menuSuperior: MenuItem[] | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private contratosService: ContratosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Verificar se usuário está logado
    this.usuario = this.authService.obterUsuarioLocal();
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregarContratos();
  }

  carregarContratos() {
    this.loading = true;

    this.contratosService.buscarTodosContratos()
      .subscribe({
        next: (contratos: Contrato[]) => {
          this.contratos = contratos;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Erro ao carregar contratos:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }


}
