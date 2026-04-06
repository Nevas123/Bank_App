import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/auth/login-page/login-page.component';
import { AppShellComponent } from './features/layout/app-shell/app-shell.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { TransferFormPageComponent } from './features/transfer/transfer-form-page/transfer-form-page.component';
import { TransferConfirmPageComponent } from './features/transfer/transfer-confirm-page/transfer-confirm-page.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { rootRedirectGuard } from './core/guards/root-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [rootRedirectGuard],
    component: LoginPageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [guestGuard]
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardPageComponent
      },
      {
        path: 'transfer',
        component: TransferFormPageComponent
      },
      {
        path: 'transfer/confirm',
        component: TransferConfirmPageComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
