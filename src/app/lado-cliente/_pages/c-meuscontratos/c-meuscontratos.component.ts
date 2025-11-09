import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ContratosService, Contrato, ContratosResponse } from '../../../services/contratos.service';

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
  contratos: Contrato[] = []; // é da tabela
  totalContratos = 0;
  loading = false;

  menuSuperior: MenuItem[] | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private contratosService: ContratosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Verificar se usuário está logado usando auth_data (token)
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregarContratos();
  }

  carregarContratos() {
    this.loading = true;

    // Obter ID do cliente do localStorage
    const authData = this.authService.obterDadosLogin();
    if (!authData || !authData.id_cliente) {
      console.error('ID do cliente não encontrado no localStorage');
      this.loading = false;
      return;
    }

    console.log('Buscando contratos para cliente ID:', authData.id_cliente);

    this.contratosService.buscarContratosDoCliente(authData.id_cliente)
      .subscribe({
        next: (response: ContratosResponse) => {
          console.log('Contratos recebidos:', response);
          this.contratos = response.contratos;
          this.totalContratos = response.total;
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
