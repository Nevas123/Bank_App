import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { SessionStore } from '../../../core/stores/session.store';

@Component({
  selector: 'app-header-balance',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <section class="balance-card" data-testid="balance-card">
      <p>{{ languageService.t('balanceLabel') }}</p>
      <strong>{{ sessionStore.balance() | currency:'EUR':'symbol':'1.2-2':'en' }}</strong>
    </section>
  `
})
export class HeaderBalanceComponent {
  readonly languageService = inject(LanguageService);
  readonly sessionStore = inject(SessionStore);
}
