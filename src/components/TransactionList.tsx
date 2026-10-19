import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  Plus,
  Calculator,
  Pencil,
} from 'lucide-react';
import { Transaction, Category, Wallet } from '../types/finance';
import { formatRupiah, getRelativeDayLabel } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { QuickAmountModal } from './QuickAmountModal';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  wallets: Wallet[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onOpenNewTransaction: () => void;
  onUpdateAmount: (id: string, newAmount: number) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  wallets,
  onEdit,
  onDelete,
  onOpenNewTransaction,
  onUpdateAmount,
}) => {
  const [quickAmountTx, setQuickAmountTx] = useState<Transaction | null>(null);

  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]));
  const walletMap = new Map<string, Wallet>(wallets.map((w) => [w.id, w]));

  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-3.5">
          <Receipt className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-stone-900 mb-1">
          Belum ada catatan transaksi
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mb-5 leading-relaxed">
          Mulai catat pengeluaran dan pemasukan harian Anda agar keuangan lebih teratur dan terkontrol.
        </p>
        <button
          type="button"
          onClick={onOpenNewTransaction}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Catatan Transaksi</span>
        </button>
      </div>
    );
  }

  // Group transactions by date
  const groupedByDate: Record<string, Transaction[]> = {};
  transactions.forEach((tx) => {
    if (!groupedByDate[tx.date]) {
      groupedByDate[tx.date] = [];
    }
    groupedByDate[tx.date].push(tx);
  });

  // Sort dates descending
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      {sortedDates.map((dateStr) => {
        const dayTxs = groupedByDate[dateStr];
        // Calculate daily totals
        const dayExpense = dayTxs
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        const dayIncome = dayTxs
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        return (
          <div
            key={dateStr}
            className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs"
          >
            {/* Day Header with subtotal */}
            <div className="px-4 py-2.5 bg-stone-50/90 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-900">
                  {getRelativeDayLabel(dateStr)}
                </span>
                <span className="text-[11px] text-stone-600">· {dayTxs.length} transaksi</span>
              </div>

              {/* Day Subtotal Summary */}
              <div className="flex items-center gap-3 text-xs font-mono">
                {dayIncome > 0 && (
                  <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                    <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                    +{formatRupiah(dayIncome)}
                  </span>
                )}
                {dayExpense > 0 && (
                  <span className="text-rose-700 font-medium flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    -{formatRupiah(dayExpense)}
                  </span>
                )}
              </div>
            </div>

            {/* Day Transactions List */}
            <div className="divide-y divide-stone-100">
              {dayTxs.map((tx) => {
                const category = categoryMap.get(tx.categoryId) || {
                  id: 'unknown',
                  name: 'Lain-lain',
                  iconName: 'Package',
                  color: '#64748b',
                  type: tx.type,
                };
                const wallet = walletMap.get(tx.walletId) || {
                  id: 'unknown',
                  name: 'Dompet',
                  type: 'other' as const,
                  iconName: 'Wallet',
                  color: '#64748b',
                };
                const isExpense = tx.type === 'expense';

                return (
                  <div
                    key={tx.id}
                    className="p-3 sm:px-4 hover:bg-stone-50/70 transition-colors flex items-center justify-between gap-3 group"
                  >
                    {/* Left: Category Icon & Details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: `${category.color}15`,
                          color: category.color,
                        }}
                      >
                        <CategoryIcon
                          name={category.iconName}
                          className="w-4 h-4"
                          color={category.color}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                          {tx.note || category.name}
                        </div>
                        {/* Quiet metadata with typographic separator */}
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-600 truncate mt-0.5">
                          <span>{category.name}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-stone-600">{wallet.name}</span>
                          {tx.time && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{tx.time}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount (Directly clickable to edit) & Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      {/* Clickable Amount with subtle edit hint */}
                      <button
                        type="button"
                        onClick={() => setQuickAmountTx(tx)}
                        title="Klik untuk cepat ubah jumlah nominal"
                        className="text-right p-1 -m-1 rounded-lg hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-all cursor-pointer group/amount flex items-center gap-1.5"
                      >
                        <div
                          className={`text-xs sm:text-sm font-bold font-mono tracking-tight ${
                            isExpense ? 'text-rose-700' : 'text-emerald-700'
                          }`}
                        >
                          {isExpense ? '-' : '+'}
                          {formatRupiah(tx.amount)}
                        </div>
                        <Pencil className="w-3 h-3 text-stone-400 opacity-60 group-hover/amount:opacity-100 group-hover/amount:text-stone-700 transition-opacity" />
                      </button>

                      {/* Action buttons */}
                      <div className="flex items-center gap-0.5">
                        {/* Quick Edit Amount Button */}
                        <button
                          type="button"
                          onClick={() => setQuickAmountTx(tx)}
                          className="p-1.5 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                          title="Ubah Jumlah Nominal"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                        </button>

                        {/* Full Edit Button */}
                        <button
                          type="button"
                          onClick={() => onEdit(tx)}
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
                          title="Ubah Lengkap (Kategori, Tanggal, Catatan)"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Hapus transaksi ini?')) {
                              onDelete(tx.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Quick Amount Edit Dialog */}
      {quickAmountTx && (
        <QuickAmountModal
          isOpen={Boolean(quickAmountTx)}
          onClose={() => setQuickAmountTx(null)}
          transaction={quickAmountTx}
          category={categoryMap.get(quickAmountTx.categoryId)}
          onSaveAmount={onUpdateAmount}
        />
      )}
    </div>
  );
};
