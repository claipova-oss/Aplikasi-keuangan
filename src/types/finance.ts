export type TransactionType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
  type: TransactionType;
}

export type WalletType = 'cash' | 'bank' | 'ewallet' | 'other';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  iconName: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  walletId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  note: string;
  createdAt: number;
}

export interface BudgetConfig {
  dailyLimit: number;
  monthlyLimit: number;
  isEnabled: boolean;
}

export type PeriodFilter = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

export interface FilterState {
  period: PeriodFilter;
  type: 'all' | 'expense' | 'income';
  categoryId: string; // 'all' or category id
  walletId: string; // 'all' or wallet id
  searchQuery: string;
  startDate?: string;
  endDate?: string;
}

export interface QuickTemplate {
  id: string;
  title: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  walletId: string;
  note: string;
}
