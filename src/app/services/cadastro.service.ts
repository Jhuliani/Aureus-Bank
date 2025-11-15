import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DadosCadastro {
  nome: string;
  cpf: string;
  telefone: string;
  renda: number;

  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;

  usuario: string;
  email: string;
  senha: string;
}


@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private baseUrl = `${environment.apiUrl}/cliente`;

  constructor(private http: HttpClient) {}

  private truncarSenhaPorBytes(senha: string, maxBytes: number = 72): string {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(senha);

    if (bytes.length <= maxBytes) {
      return senha;
    }

    const truncatedBytes = bytes.slice(0, maxBytes);
    const decoder = new TextDecoder();
    return decoder.decode(truncatedBytes);
  }


  cadastrarCliente(dados: DadosCadastro): Observable<any> {
    const dadosCompletos = {
      nome: dados.nome,
      cpf: dados.cpf.replace(/\D/g, ''),
      email: dados.email,
      telefone: dados.telefone,
      renda: dados.renda,

      // Endereço
      logradouro: dados.logradouro,
      numero: dados.numero,
      bairro: dados.bairro,
      cidade: dados.cidade,
      estado: dados.estado.toUpperCase(),
      cep: dados.cep,

      login: dados.usuario,
      senha: this.truncarSenhaPorBytes(dados.senha)
    };


    return this.http.post(`${this.baseUrl}/cadastro-completo`, dadosCompletos).pipe(
      catchError((error) => {
        if (error.error?.detail) {
          const mensagem = error.error.detail;

          if (mensagem.includes('Login já cadastrado')) {
            return throwError(() => new Error('Este login já está em uso. Escolha outro.'));
          }
          if (mensagem.includes('CPF já cadastrado')) {
            return throwError(() => new Error('Este CPF já está cadastrado.'));
          }
          if (mensagem.includes('Email já cadastrado')) {
            return throwError(() => new Error('Este email já está cadastrado.'));
          }
          if (mensagem.includes('password cannot be longer than 72 bytes')) {
            return throwError(() => new Error('A senha excede o limite de segurança (máx. 72 caracteres). Por favor, escolha uma senha mais curta.'));
          }

          return throwError(() => new Error(mensagem));
        }

        return throwError(() => new Error('Erro interno do servidor. Tente novamente.'));
      })
    );
  }


  consultarCEP(cep: string): Observable<any> {
    const cepLimpo = cep.replace(/\D/g, '');
    return this.http.get(`${environment.viaCepUrl}/${cepLimpo}/json/`);
  }
}
