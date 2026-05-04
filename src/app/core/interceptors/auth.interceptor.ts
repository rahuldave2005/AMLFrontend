import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError, BehaviorSubject, switchMap, filter, take } from 'rxjs';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const prefix = authService.getTokenPrefix();

  let authReq = req;
  if (token) {
    authReq = addTokenHeader(req, token, prefix);
  }

  return next(authReq).pipe(
    catchError((error) => {
      const isAuthRequest = authReq.url.includes('auth/login') || authReq.url.includes('auth/refreshtoken');
      
      console.log(`[Auth Interceptor] Request failed: ${authReq.url}`, {
        status: error.status,
        isAuthRequest,
        hasToken: !!token
      });

      if (error instanceof HttpErrorResponse && !isAuthRequest && error.status === 401) {
        console.log('[Auth Interceptor] 401 Detected, initiating refresh flow...');
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

const addTokenHeader = (request: HttpRequest<any>, token: string, prefix: string) => {
  return request.clone({
    setHeaders: {
      Authorization: `${prefix} ${token}`
    }
  });
};

const handle401Error = (request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = authService.getRefreshToken();
    console.log('[Auth Interceptor] Found refresh token:', !!refreshToken);

    if (refreshToken) {
      return authService.refreshToken(refreshToken).pipe(
        switchMap((response) => {
          console.log('[Auth Interceptor] Token refresh successful');
          isRefreshing = false;
          refreshTokenSubject.next(response.jwt);
          return next(addTokenHeader(request, response.jwt, response.prefix || 'Bearer'));
        }),
        catchError((err) => {
          console.error('[Auth Interceptor] Token refresh failed:', err);
          isRefreshing = false;
          authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      console.warn('[Auth Interceptor] No refresh token available, logging out');
      isRefreshing = false;
      authService.logout();
      return throwError(() => new Error('No refresh token available'));
    }
  }

  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap((token) => next(addTokenHeader(request, token, authService.getTokenPrefix())))
  );
};
