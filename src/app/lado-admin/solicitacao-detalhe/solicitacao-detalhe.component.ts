import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../services/auth.service';
import { AdminService, SolicitacaoDetalhe } from '../../services/admin.service';


@Component({
  selector: 'app-solicitacao-detalhe',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ToastModule, RouterModule, TooltipModule, ProgressSpinnerModule],
  providers: [MessageService],
  templateUrl: './solicitacao-detalhe.component.html',
  styleUrl: './solicitacao-detalhe.component.scss'
})
export class SolicitacaoDetalheComponent implements OnInit {
  solicitacao: SolicitacaoDetalhe | null = null;
  carregando = false;
  processando = false;

  constructor(
    private route: ActivatedRoute,
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

    const idSolicitacao = this.route.snapshot.paramMap.get('id');
    if (idSolicitacao) {
      this.carregarSolicitacao(parseInt(idSolicitacao, 10));
    } else {
      this.router.navigate(['/paineladmin']);
    }
  }

  carregarSolicitacao(id: number) {
    this.carregando = true;

    this.adminService.buscarDetalhesSolicitacao(id).subscribe({
      next: (solicitacao) => {
        this.solicitacao = solicitacao;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar solicitação:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar detalhes da solicitação. Tente novamente.'
        });
        this.carregando = false;
        this.router.navigate(['/paineladmin']);
      }
    });
  }

  aprovarSolicitacao() {
    if (!this.solicitacao?.id_contrato) return;

    this.processando = true;

    this.adminService.aprovarSolicitacao(this.solicitacao.id_contrato).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Solicitação aprovada com sucesso!'
        });
        this.processando = false;

        // Redirecionar após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/paineladmin']);
        }, 2000);
      },
      error: (error) => {
        console.error('Erro ao aprovar solicitação:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.error?.detail || 'Erro ao aprovar solicitação. Tente novamente.'
        });
        this.processando = false;
      }
    });
  }

  recusarSolicitacao() {
    if (!this.solicitacao?.id_contrato) return;

    this.processando = true;

    this.adminService.rejeitarSolicitacao(this.solicitacao.id_contrato).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Solicitação Recusada',
          detail: 'A solicitação foi recusada com sucesso.'
        });
        this.processando = false;

        // Redirecionar após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/paineladmin']);
        }, 2000);
      },
      error: (error) => {
        console.error('Erro ao rejeitar solicitação:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.error?.detail || 'Erro ao rejeitar solicitação. Tente novamente.'
        });
        this.processando = false;
      }
    });
  }

}

