import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Contrato {
  numero_contrato: string;
  status: string;
  id_cliente: number;
  id_veiculo: number;
  id_financeiro: number;
  data_emissao: string;
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

  constructor(private http: HttpClient) { }

  /**
   * Busca contratos do cliente logado usando o ID do localStorage
   */
  buscarContratosDoCliente(idCliente: number): Observable<ContratosResponse> {
    const token = this.obterToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<ContratosResponse>(`${this.apiUrl}/contratos/${idCliente}`, { headers });
  }

  /**
   * Obtém o token de autenticação do localStorage
   */
  private obterToken(): string | null {
    const authData = localStorage.getItem('auth_data');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.access_token || null;
    }
    return null;
  }
}
