import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContratosService, ContratoCompleto, Parcela } from '../../services/contratos.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { extrairMensagemErro } from '../../utils/error-handler.util';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-c-visualizar-contratos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TableModule,
    ProgressSpinnerModule,
    ToastModule,
    TooltipModule
  ],
  templateUrl: './c-visualizar-contratos.component.html',
  styleUrl: './c-visualizar-contratos.component.scss'
})
export class CVisualizarContratosComponent implements OnInit {
  contrato: ContratoCompleto | null = null;
  carregando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contratosService: ContratosService,
    private authService: AuthService,
    private serviceMensagem: MessageService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const idContrato = this.route.snapshot.paramMap.get('id');
    if (idContrato) {
      this.carregarDetalhesContrato(parseInt(idContrato, 10));
    } else {
      this.mostrarErro('ID do contrato não fornecido');
      this.router.navigate(['/meuscontratos']);
    }
  }

  carregarDetalhesContrato(idContrato: number): void {
    this.carregando = true;

    this.contratosService.buscarDetalhesContrato(idContrato)
      .subscribe({
        next: (contrato: ContratoCompleto) => {
          this.contrato = contrato;
          this.carregando = false;
        },
        error: (err: any) => {
          const mensagemErro = extrairMensagemErro(err, 'Erro ao carregar detalhes do contrato. Tente novamente.');
          this.mostrarErro(mensagemErro);
          this.carregando = false;
          this.router.navigate(['/meuscontratos']);
        }
      });
  }

  get parcelasPagas(): number {
    if (!this.contrato?.financeiro?.parcelas) return 0;
    return this.contrato.financeiro.parcelas.filter((p: Parcela) => p.status === 'paga' || p.status === 'pago').length;
  }

  get parcelasPendentes(): number {
    if (!this.contrato?.financeiro?.parcelas) return 0;
    return this.contrato.financeiro.parcelas.filter((p: Parcela) => p.status === 'pendente').length;
  }

  get totalPago(): number {
    if (!this.contrato?.financeiro?.parcelas) return 0;
    return this.contrato.financeiro.parcelas
      .filter((p: Parcela) => p.valor_pago)
      .reduce((sum: number, p: Parcela) => sum + (p.valor_pago || 0), 0);
  }

  get totalRestante(): number {
    if (!this.contrato?.financeiro) return 0;
    return this.contrato.financeiro.valor_total - this.totalPago;
  }

  private mostrarErro(mensagem: string): void {
    this.serviceMensagem.add({
      severity: 'error',
      summary: 'Erro',
      detail: mensagem,
      life: 10000
    });
  }
}
