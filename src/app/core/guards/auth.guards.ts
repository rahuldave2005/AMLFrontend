import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard: Ensures the user is logged in.
 * If not authenticated, redirects to the login page.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getCurrentUser()) {
    return true;
  }

  // Store the attempted URL for redirection after login
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/**
 * RoleGuard: Ensures the user has at least one of the required roles.
 * Pass required roles in route data: { data: { roles: ['BANK_ADMIN'] } }
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  const expectedRoles = route.data['roles'] as string[];
  
  // Check if user has any of the expected roles
  const hasRole = user.roles.some(role => expectedRoles.includes(role));

  if (hasRole) {
    return true;
  }

  // Redirect to unauthorized or dashboard if role doesn't match
  return router.createUrlTree(['/dashboard']); 
};
