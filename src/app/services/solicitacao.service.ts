import { Injectable } from '@angular/core';
import { InformacoesFipe } from '../_models/fipe.models';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  enviarSolicitacao(dados: DadosSolicitacao): Observable<any> {
    const token = this.obterToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/solicitacao`, dados, { headers });
  }

  private obterToken(): string | null {
    return this.authService.obterToken();
  }
}

