import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DadosCadastro {
  // Dados pessoais
  nome: string;
  cpf: string;
  telefone: string;
  renda: number;

  // Endereço
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;

  // Dados de acesso
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

  /**
   * Trunca a senha para máximo 72 bytes (limite do bcrypt)
   * Mantém a senha como string, mas respeita o limite de bytes
   */
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

  /**
   * Realiza o cadastro completo do cliente
   * UMA ÚNICA REQUISIÇÃO com transação atômica no backend
   */
  cadastrarCliente(dados: DadosCadastro): Observable<any> {
    // Preparar dados para o endpoint único
    const dadosCompletos = {
      // Dados pessoais
      nome: dados.nome,
      cpf: dados.cpf.replace(/\D/g, ''), // Remove formatação
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

      // Usuário
      login: dados.usuario,
      senha: this.truncarSenhaPorBytes(dados.senha) // Truncar por bytes (limite bcrypt)
    };

    console.log('📤 Enviando dados completos para cadastro:', dadosCompletos);

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



  /**
   * Consulta CEP no ViaCEP
   */
  consultarCEP(cep: string): Observable<any> {
    const cepLimpo = cep.replace(/\D/g, '');
    return this.http.get(`${environment.viaCepUrl}/${cepLimpo}/json/`);
  }
}
