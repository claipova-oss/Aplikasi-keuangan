import {
  Transaction,
  Category,
  Wallet,
  QuickTemplate,
  BudgetConfig,
} from '../types/finance';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_WALLETS,
  DEFAULT_QUICK_TEMPLATES,
  DEFAULT_BUDGET,
  generateSampleTransactions,
} from '../constants/defaultData';

const KEYS = {
  TRANSACTIONS: 'bukukas_transactions_v1',
  CATEGORIES: 'bukukas_categories_v1',
  WALLETS: 'bukukas_wallets_v1',
  TEMPLATES: 'bukukas_templates_v1',
  BUDGET: 'bukukas_budget_v1',
  INITIALIZED: 'bukukas_initialized_v1',
};

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(KEYS.TRANSACTIONS);
    if (!raw) {
      // First time initialization with demo data
      const initial = generateSampleTransactions();
      saveTransactions(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load transactions:', err);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions:', err);
  }
}

export function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(KEYS.CATEGORIES);
    if (!raw) {
      saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load categories:', err);
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories:', err);
  }
}

export function loadWallets(): Wallet[] {
  try {
    const raw = localStorage.getItem(KEYS.WALLETS);
    if (!raw) {
      saveWallets(DEFAULT_WALLETS);
      return DEFAULT_WALLETS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load wallets:', err);
    return DEFAULT_WALLETS;
  }
}

export function saveWallets(wallets: Wallet[]): void {
  try {
    localStorage.setItem(KEYS.WALLETS, JSON.stringify(wallets));
  } catch (err) {
    console.error('Failed to save wallets:', err);
  }
}

export function loadTemplates(): QuickTemplate[] {
  try {
    const raw = localStorage.getItem(KEYS.TEMPLATES);
    if (!raw) {
      saveTemplates(DEFAULT_QUICK_TEMPLATES);
      return DEFAULT_QUICK_TEMPLATES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load templates:', err);
    return DEFAULT_QUICK_TEMPLATES;
  }
}

export function saveTemplates(templates: QuickTemplate[]): void {
  try {
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(templates));
  } catch (err) {
    console.error('Failed to save templates:', err);
  }
}

export function loadBudget(): BudgetConfig {
  try {
    const raw = localStorage.getItem(KEYS.BUDGET);
    if (!raw) {
      saveBudget(DEFAULT_BUDGET);
      return DEFAULT_BUDGET;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load budget:', err);
    return DEFAULT_BUDGET;
  }
}

export function saveBudget(budget: BudgetConfig): void {
  try {
    localStorage.setItem(KEYS.BUDGET, JSON.stringify(budget));
  } catch (err) {
    console.error('Failed to save budget:', err);
  }
}

export function exportToCSV(
  transactions: Transaction[],
  categories: Category[],
  wallets: Wallet[]
): void {
  const catMap = new Map(categories.map((c) => [c.id, c.name]));
  const walMap = new Map(wallets.map((w) => [w.id, w.name]));

  const headers = ['Tanggal', 'Waktu', 'Tipe', 'Kategori', 'Sumber Dompet', 'Nominal (Rp)', 'Catatan'];
  const rows = transactions.map((t) => [
    t.date,
    t.time || '',
    t.type === 'expense' ? 'Pengeluaran' : 'Pemasukan',
    `"${(catMap.get(t.categoryId) || 'Lainnya').replace(/"/g, '""')}"`,
    `"${(walMap.get(t.walletId) || 'Dompet').replace(/"/g, '""')}"`,
    t.amount,
    `"${(t.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `catatan_keuangan_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportBackupJSON(): void {
  const backupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    transactions: loadTransactions(),
    categories: loadCategories(),
    wallets: loadWallets(),
    templates: loadTemplates(),
    budget: loadBudget(),
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `cadangan_bukukas_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
