import React, { useState, useEffect } from 'react';
import { X, Check, Calculator, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Transaction, Category } from '../types/finance';
import { formatRupiah, parseRupiahInput } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface QuickAmountModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  category?: Category;
  onSaveAmount: (id: string, newAmount: number) => void;
}

export const QuickAmountModal: React.FC<QuickAmountModalProps> = ({
  isOpen,
  onClose,
  transaction,
  category,
  onSaveAmount,
}) => {
  const [amountStr, setAmountStr] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (transaction) {
      setAmountStr(transaction.amount.toString());
      setErrorMsg('');
    }
  }, [transaction, isOpen]);

  if (!isOpen || !transaction) return null;

  const currentAmountNum = parseRupiahInput(amountStr);
  const isExpense = transaction.type === 'expense';

  const addAmount = (val: number) => {
    const nextVal = Math.max(0, currentAmountNum + val);
    setAmountStr(nextVal.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmountNum <= 0) {
      setErrorMsg('Nominal pengeluaran harus lebih besar dari 0.');
      return;
    }
    onSaveAmount(transaction.id, currentAmountNum);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-sm shadow-xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isExpense ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Ubah Jumlah {isExpense ? 'Pengeluaran' : 'Pemasukan'}
              </h2>
              <p className="text-[11px] text-stone-500">
                Perbarui nominal transaksi dengan cepat
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Target transaction brief */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center gap-3">
            {category && (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                }}
              >
                <CategoryIcon name={category.iconName} className="w-4 h-4" color={category.color} />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs font-semibold text-stone-900 truncate">
                {transaction.note || category?.name || 'Transaksi'}
              </div>
              <div className="text-[11px] text-stone-500 flex items-center gap-1">
                <span>{transaction.date}</span>
                <span>·</span>
                <span className="font-mono">
                  Sebelumnya: {formatRupiah(transaction.amount)}
                </span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 text-xs bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Amount input */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              Nominal Baru (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-stone-400 text-sm">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                value={amountStr ? new Intl.NumberFormat('id-ID').format(currentAmountNum) : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setAmountStr(raw);
                }}
                onFocus={(e) => e.target.select()}
                placeholder="0"
                className={`w-full pl-11 pr-4 py-2.5 bg-stone-50 border rounded-xl font-mono text-2xl font-bold focus:outline-none focus:bg-white transition-colors ${
                  isExpense
                    ? 'border-rose-200 text-rose-700 focus:border-rose-500'
                    : 'border-emerald-200 text-emerald-700 focus:border-emerald-500'
                }`}
              />
            </div>

            {/* Quick adjustment buttons */}
            <div className="mt-2.5">
              <div className="text-[11px] text-stone-500 mb-1 font-medium">Penyesuaian cepat:</div>
              <div className="flex flex-wrap gap-1.5">
                {[5000, 10000, 20000, 50000, 100000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => addAmount(val)}
                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 rounded-md text-[11px] font-mono cursor-pointer transition-colors"
                  >
                    +{val >= 1000000 ? `${val / 1000000}jt` : `${val / 1000}rb`}
                  </button>
                ))}
                {[-10000, -5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => addAmount(val)}
                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 rounded-md text-[11px] font-mono cursor-pointer transition-colors"
                  >
                    {val / 1000}rb
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmountStr('')}
                  className="px-2 py-1 text-stone-400 hover:text-stone-600 text-[11px] ml-auto underline cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Difference notice */}
          {currentAmountNum > 0 && currentAmountNum !== transaction.amount && (
            <div className="text-xs p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-600 flex items-center justify-between font-mono">
              <span>Perubahan:</span>
              <span className={currentAmountNum > transaction.amount ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                {currentAmountNum > transaction.amount ? '+' : ''}
                {formatRupiah(currentAmountNum - transaction.amount)}
              </span>
            </div>
          )}

          {/* Footer actions */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Simpan Jumlah Baru</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
