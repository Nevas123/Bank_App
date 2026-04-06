import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HeaderBalanceComponent } from '../header-balance/header-balance.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProfileModalComponent } from '../../dashboard/profile-modal/profile-modal.component';
import { ExitDialogComponent } from '../../dashboard/exit-dialog/exit-dialog.component';
import { SessionStore } from '../../../core/stores/session.store';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderBalanceComponent,
    LanguageSwitcherComponent,
    SidebarComponent,
    ProfileModalComponent,
    ExitDialogComponent
  ],
  template: `
    <div class="app-shell">
      <header class="shell-header">
        <div class="shell-header-spacer"></div>
        <app-header-balance></app-header-balance>
        <app-language-switcher></app-language-switcher>
      </header>

      <div class="shell-body">
        <app-sidebar *ngIf="showSidebar()" (profile)="showProfile.set(true)" (exit)="showExit.set(true)"></app-sidebar>

        <section class="shell-content" [class.full-width]="!showSidebar()">
          <router-outlet></router-outlet>
        </section>
      </div>

      <app-profile-modal *ngIf="showProfile()" (close)="showProfile.set(false)"></app-profile-modal>
      <app-exit-dialog *ngIf="showExit()" (cancel)="showExit.set(false)" (confirm)="logout()"></app-exit-dialog>
    </div>
  `
})
export class AppShellComponent {
  readonly authService = inject(AuthService);
  readonly sessionStore = inject(SessionStore);
  readonly router = inject(Router);

  readonly showProfile = signal(false);
  readonly showExit = signal(false);

  readonly showSidebar = () => this.router.url === '/dashboard';

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.showExit.set(false);
        this.sessionStore.clearSession();
        this.router.navigateByUrl('/login');
      },
      error: () => {
        this.showExit.set(false);
        this.sessionStore.clearSession();
        this.router.navigateByUrl('/login');
      }
    });
  }
}
