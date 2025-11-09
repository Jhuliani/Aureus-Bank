import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Usuario {
  id_usuario?: number;
  id_perfil?: number;
  login: string;
  nome?: string;
  email?: string;
  senha?: string;
  data_criacao?: string;
  ativo?: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  id_cliente: number;
  nome_cliente: string;
  id_perfil?: number;
  id_usuario?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  fazerLogin(login: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { login, senha });
  }

  salvarUsuarioLocal(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  salvarDadosLogin(loginData: LoginResponse): void {
    localStorage.setItem('auth_data', JSON.stringify(loginData));
  }

  obterDadosLogin(): LoginResponse | null {
    const authDataStr = localStorage.getItem('auth_data');
    return authDataStr ? JSON.parse(authDataStr) : null;
  }

  obterToken(): string | null {
    const authData = this.obterDadosLogin();
    return authData ? authData.access_token : null;
  }

  obterRefreshToken(): string | null {
    const authData = this.obterDadosLogin();
    return authData ? authData.refresh_token : null;
  }

  obterUsuarioLocal(): Usuario | null {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('auth_data');
  }

  isLoggedIn(): boolean {
    return this.obterDadosLogin() !== null;
  }

  obterIdPerfil(): number | null {
    const usuario = this.obterUsuarioLocal();
    if (usuario && usuario.id_perfil) {
      return usuario.id_perfil;
    }
    
    const authData = this.obterDadosLogin();
    if (authData && authData.id_perfil) {
      return authData.id_perfil;
    }
    
    return null;
  }

  isAdmin(): boolean {
    return this.obterIdPerfil() === 2;
  }

  isCliente(): boolean {
    return this.obterIdPerfil() === 1;
  }
}
