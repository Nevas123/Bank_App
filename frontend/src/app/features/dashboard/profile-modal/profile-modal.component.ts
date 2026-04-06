import { Component, EventEmitter, Output, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { SessionStore } from '../../../core/stores/session.store';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  template: `
    <div class="modal-backdrop" (click)="close.emit()" data-testid="profile-modal-backdrop">
      <section class="modal-card profile-modal" (click)="$event.stopPropagation()" data-testid="profile-modal">
        <button type="button" class="modal-close" (click)="close.emit()" data-testid="profile-modal-close">
          {{ languageService.t('close') }}
        </button>
        <div class="profile-avatar" aria-hidden="true"></div>
        <h2>{{ sessionStore.currentUser()?.fullName }}</h2>
        <div class="profile-detail">
          <span>{{ languageService.t('email') }}</span>
          <strong>{{ sessionStore.currentUser()?.email }}</strong>
        </div>
        <div class="profile-detail">
          <span>{{ languageService.t('phone') }}</span>
          <strong>{{ sessionStore.currentUser()?.phone }}</strong>
        </div>
      </section>
    </div>
  `
})
export class ProfileModalComponent {
  @Output() readonly close = new EventEmitter<void>();

  readonly languageService = inject(LanguageService);
  readonly sessionStore = inject(SessionStore);
}
