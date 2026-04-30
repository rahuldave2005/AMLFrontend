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
      if (error instanceof HttpErrorResponse && !authReq.url.includes('auth/login') && error.status === 401) {
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

    if (refreshToken) {
      return authService.refreshToken(refreshToken).pipe(
        switchMap((response) => {
          isRefreshing = false;
          refreshTokenSubject.next(response.jwt);
          return next(addTokenHeader(request, response.jwt, response.prefix || 'Bearer'));
        }),
        catchError((err) => {
          isRefreshing = false;
          authService.logout();
          return throwError(() => err);
        })
      );
    } else {
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
