import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Contrato, ContratosResponse, ContratosService } from '../../services/contratos.service';

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
  totalContratos = 0;
  carregando = false;

  menuSuperior: MenuItem[] | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private contratosService: ContratosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregarContratos();
  }

  carregarContratos() {
    this.carregando = true;

    const authData = this.authService.obterDadosLogin();
    if (!authData || !authData.id_cliente) {
      console.error('ID do cliente não encontrado no localStorage');
      this.carregando = false;
      return;
    }

    this.contratosService.buscarContratosDoCliente(authData.id_cliente)
      .subscribe({
        next: (response: ContratosResponse) => {
          this.contratos = response.contratos;
          this.totalContratos = response.total;
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Erro ao carregar contratos:', err);
          this.carregando = false;
          this.cdr.detectChanges();
        }
      });
  }

  visualizarContrato(idContrato: number): void {
    this.router.navigate(['/meuscontratos', idContrato]);
  }

}
