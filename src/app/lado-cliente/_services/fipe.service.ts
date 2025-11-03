import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Marcas, Modelos, Anos, InformacoesFipe, ModelosResponse } from '../../_models/fipe.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FipeService {
  private readonly fipeURL: string = environment.fipeApiUrl;

  constructor(private http: HttpClient) { }

  listarMarcas(tipoVeiculo: string):  Observable<Marcas[]> {
    const url = `${this.fipeURL}/${tipoVeiculo}/marcas`;
    console.log('Buscando marcas: ', url);
    return this.http.get<Marcas[]>(url).pipe(
      catchError(error => {
        console.error('Erro no serviço ao buscar marcas:', error);
        return throwError(() => error);
      })
    );
  }

  listarModelos(tipoVeiculo: string, marcaCode: string): Observable<ModelosResponse> {
    const url = `${this.fipeURL}/${tipoVeiculo}/marcas/${marcaCode}/modelos`;
    console.log('Buscando modelos:', url);
    return this.http.get<ModelosResponse>(url).pipe(
      catchError(error => {
        console.error('Erro no serviço ao buscar modelos:', error);
        return throwError(() => error);
      })
    );
  }

  listarAnos(tipoVeiculo: string, marcaCode: string, modeloCode: string): Observable<Anos[]> {
    const url = `${this.fipeURL}/${tipoVeiculo}/marcas/${marcaCode}/modelos/${modeloCode}/anos`;
    console.log('Buscando anos:', url);
    return this.http.get<Anos[]>(url).pipe(
      catchError(error => {
        console.error('Erro no serviço ao buscar anos:', error);
        return throwError(() => error);
      })
    );
  }

  listarInformacoes(tipoVeiculo: string, marcaCode: string, modeloCode: string, anoCode: string): Observable<InformacoesFipe> {
    const url = `${this.fipeURL}/${tipoVeiculo}/marcas/${marcaCode}/modelos/${modeloCode}/anos/${anoCode}`;
    console.log('Buscando informações FIPE:', url);
    return this.http.get<InformacoesFipe>(url).pipe(
      catchError(error => {
        console.error('Erro no serviço ao buscar informações FIPE:', error);
        return throwError(() => error);
      })
    );
  }

}
