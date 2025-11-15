import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface SolicitacaoLista {
  id_contrato: number;
  numero_contrato: string;
  id_cliente: number;
  nome_cliente: string;
  marca_veiculo: string;
  modelo_veiculo: string;
  valor_veiculo: number;
  valor_entrada: number;
  qtde_parcelas: number;
  status: string;
  data_emissao: string;
}

export interface SolicitacoesResponse {
  solicitacoes: SolicitacaoLista[];
  total: number;
}

export interface SolicitacaoDetalhe {
  id_contrato: number;
  numero_contrato: string;
  id_cliente: number;
  nome_cliente: string;
  cpf_cliente: string;
  email_cliente: string;
  telefone_cliente?: string | null;
  data_emissao: string;
  status: string;
  veiculo: {
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
  };
  financeiro: {
    id_financeiro: number;
    valor_total: number;
    valor_entrada: number;
    taxa_juros?: number | null;
    qtde_parcelas: number;
    data_primeiro_vencimento: string;
    status_pagamento: string;
    data_criacao: string;
    parcelas: Array<{
      id_parcela: number;
      numero_parcela: number;
      valor_parcela: number;
      data_vencimento: string;
      data_pagamento?: string | null;
      valor_pago?: number | null;
      status: string;
    }>;
  };
}

export interface ContratoLista {
  id_contrato: number;
  numero_contrato: string;
  id_cliente: number;
  nome_cliente: string;
  marca_veiculo: string;
  modelo_veiculo: string;
  valor_total: number;
  status: string;
  data_emissao: string;
}

export interface ContratosVigentesResponse {
  contratos: ContratoLista[];
  total: number;
}

export interface AprovarRejeitarRequest {
  motivo?: string;
}

export interface DashboardMetricas {
  solicitacoes_pendentes: number;
  contratos_ativos: number;
  valor_total_financiado: number;
  parcelas_em_atraso_qtd: number;
  parcelas_em_atraso_valor: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private obterToken(): string | null {
    return this.authService.obterToken();
  }

  private criarHeaders(): HttpHeaders {
    const token = this.obterToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  listarSolicitacoes(): Observable<SolicitacoesResponse> {
    return this.http.get<SolicitacoesResponse>(`${this.apiUrl}/solicitacoes`, {
      headers: this.criarHeaders()
    });
  }

  buscarDetalhesSolicitacao(idContrato: number): Observable<SolicitacaoDetalhe> {
    return this.http.get<SolicitacaoDetalhe>(`${this.apiUrl}/solicitacao/${idContrato}`, {
      headers: this.criarHeaders()
    });
  }

  aprovarSolicitacao(idContrato: number, motivo?: string): Observable<any> {
    const body: AprovarRejeitarRequest = motivo ? { motivo } : {};
    return this.http.put(`${this.apiUrl}/solicitacao/${idContrato}/aprovar`, body, {
      headers: this.criarHeaders()
    });
  }

  rejeitarSolicitacao(idContrato: number, motivo?: string): Observable<any> {
    const body: AprovarRejeitarRequest = motivo ? { motivo } : {};
    return this.http.put(`${this.apiUrl}/solicitacao/${idContrato}/rejeitar`, body, {
      headers: this.criarHeaders()
    });
  }

  listarContratosVigentes(): Observable<ContratosVigentesResponse> {
    return this.http.get<ContratosVigentesResponse>(`${this.apiUrl}/contratos`, {
      headers: this.criarHeaders()
    });
  }

  buscarDetalhesContrato(idContrato: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/contrato/${idContrato}`, {
      headers: this.criarHeaders()
    });
  }

  obterMetricasDashboard(): Observable<DashboardMetricas> {
    return this.http.get<DashboardMetricas>(`${this.apiUrl}/dashboard/metrics`, {
      headers: this.criarHeaders()
    });
  }
}

