import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService, SolicitacaoLista } from '../../services/admin.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-c-paineladmin',
  standalone: true,
  imports: [CommonModule, TableModule, ToastModule],
  providers: [MessageService],
  templateUrl: './c-paineladmin.component.html',
  styleUrl: './c-paineladmin.component.scss'
})
export class CPaineladminComponent implements OnInit {
  solicitacoes: SolicitacaoLista[] = [];
  totalSolicitacoes = 0;
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

    this.carregarSolicitacoes();
  }

  carregarSolicitacoes() {
    this.carregando = true;

    this.adminService.listarSolicitacoes().subscribe({
      next: (response) => {
        this.solicitacoes = response.solicitacoes;
        this.totalSolicitacoes = response.total;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar solicitações:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar solicitações. Tente novamente.'
        });
        this.carregando = false;
      }
    });
  }

  visualizarSolicitacao(idContrato: number): void {
    this.router.navigate(['/paineladmin/solicitacao', idContrato]);
  }
}
