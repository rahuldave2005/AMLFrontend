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
  const user = authService.getCurrentUser();

  if (user) {
    // Redirect staff members to change password on first login
    const isStaff = user.roles.some(role => role === 'BANK_ADMIN' || role === 'COMPLIANCE_OFFICER');
    if (user.isFirstLogin && isStaff && state.url !== '/change-password') {
      return router.createUrlTree(['/change-password']);
    }
    
    // Prevent access to change-password if not a first login
    if (!user.isFirstLogin && state.url === '/change-password') {
      return router.createUrlTree(['/dashboard']);
    }

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
