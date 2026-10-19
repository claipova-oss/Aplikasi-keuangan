import { Category, Wallet, QuickTemplate, Transaction, BudgetConfig } from '../types/finance';
import { getTodayDateString } from '../utils/formatters';

export const DEFAULT_CATEGORIES: Category[] = [
  // Pengeluaran (Expense)
  { id: 'cat_food', name: 'Makanan & Minuman', iconName: 'Utensils', color: '#f97316', type: 'expense' },
  { id: 'cat_transport', name: 'Transport & Bensin', iconName: 'Car', color: '#0ea5e9', type: 'expense' },
  { id: 'cat_groceries', name: 'Belanja Kebutuhan', iconName: 'ShoppingBag', color: '#10b981', type: 'expense' },
  { id: 'cat_bills', name: 'Tagihan, Listrik & Pulsa', iconName: 'Zap', color: '#8b5cf6', type: 'expense' },
  { id: 'cat_entertainment', name: 'Hiburan & Santai', iconName: 'Coffee', color: '#ec4899', type: 'expense' },
  { id: 'cat_health', name: 'Kesehatan & Obat', iconName: 'HeartPulse', color: '#ef4444', type: 'expense' },
  { id: 'cat_education', name: 'Pendidikan & Buku', iconName: 'GraduationCap', color: '#06b6d4', type: 'expense' },
  { id: 'cat_family', name: 'Keluarga & Rumah', iconName: 'Home', color: '#6366f1', type: 'expense' },
  { id: 'cat_donation', name: 'Sedekah & Donasi', iconName: 'HeartHandshake', color: '#14b8a6', type: 'expense' },
  { id: 'cat_other_exp', name: 'Pengeluaran Lainnya', iconName: 'Package', color: '#64748b', type: 'expense' },

  // Pemasukan (Income)
  { id: 'cat_salary', name: 'Gaji Pokok', iconName: 'Briefcase', color: '#059669', type: 'income' },
  { id: 'cat_business', name: 'Usaha / Dagang', iconName: 'Store', color: '#16a34a', type: 'income' },
  { id: 'cat_freelance', name: 'Freelance & Jasa', iconName: 'Laptop', color: '#2563eb', type: 'income' },
  { id: 'cat_bonus', name: 'Bonus / THR', iconName: 'Gift', color: '#d97706', type: 'income' },
  { id: 'cat_investment', name: 'Investasi & Dividen', iconName: 'TrendingUp', color: '#7c3aed', type: 'income' },
  { id: 'cat_other_inc', name: 'Pemasukan Lainnya', iconName: 'Sparkles', color: '#475569', type: 'income' },
];

export const DEFAULT_WALLETS: Wallet[] = [
  { id: 'wallet_cash', name: 'Uang Tunai (Cash)', type: 'cash', iconName: 'Banknote', color: '#10b981' },
  { id: 'wallet_bank', name: 'Rekening Bank', type: 'bank', iconName: 'CreditCard', color: '#2563eb' },
  { id: 'wallet_ewallet', name: 'Dompet Digital (E-Wallet)', type: 'ewallet', iconName: 'Smartphone', color: '#8b5cf6' },
];

export const DEFAULT_QUICK_TEMPLATES: QuickTemplate[] = [
  { id: 'tmpl_1', title: 'Makan Siang', type: 'expense', amount: 25000, categoryId: 'cat_food', walletId: 'wallet_cash', note: 'Makan siang & es teh' },
  { id: 'tmpl_2', title: 'Kopi Pagi', type: 'expense', amount: 18000, categoryId: 'cat_entertainment', walletId: 'wallet_ewallet', note: 'Kopi susu pagi' },
  { id: 'tmpl_3', title: 'Bensin Motor', type: 'expense', amount: 30000, categoryId: 'cat_transport', walletId: 'wallet_cash', note: 'Isi Pertalite motor' },
  { id: 'tmpl_4', title: 'Parkir Harian', type: 'expense', amount: 4000, categoryId: 'cat_transport', walletId: 'wallet_cash', note: 'Parkir kendaraan' },
  { id: 'tmpl_5', title: 'Pulsa / Kuota Data', type: 'expense', amount: 50000, categoryId: 'cat_bills', walletId: 'wallet_ewallet', note: 'Paket internet bulanan' },
];

export const DEFAULT_BUDGET: BudgetConfig = {
  dailyLimit: 150000, // Rp 150.000 / hari
  monthlyLimit: 4500000, // Rp 4.500.000 / bulan
  isEnabled: true,
};

export function generateSampleTransactions(): Transaction[] {
  const today = getTodayDateString();
  const d = new Date();
  
  // Date helpers
  const getDateOffset = (daysAgo: number): string => {
    const target = new Date(d);
    target.setDate(target.getDate() - daysAgo);
    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const day = String(target.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return [
    {
      id: 'tx_demo_1',
      type: 'expense',
      amount: 25000,
      categoryId: 'cat_food',
      walletId: 'wallet_cash',
      date: today,
      time: '12:30',
      note: 'Makan siang nasi padang & es jeruk',
      createdAt: Date.now() - 3600000 * 2,
    },
    {
      id: 'tx_demo_2',
      type: 'expense',
      amount: 18000,
      categoryId: 'cat_entertainment',
      walletId: 'wallet_ewallet',
      date: today,
      time: '08:45',
      note: 'Kopi susu gula aren',
      createdAt: Date.now() - 3600000 * 5,
    },
    {
      id: 'tx_demo_3',
      type: 'expense',
      amount: 35000,
      categoryId: 'cat_transport',
      walletId: 'wallet_cash',
      date: getDateOffset(1),
      time: '17:15',
      note: 'Bensin Pertamax full tank motor',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'tx_demo_4',
      type: 'expense',
      amount: 65000,
      categoryId: 'cat_groceries',
      walletId: 'wallet_ewallet',
      date: getDateOffset(1),
      time: '19:40',
      note: 'Beli sabun, pasta gigi, dan buah apel',
      createdAt: Date.now() - 86400000 - 3600000,
    },
    {
      id: 'tx_demo_5',
      type: 'income',
      amount: 750000,
      categoryId: 'cat_freelance',
      walletId: 'wallet_bank',
      date: getDateOffset(2),
      time: '14:20',
      note: 'Pembayaran proyek desain logo & banner',
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'tx_demo_6',
      type: 'expense',
      amount: 42000,
      categoryId: 'cat_food',
      walletId: 'wallet_cash',
      date: getDateOffset(2),
      time: '13:00',
      note: 'Makan siang bersama rekan kerja',
      createdAt: Date.now() - 86400000 * 2 - 3600000,
    },
    {
      id: 'tx_demo_7',
      type: 'expense',
      amount: 150000,
      categoryId: 'cat_bills',
      walletId: 'wallet_bank',
      date: getDateOffset(3),
      time: '09:10',
      note: 'Token listrik PLN rumah',
      createdAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'tx_demo_8',
      type: 'income',
      amount: 4500000,
      categoryId: 'cat_salary',
      walletId: 'wallet_bank',
      date: getDateOffset(5),
      time: '08:00',
      note: 'Gaji bulanan',
      createdAt: Date.now() - 86400000 * 5,
    },
  ];
}
