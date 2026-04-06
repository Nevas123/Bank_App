import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../stores/session.store';

export const guestGuard: CanActivateFn = () => {
  const sessionStore = inject(SessionStore);
  const router = inject(Router);

  return sessionStore.isAuthenticated() ? router.createUrlTree(['/dashboard']) : true;
};
