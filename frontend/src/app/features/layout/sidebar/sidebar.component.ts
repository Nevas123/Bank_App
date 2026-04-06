import { Component, EventEmitter, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { SessionStore } from '../../../core/stores/session.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <aside class="sidebar" data-testid="sidebar">
      <button type="button" class="profile-bubble" (click)="profile.emit()" data-testid="profile-bubble">
        <span>{{ initials }}</span>
      </button>

      <nav class="sidebar-nav">
        <a routerLink="/dashboard" class="sidebar-link" data-testid="main-menu-link">
          {{ languageService.t('mainMenu') }}
        </a>
      </nav>

      <button type="button" class="sidebar-exit" (click)="exit.emit()" data-testid="exit-button">
        {{ languageService.t('exit') }}
      </button>
    </aside>
  `
})
export class SidebarComponent {
  @Output() readonly profile = new EventEmitter<void>();
  @Output() readonly exit = new EventEmitter<void>();

  readonly languageService = inject(LanguageService);
  readonly sessionStore = inject(SessionStore);

  get initials(): string {
    const name = this.sessionStore.currentUser()?.fullName ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }
}
