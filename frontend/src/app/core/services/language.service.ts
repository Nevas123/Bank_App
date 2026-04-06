import { Injectable, computed, inject } from '@angular/core';
import { SessionStore } from '../stores/session.store';
import { Language, TranslationKey, translations } from './translations';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly sessionStore = inject(SessionStore);
  readonly currentLanguage = computed(() => this.sessionStore.currentLanguage());

  setLanguage(language: Language): void {
    this.sessionStore.setLanguage(language);
  }

  t(key: TranslationKey): string {
    return translations[this.currentLanguage()][key];
  }
}
