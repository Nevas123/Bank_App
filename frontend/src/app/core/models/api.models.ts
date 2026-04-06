export interface Profile {
  fullName: string;
  email: string;
  phone: string;
}

export interface Transaction {
  id: string;
  date: string;
  recipient: string;
  amount: number;
  status: string;
}

export interface SessionResponse {
  isAuthenticated: boolean;
  user: Profile | null;
  balance: number;
  transactions: Transaction[];
}

export interface TransferDraft {
  draftId: string;
  recipientName: string;
  accountNumber: string;
  amount: string;
}

export interface TransferRequest extends TransferDraft {}

export interface TransferResult {
  balance: number;
  transaction: Transaction;
  alreadyProcessed: boolean;
}
