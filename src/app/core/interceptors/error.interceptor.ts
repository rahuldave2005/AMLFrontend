import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { ErrorResponse } from '../models/error.models';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        if (error.error) {
          if (typeof error.error === 'object') {
            // Directly check for 'message' as per the user's ErrorResponse DTO
            const body = error.error as any;
            errorMessage = body.message || body.error || error.message;
          } else if (typeof error.error === 'string') {
            // Sometimes errors come back as plain text or JSON strings
            try {
              const parsed = JSON.parse(error.error);
              errorMessage = parsed.message || parsed.error || error.error;
            } catch {
              errorMessage = error.error;
            }
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      if (error.status === 401) {
        // Skip toast for 401 as it's handled by silent refresh
        return throwError(() => error);
      }

      toastService.error(errorMessage, `Error ${error.status || ''}`);

      return throwError(() => error);
    })
  );
};
