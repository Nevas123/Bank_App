import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SessionStore } from '../stores/session.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const sessionStore = inject(SessionStore);

  return next(req.clone({ withCredentials: true })).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/me');
      if (error.status === 401 && !isAuthEndpoint) {
        sessionStore.clearSession();
        router.navigateByUrl('/login');
      }

      return throwError(() => error);
    })
  );
};
