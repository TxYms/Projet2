import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';

/**
 * Adds "Authorization: Bearer <token>" to every API call (except login and register).
 * If the back-end answers 401 (token expired or invalid), the user is logged out.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isPublicRoute = req.url.includes('/api/login') || req.url.includes('/api/register');

  const request = token && !isPublicRoute
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isPublicRoute) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
