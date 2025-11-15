import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService, ContratoLista } from '../../services/admin.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-c-contratos',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './c-contratos.component.html',
  styleUrl: './c-contratos.component.scss'
})
export class CContratosComponent implements OnInit {
  contratos: ContratoLista[] = [];
  totalContratos = 0;
  carregando = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService,
    private messageService: MessageService
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
    
    this.adminService.listarContratosVigentes().subscribe({
      next: (response) => {
        this.contratos = response.contratos;
        this.totalContratos = response.total;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar contratos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar contratos. Tente novamente.'
        });
        this.carregando = false;
      }
    });
  }

  visualizarContrato(idContrato: number): void {
    this.router.navigate(['/admin/contratos', idContrato]);
  }
}
