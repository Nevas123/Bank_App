import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../stores/session.store';

export const rootRedirectGuard: CanActivateFn = () => {
  const sessionStore = inject(SessionStore);
  const router = inject(Router);

  return router.createUrlTree([sessionStore.isAuthenticated() ? '/dashboard' : '/login']);
};
