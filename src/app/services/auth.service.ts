import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
    try {
      const authDataStr = localStorage.getItem('auth_data');
      if (!authDataStr) return null;
      return JSON.parse(authDataStr);
    } catch (error) {
      console.error('Erro ao ler dados de autenticação:', error);
      this.logout();
      return null;
    }
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
    try {
      const usuarioStr = localStorage.getItem('usuario');
      if (!usuarioStr) return null;
      return JSON.parse(usuarioStr);
    } catch (error) {
      console.error('Erro ao ler dados do usuário:', error);
      localStorage.removeItem('usuario');
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('auth_data');
  }

  isLoggedIn(): boolean {
    const dadosLogin = this.obterDadosLogin();
    if (!dadosLogin || !dadosLogin.access_token) {
      return false;
    }
    return this.verificarTokenValido(dadosLogin.access_token);
  }

  verificarTokenValido(token: string): boolean {
    try {
      const partes = token.split('.');
      if (partes.length !== 3) return false;

      const payload = JSON.parse(atob(partes[1]));
      const expiracao = payload.exp * 1000;
      const agora = Date.now();

      return expiracao > agora;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  }

  renovarToken(): Observable<LoginResponse> {
    const refreshToken = this.obterRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token não encontrado'));
    }
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, { refresh_token: refreshToken });
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
