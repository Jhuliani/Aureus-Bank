import { Injectable } from '@angular/core';
import { InformacoesFipe } from '../_models/fipe.models';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DadosSolicitacao {
  informacoesFipe?: InformacoesFipe;
  tipoVeiculo?: string;
  marcaSelecionada?: string;
  modeloSelecionado?: string;
  anoSelecionado?: string;
  valorEntrada?: number;
  parcelasSelecionadas?: number;
  taxaJuros?: number;
  rendaMensal?: number;
  resultadoSimulacao?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  private apiUrl = `${environment.apiUrl}/cliente`;

  constructor(private http: HttpClient) { }

  enviarSolicitacao(dados: DadosSolicitacao): Observable<any> {
    const token = this.obterToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/solicitacao`, dados, { headers });
  }


  private obterToken(): string | null {
    const authData = localStorage.getItem('auth_data');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.access_token || null;
    }
    return null;
  }
}

