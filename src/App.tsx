/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Transaction,
  Category,
  Wallet,
  QuickTemplate,
  BudgetConfig,
  FilterState,
} from './types/finance';
import {
  loadTransactions,
  saveTransactions,
  loadCategories,
  saveCategories,
  loadWallets,
  saveWallets,
  loadTemplates,
  saveTemplates,
  loadBudget,
  saveBudget,
  exportToCSV,
  exportBackupJSON,
} from './utils/storage';
import { generateSampleTransactions } from './constants/defaultData';
import { getTodayDateString, getCurrentTimeString, formatRupiah } from './utils/formatters';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { QuickTemplatesBar } from './components/QuickTemplatesBar';
import { FilterBar } from './components/FilterBar';
import { TransactionList } from './components/TransactionList';
import { AnalyticsView } from './components/AnalyticsView';
import { WalletView } from './components/WalletView';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { Check, Plus } from 'lucide-react';

export default function App() {
  // Primary state loaded from storage
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [categories, setCategories] = useState<Category[]>(() => loadCategories());
  const [wallets, setWallets] = useState<Wallet[]>(() => loadWallets());
  const [templates, setTemplates] = useState<QuickTemplate[]>(() => loadTemplates());
  const [budget, setBudget] = useState<BudgetConfig>(() => loadBudget());

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<'list' | 'analytics' | 'wallets'>('list');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [prefillTx, setPrefillTx] = useState<Partial<Transaction> | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter state
  const [filter, setFilter] = useState<FilterState>({
    period: 'all',
    type: 'all',
    categoryId: 'all',
    walletId: 'all',
    searchQuery: '',
  });

  // Save changes to localStorage when updated
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveWallets(wallets);
  }, [wallets]);

  useEffect(() => {
    saveTemplates(templates);
  }, [templates]);

  useEffect(() => {
    saveBudget(budget);
  }, [budget]);

  // Overall calculations across all time
  const totalBalance = useMemo(() => {
    const totalInc = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExp = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return totalInc - totalExp;
  }, [transactions]);

  // Today's total expense for budget tracking
  const todayExpense = useMemo(() => {
    const today = getTodayDateString();
    return transactions
      .filter((t) => t.type === 'expense' && t.date === today)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Filtered transactions based on active filter state
  const filteredTransactions = useMemo(() => {
    const today = getTodayDateString();
    const d = new Date();

    // Start of this week (Monday)
    const startOfWeek = new Date(d);
    const dayOfWeek = d.getDay();
    const diffToMonday = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of this month (1st of month)
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);

    const catMap = new Map(categories.map((c) => [c.id, c.name.toLowerCase()]));

    return transactions
      .filter((tx) => {
        // Period filter
        if (filter.period === 'today') {
          if (tx.date !== today) return false;
        } else if (filter.period === 'this_week') {
          const txDate = new Date(`${tx.date}T00:00:00`);
          if (txDate < startOfWeek) return false;
        } else if (filter.period === 'this_month') {
          const txDate = new Date(`${tx.date}T00:00:00`);
          if (txDate < startOfMonth) return false;
        } else if (filter.period === 'custom') {
          if (filter.startDate && tx.date < filter.startDate) return false;
          if (filter.endDate && tx.date > filter.endDate) return false;
        }

        // Type filter
        if (filter.type !== 'all' && tx.type !== filter.type) {
          return false;
        }

        // Category filter
        if (filter.categoryId !== 'all' && tx.categoryId !== filter.categoryId) {
          return false;
        }

        // Wallet filter
        if (filter.walletId !== 'all' && tx.walletId !== filter.walletId) {
          return false;
        }

        // Search query filter (matches note, category name, or amount)
        if (filter.searchQuery.trim()) {
          const q = filter.searchQuery.toLowerCase().trim();
          const noteMatch = (tx.note || '').toLowerCase().includes(q);
          const catName = catMap.get(tx.categoryId) || '';
          const catMatch = catName.includes(q);
          const amountMatch = tx.amount.toString().includes(q);
          if (!noteMatch && !catMatch && !amountMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Sort descending by date, then time, then createdAt
        if (a.date !== b.date) {
          return b.date.localeCompare(a.date);
        }
        if (a.time && b.time && a.time !== b.time) {
          return b.time.localeCompare(a.time);
        }
        return b.createdAt - a.createdAt;
      });
  }, [transactions, categories, filter]);

  // Summary counts for filtered view
  const filteredIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const filteredExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  // Transaction Actions
  const handleSaveTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (editingTx) {
      // Update
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTx.id
            ? { ...t, ...txData }
            : t
        )
      );
      showToast('Catatan transaksi berhasil diperbarui.');
      setEditingTx(null);
    } else {
      // Create new
      const newTx: Transaction = {
        ...txData,
        id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(
        `${txData.type === 'expense' ? 'Pengeluaran' : 'Pemasukan'} berhasil dicatat!`
      );
    }
  };

  const handleUpdateAmount = (id: string, newAmount: number) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, amount: newAmount } : t))
    );
    showToast(`Jumlah nominal berhasil diubah menjadi ${formatRupiah(newAmount)}`);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaksi berhasil dihapus.');
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setPrefillTx(null);
    setIsTxModalOpen(true);
  };

  const handleOpenNewTransaction = () => {
    setEditingTx(null);
    setPrefillTx(null);
    setIsTxModalOpen(true);
  };

  const handleUseQuickTemplate = (tmpl: QuickTemplate) => {
    const today = getTodayDateString();
    const nowTime = getCurrentTimeString();

    const newTx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: tmpl.type,
      amount: tmpl.amount,
      categoryId: tmpl.categoryId,
      walletId: tmpl.walletId,
      date: today,
      time: nowTime,
      note: tmpl.note || tmpl.title,
      createdAt: Date.now(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Tercatat: ${tmpl.title}`);
  };

  const handleSaveTemplate = (title: string, txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTmpl: QuickTemplate = {
      id: `tmpl_${Date.now()}`,
      title,
      type: txData.type,
      amount: txData.amount,
      categoryId: txData.categoryId,
      walletId: txData.walletId,
      note: txData.note,
    };
    setTemplates((prev) => [...prev, newTmpl]);
    showToast(`Tombol cepat "${title}" ditambahkan.`);
  };

  const handleAddWallet = (walletData: Omit<Wallet, 'id'>) => {
    const newWallet: Wallet = {
      ...walletData,
      id: `wallet_${Date.now()}`,
    };
    setWallets((prev) => [...prev, newWallet]);
    showToast(`Dompet "${walletData.name}" berhasil ditambahkan.`);
  };

  const handleDeleteWallet = (walletId: string) => {
    setWallets((prev) => prev.filter((w) => w.id !== walletId));
    showToast('Dompet berhasil dihapus.');
  };

  const handleResetSampleData = () => {
    const sample = generateSampleTransactions();
    setTransactions(sample);
    saveTransactions(sample);
    showToast('Data contoh transaksi berhasil dimuat!');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-16">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTransaction={handleOpenNewTransaction}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenWalletModal={() => setActiveTab('wallets')}
        onExportCSV={() => exportToCSV(transactions, categories, wallets)}
        onExportJSON={exportBackupJSON}
        onResetSampleData={handleResetSampleData}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-5">
        {/* KPI / Summary Cards */}
        <SummaryCards
          totalBalance={totalBalance}
          totalIncome={filteredIncome}
          totalExpense={filteredExpense}
          todayExpense={todayExpense}
          budget={budget}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        />

        {/* Quick Templates Bar (Always handy for 1-click expense logging) */}
        <QuickTemplatesBar
          templates={templates}
          categories={categories}
          wallets={wallets}
          onUseTemplate={handleUseQuickTemplate}
          onOpenNewTransactionWithPrefill={(prefill) => {
            setPrefillTx(prefill);
            setEditingTx(null);
            setIsTxModalOpen(true);
          }}
        />

        {/* Tab 1: Daily Transactions List */}
        {activeTab === 'list' && (
          <div>
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              categories={categories}
              wallets={wallets}
              totalResultsCount={filteredTransactions.length}
            />

            <TransactionList
              transactions={filteredTransactions}
              categories={categories}
              wallets={wallets}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteTransaction}
              onOpenNewTransaction={handleOpenNewTransaction}
              onUpdateAmount={handleUpdateAmount}
            />
          </div>
        )}

        {/* Tab 2: Analytics & Reports */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            transactions={transactions}
            categories={categories}
            wallets={wallets}
          />
        )}

        {/* Tab 3: Wallets & Accounts */}
        {activeTab === 'wallets' && (
          <WalletView
            wallets={wallets}
            transactions={transactions}
            onAddWallet={handleAddWallet}
            onDeleteWallet={handleDeleteWallet}
          />
        )}
      </main>

      {/* Floating Action Button on Mobile */}
      <div className="fixed bottom-5 right-5 sm:hidden z-30">
        <button
          type="button"
          onClick={handleOpenNewTransaction}
          className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform"
          aria-label="Catat Transaksi"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTx(null);
          setPrefillTx(null);
        }}
        onSave={handleSaveTransaction}
        onSaveTemplate={handleSaveTemplate}
        editingTransaction={editingTx}
        categories={categories}
        wallets={wallets}
        initialPrefill={prefillTx}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        budget={budget}
        onSave={(newBudget) => {
          setBudget(newBudget);
          showToast('Pengaturan anggaran berhasil disimpan.');
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
