import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se está logado
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Verifica se é admin
  if (authService.isAdmin()) {
    return true;
  }

  // Se não for admin, redireciona para a página inicial do cliente
  router.navigate(['/inicio']);
  return false;
};

