import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Contrato {
  id: string;
  num_contrato: string;
  data_emissao: string;
  vigencia_ctt: string;
  status: string;
  data: string;
  id_cliente: number;
  id_veiculo: number;
  id_financeiro: number;
  clientes?: any;
  veiculos?: any;
  financeiros?: any;
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
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) { }

  buscarTodosContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.apiUrl}/contratos`);
  }

  buscarContratosPorCliente(idCliente: number): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.apiUrl}/contratos?id_cliente=${idCliente}`);
  }

}
