import { Component, EventEmitter, Output, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-exit-dialog',
  standalone: true,
  template: `
    <div class="modal-backdrop" (click)="cancel.emit()" data-testid="exit-dialog-backdrop">
      <section class="modal-card exit-dialog" (click)="$event.stopPropagation()" data-testid="exit-dialog">
        <h2>{{ languageService.t('exitTitle') }}</h2>
        <p>{{ languageService.t('exitBody') }}</p>
        <div class="dialog-actions">
          <button type="button" class="secondary-button" (click)="cancel.emit()" data-testid="exit-cancel">
            {{ languageService.t('cancel') }}
          </button>
          <button type="button" class="primary-button" (click)="confirm.emit()" data-testid="exit-confirm">
            {{ languageService.t('confirmExit') }}
          </button>
        </div>
      </section>
    </div>
  `
})
export class ExitDialogComponent {
  @Output() readonly cancel = new EventEmitter<void>();
  @Output() readonly confirm = new EventEmitter<void>();

  readonly languageService = inject(LanguageService);
}
