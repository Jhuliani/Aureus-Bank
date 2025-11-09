import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const clienteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se está logado
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Verifica se é cliente
  if (authService.isCliente()) {
    return true;
  }

  // Se não for cliente, redireciona para a página inicial do admin
  router.navigate(['/bemvindo']);
  return false;
};

