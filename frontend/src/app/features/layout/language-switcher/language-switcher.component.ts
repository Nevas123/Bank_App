import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  template: `
    <div class="language-switcher" data-testid="language-switcher">
      <button
        type="button"
        class="language-button"
        [class.selected]="languageService.currentLanguage() === 'en'"
        (click)="languageService.setLanguage('en')"
        data-testid="lang-eng"
      >
        ENG
      </button>
      <button
        type="button"
        class="language-button"
        [class.selected]="languageService.currentLanguage() === 'es'"
        (click)="languageService.setLanguage('es')"
        data-testid="lang-esp"
      >
        ESP
      </button>
    </div>
  `
})
export class LanguageSwitcherComponent {
  readonly languageService = inject(LanguageService);
}
