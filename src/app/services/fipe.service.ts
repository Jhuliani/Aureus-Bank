import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Marcas, ModelosResponse, Anos, InformacoesFipe } from '../_models/fipe.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FipeService {

  private readonly fipeURL: string = environment.fipeApiUrl;
  private readonly fipeToken: string = environment.fipeToken;

  constructor(private http: HttpClient) {}

  private criarHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Se houver token, adiciona ao header
    if (this.fipeToken && this.fipeToken.trim() !== '') {
      return headers.set('Authorization', `Bearer ${this.fipeToken}`);
    }

    return headers;
  }

  private construirUrl(endpoint: string): string {
    return `${this.fipeURL}/${endpoint}`;
  }


  private tratarErro<T>(contexto: string): (source: Observable<T>) => Observable<T> {
    return catchError((error) => {
      console.error(`Erro ao ${contexto}:`, error);

      // Log mais detalhado do erro
      if (error.status === 401) {
        console.error('Erro 401: Problema de autenticação. Verifique o token ou se a API requer autenticação.');
      } else if (error.status === 404) {
        console.error('Erro 404: Endpoint não encontrado.');
      } else if (error.status === 0) {
        console.error('Erro de conexão: Verifique CORS ou conectividade.');
      }

      return throwError(() => error);
    });
  }


  listarMarcas(tipoVeiculo: string): Observable<Marcas[]> {
    const url = this.construirUrl(`${tipoVeiculo}/marcas`);

    return this.http.get<Marcas[]>(url, { headers: this.criarHeaders() }).pipe(
      this.tratarErro<Marcas[]>("buscar marcas")
    );
  }


  listarModelos(tipoVeiculo: string, marcaCode: string): Observable<ModelosResponse> {
    const url = this.construirUrl(`${tipoVeiculo}/marcas/${marcaCode}/modelos`);

    return this.http.get<ModelosResponse>(url, { headers: this.criarHeaders() }).pipe(
      this.tratarErro<ModelosResponse>("buscar modelos")
    );
  }


  listarAnos(tipoVeiculo: string, marcaCode: string, modeloCode: string): Observable<Anos[]> {
    if (!tipoVeiculo || !marcaCode || !modeloCode) {
      console.error("❌ Parâmetros inválidos:", { tipoVeiculo, marcaCode, modeloCode });
      return throwError(() => new Error("Parâmetros inválidos para buscar anos"));
    }

    const url = this.construirUrl(
      `${tipoVeiculo}/marcas/${marcaCode}/modelos/${modeloCode}/anos`
    );

    return this.http.get<Anos[]>(url, { headers: this.criarHeaders() }).pipe(
      this.tratarErro<Anos[]>("buscar anos")
    );
  }


  listarInformacoes(
    tipoVeiculo: string,
    marcaCode: string,
    modeloCode: string,
    anoCode: string
  ): Observable<InformacoesFipe> {

    const url = this.construirUrl(
      `${tipoVeiculo}/marcas/${marcaCode}/modelos/${modeloCode}/anos/${anoCode}`
    );

    return this.http.get<InformacoesFipe>(url).pipe(
      this.tratarErro<InformacoesFipe>("buscar informações FIPE")
    );
  }

}
