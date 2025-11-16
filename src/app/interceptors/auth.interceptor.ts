import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Não adiciona header de autenticação para APIs externas (FIPE, ViaCEP, etc.)
  const isExternalApi = req.url.includes(environment.fipeApiUrl) || 
                       req.url.includes(environment.viaCepUrl);

  const token = authService.obterToken();

  if (token && !isExternalApi) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Verifica se o erro é de uma API externa
      const isExternalApiError = error.url?.includes(environment.fipeApiUrl) || 
                                 error.url?.includes(environment.viaCepUrl);

      // Só faz logout se o erro 401 for da API interna
      if (error.status === 401 && !isExternalApiError) {
        authService.logout();
        router.navigate(['/login']);
      }

      if (error.status === 403 && !isExternalApiError) {
        if (authService.isAdmin()) {
          router.navigate(['/inicio-admin']);
        } else {
          router.navigate(['/inicio']);
        }
      }

      return throwError(() => error);
    })
  );
};

