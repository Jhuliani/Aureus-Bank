import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Contrato, Veiculo } from '../../_models/db.models';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { ContratosService } from '../../services/contratos.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface Cliente {
  id_cliente: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string | null;
  renda?: number | null;
}

interface Parcelas {
  pagar: number;
  emAtraso: number;
  aVencer: number;
  situacaoTotal: number;
  totalAtraso: number;
  qtdPagas: number;
  qtdEmAtraso: number;
  qtdAVencer: number;
  valorParcela: number;
  valorTotalFinanciado: number;
}

@Component({
  selector: 'app-detalhe-contrato',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TooltipModule, ProgressSpinnerModule, ToastModule],
  providers: [MessageService],
  templateUrl: './detalhe-contrato.component.html',
  styleUrl: './detalhe-contrato.component.scss'
})
export class DetalheContratoComponent implements OnInit {

  dadosParcelas: Parcelas | null = null;
  dadosContrato: Contrato | null = null;
  dadosVeiculo: Veiculo | null = null;
  dadosCliente: Cliente | null = null;

  carregando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService,
    private contratosService: ContratosService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const idContrato = this.route.snapshot.paramMap.get('id');
    if (idContrato) {
      this.carregarDados(parseInt(idContrato, 10));
    } else {
      this.router.navigate(['/admin/contratos']);
    }
  }

  carregarDados(idContrato: number) {
    this.carregando = true;

    this.adminService.buscarDetalhesContrato(idContrato).subscribe({
      next: (contrato) => {

        this.dadosContrato = {
          idContrato: contrato.id_contrato.toString(),
          dataEmissao: new Date(contrato.data_emissao).toLocaleDateString('pt-BR'),
          vigenciaInicio: contrato.data_emissao ? new Date(contrato.data_emissao).toLocaleDateString('pt-BR') : '',
          vigenciaFim: contrato.vigencia_fim ? new Date(contrato.vigencia_fim).toLocaleDateString('pt-BR') : '',
          statusContrato: contrato.status.toUpperCase(),
          produto: 'VEÍCULO LEVE',
          tipoProduto: 'CARRO',
          cedente: 'AUREUSBank S/A'
        };

        this.dadosVeiculo = {
          marca: contrato.veiculo.marca,
          modelo: contrato.veiculo.modelo,
          ano: `${contrato.veiculo.ano_fabricacao}/${contrato.veiculo.ano_modelo}`,
          placa: contrato.veiculo.placa || '',
          renavam: contrato.veiculo.num_renavam,
          chassi: contrato.veiculo.num_chassi
        };

        if (contrato.cliente) {
          this.dadosCliente = {
            id_cliente: contrato.cliente.id_cliente,
            nome: contrato.cliente.nome || 'N/A',
            cpf: contrato.cliente.cpf || 'N/A',
            email: contrato.cliente.email || 'N/A',
            telefone: contrato.cliente.telefone || null,
            renda: contrato.cliente.renda || null
          };
        } else {
          console.warn('Cliente não encontrado no contrato. Objeto completo:', contrato);
          this.dadosCliente = null;
        }

        const parcelas = contrato.financeiro.parcelas || [];
        this.dadosParcelas = this.contratosService.calcularDadosParcelas(
          parcelas,
          contrato.financeiro.valor_total,
          contrato.financeiro.valor_entrada
        ) as Parcelas;

        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar contrato:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar detalhes do contrato. Tente novamente.'
        });
        this.carregando = false;
        this.router.navigate(['/admin/contratos']);
      }
    });
  }

  voltar() {
    this.router.navigate(['/admin/contratos']);
  }
}

