import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-slide-to-confirm',
  standalone: true,
  template: `
    <div class="slide-confirm" data-testid="slide-to-confirm">
      <label for="slide-control">{{ languageService.t('slideToConfirm') }}</label>
      <input
        id="slide-control"
        type="range"
        min="0"
        max="100"
        step="1"
        [disabled]="disabled"
        [value]="value()"
        (input)="onInput($event)"
        (change)="onCommit()"
        data-testid="slide-control"
      >
    </div>
  `
})
export class SlideToConfirmComponent {
  @Input() disabled = false;
  @Output() readonly confirmed = new EventEmitter<void>();

  readonly languageService = inject(LanguageService);
  readonly value = signal(0);

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(Number(target.value));
  }

  onCommit(): void {
    if (this.disabled) {
      this.value.set(0);
      return;
    }

    if (this.value() >= 90) {
      this.value.set(100);
      this.confirmed.emit();
      return;
    }

    this.value.set(0);
  }
}
