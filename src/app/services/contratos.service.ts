import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Contrato {
  id_contrato: number;
  numero_contrato: string;
  status: string;
  id_cliente: number;
  id_veiculo: number;
  id_financeiro: number;
  data_emissao: string;
}

export interface Parcela {
  id_parcela: number;
  numero_parcela: number;
  valor_parcela: number;
  data_vencimento: string;
  data_pagamento?: string | null;
  valor_pago?: number | null;
  status: string;
}

export interface FinanceiroCompleto {
  id_financeiro: number;
  valor_total: number;
  valor_entrada: number;
  taxa_juros?: number | null;
  qtde_parcelas: number;
  data_primeiro_vencimento: string;
  status_pagamento: string;
  data_criacao: string;
  parcelas: Parcela[];
}

export interface VeiculoCompleto {
  id_veiculo: number;
  marca: string;
  modelo: string;
  ano_fabricacao: number;
  ano_modelo: number;
  cor?: string | null;
  placa?: string | null;
  num_chassi: string;
  num_renavam: string;
  valor: number;
}

export interface ContratoCompleto {
  id_contrato: number;
  numero_contrato: string;
  status: string;
  id_cliente: number;
  data_emissao: string;
  vigencia_fim?: string | null;
  veiculo: VeiculoCompleto;
  financeiro: FinanceiroCompleto;
}

export interface ContratosResponse {
  contratos: Contrato[];
  total: number;
}

export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}

export interface Veiculo {
  id: string;
  valor: number;
  placa: string;
  ano_modelo: number;
  marca_modelo: string;
  cor_predominante: string;
  num_chassi: string;
  num_renavam: string;
}

export interface Financeiro {
  id: string;
  qtde_parcelas: number;
  prazo: number;
  status_parcelas: string;
  valor_entrada: number;
  valor_parcelas: number;
  valor_financiar: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  private apiUrl = `${environment.apiUrl}/cliente`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }


  buscarContratosDoCliente(idCliente: number): Observable<ContratosResponse> {
    const token = this.obterToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<ContratosResponse>(`${this.apiUrl}/contratos/${idCliente}`, { headers });
  }


  buscarDetalhesContrato(idContrato: number): Observable<ContratoCompleto> {
    const token = this.obterToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<ContratoCompleto>(`${this.apiUrl}/contrato/${idContrato}`, { headers });
  }

  private obterToken(): string | null {
    return this.authService.obterToken();
  }

  calcularDadosParcelas(parcelas: Parcela[], valorTotal: number, valorEntrada: number): {
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
  } {
    if (!parcelas || parcelas.length === 0) {
      const valorTotalFinanciado = valorTotal - valorEntrada;
      return {
        pagar: 0,
        emAtraso: 0,
        aVencer: 0,
        situacaoTotal: valorTotalFinanciado,
        totalAtraso: 0,
        qtdPagas: 0,
        qtdEmAtraso: 0,
        qtdAVencer: 0,
        valorParcela: 0,
        valorTotalFinanciado: valorTotalFinanciado
      };
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const parcelasPagas = parcelas.filter((p) => p.status === 'paga' || p.status === 'pago');
    const qtdPagas = parcelasPagas.length;
    const valorPagas = parcelasPagas.reduce((sum, p) => sum + (p.valor_pago || p.valor_parcela), 0);

    const parcelasAtraso = parcelas.filter((p) => {
      const dataVenc = new Date(p.data_vencimento);
      dataVenc.setHours(0, 0, 0, 0);
      return p.status === 'atrasada' || (p.status === 'pendente' && dataVenc < hoje);
    });
    const qtdEmAtraso = parcelasAtraso.length;
    const valorEmAtraso = parcelasAtraso.reduce((sum, p) => sum + p.valor_parcela, 0);

    const parcelasAVencer = parcelas.filter((p) => {
      const dataVenc = new Date(p.data_vencimento);
      dataVenc.setHours(0, 0, 0, 0);
      return p.status === 'pendente' && dataVenc >= hoje;
    });
    const qtdAVencer = parcelasAVencer.length;
    const valorAVencer = parcelasAVencer.reduce((sum, p) => sum + p.valor_parcela, 0);

    const primeiraParcela = parcelas.find((p) => p.status === 'pendente') || parcelas[0];
    const valorParcela = primeiraParcela ? primeiraParcela.valor_parcela : 0;

    const valorTotalFinanciado = valorTotal - valorEntrada;

    return {
      pagar: valorPagas,
      emAtraso: valorEmAtraso,
      aVencer: valorAVencer,
      situacaoTotal: valorTotalFinanciado,
      totalAtraso: valorEmAtraso,
      qtdPagas: qtdPagas,
      qtdEmAtraso: qtdEmAtraso,
      qtdAVencer: qtdAVencer,
      valorParcela: valorParcela,
      valorTotalFinanciado: valorTotalFinanciado
    };
  }
}
