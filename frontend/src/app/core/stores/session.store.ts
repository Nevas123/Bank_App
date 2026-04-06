import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Language } from '../services/translations';
import { Profile, SessionResponse, Transaction, TransferDraft, TransferResult } from '../models/api.models';

type SessionStatus = 'loading' | 'guest' | 'authenticated';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly authService = inject(AuthService);

  private readonly statusSignal = signal<SessionStatus>('loading');
  private readonly userSignal = signal<Profile | null>(null);
  private readonly balanceSignal = signal(0);
  private readonly transactionsSignal = signal<Transaction[]>([]);
  private readonly languageSignal = signal<Language>('en');
  private readonly pendingTransferSignal = signal<TransferDraft | null>(null);

  readonly isAuthenticated = computed(() => this.statusSignal() === 'authenticated');
  readonly currentUser = computed(() => this.userSignal());
  readonly balance = computed(() => this.balanceSignal());
  readonly transactions = computed(() => this.transactionsSignal());
  readonly currentLanguage = computed(() => this.languageSignal());
  readonly pendingTransfer = computed(() => this.pendingTransferSignal());

  async initialize(): Promise<void> {
    const savedLanguage = localStorage.getItem('app-bank-language');
    if (savedLanguage === 'en' || savedLanguage === 'es') {
      this.languageSignal.set(savedLanguage);
    }

    try {
      const session = await firstValueFrom(this.authService.me());
      this.setSessionFromResponse(session);
    } catch {
      this.clearSession();
    }
  }

  setLanguage(language: Language): void {
    this.languageSignal.set(language);
    localStorage.setItem('app-bank-language', language);
  }

  setSessionFromResponse(session: SessionResponse): void {
    if (!session.isAuthenticated || !session.user) {
      this.clearSession();
      return;
    }

    this.userSignal.set(session.user);
    this.balanceSignal.set(session.balance);
    this.transactionsSignal.set(session.transactions);
    this.statusSignal.set('authenticated');
  }

  clearSession(): void {
    this.statusSignal.set('guest');
    this.userSignal.set(null);
    this.balanceSignal.set(0);
    this.transactionsSignal.set([]);
    this.pendingTransferSignal.set(null);
  }

  setPendingTransfer(draft: TransferDraft): void {
    this.pendingTransferSignal.set(draft);
  }

  clearPendingTransfer(): void {
    this.pendingTransferSignal.set(null);
  }

  applyTransferResult(result: TransferResult): void {
    this.balanceSignal.set(result.balance);
    this.transactionsSignal.update((transactions) => [result.transaction, ...transactions]);
  }
}
