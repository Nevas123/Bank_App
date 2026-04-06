import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { SessionStore } from '../../../core/stores/session.store';

@Component({
  selector: 'app-transactions-table',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <section class="card transactions-card" data-testid="transactions-card">
      <div class="section-header">
        <h2 data-testid="transactions-title">{{ languageService.t('latestTransactions') }}</h2>
      </div>

      <table class="transactions-table" data-testid="transactions-table">
        <thead>
          <tr>
            <th>{{ languageService.t('date') }}</th>
            <th>{{ languageService.t('recipient') }}</th>
            <th>{{ languageService.t('amount') }}</th>
            <th>{{ languageService.t('status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let transaction of sessionStore.transactions(); let index = index" [attr.data-testid]="'transaction-row-' + index">
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.recipient }}</td>
            <td [class.negative]="transaction.amount < 0" [class.positive]="transaction.amount > 0">
              {{ transaction.amount | currency:'EUR':'symbol':'1.2-2':'en' }}
            </td>
            <td>{{ transaction.status }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  `
})
export class TransactionsTableComponent {
  readonly languageService = inject(LanguageService);
  readonly sessionStore = inject(SessionStore);
}
