import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Wallet as WalletIcon,
  FileText,
  BookmarkPlus,
  Check,
  Calculator,
} from 'lucide-react';
import {
  Transaction,
  TransactionType,
  Category,
  Wallet,
} from '../types/finance';
import {
  formatRupiah,
  parseRupiahInput,
  getTodayDateString,
  getCurrentTimeString,
} from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (txData: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onSaveTemplate?: (title: string, txData: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editingTransaction?: Transaction | null;
  categories: Category[];
  wallets: Wallet[];
  initialPrefill?: Partial<Transaction> | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onSaveTemplate,
  editingTransaction,
  categories,
  wallets,
  initialPrefill,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [walletId, setWalletId] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [time, setTime] = useState<string>(getCurrentTimeString());
  const [note, setNote] = useState<string>('');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const amountInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state when modal opens or editingTransaction changes
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmountStr(editingTransaction.amount.toString());
      setCategoryId(editingTransaction.categoryId);
      setWalletId(editingTransaction.walletId);
      setDate(editingTransaction.date);
      setTime(editingTransaction.time || getCurrentTimeString());
      setNote(editingTransaction.note || '');
      setSaveAsTemplate(false);
      setTemplateName('');
    } else if (initialPrefill) {
      setType(initialPrefill.type || 'expense');
      setAmountStr(initialPrefill.amount ? initialPrefill.amount.toString() : '');
      setCategoryId(initialPrefill.categoryId || '');
      setWalletId(initialPrefill.walletId || wallets[0]?.id || '');
      setDate(initialPrefill.date || getTodayDateString());
      setTime(initialPrefill.time || getCurrentTimeString());
      setNote(initialPrefill.note || '');
      setSaveAsTemplate(false);
      setTemplateName('');
    } else {
      setType('expense');
      setAmountStr('');
      const defaultCat = categories.find((c) => c.type === 'expense');
      setCategoryId(defaultCat ? defaultCat.id : categories[0]?.id || '');
      setWalletId(wallets[0]?.id || '');
      setDate(getTodayDateString());
      setTime(getCurrentTimeString());
      setNote('');
      setSaveAsTemplate(false);
      setTemplateName('');
    }
    setErrorMsg('');

    // Auto-focus and highlight amount input when modal opens
    if (isOpen) {
      setTimeout(() => {
        if (amountInputRef.current) {
          amountInputRef.current.focus();
          amountInputRef.current.select();
        }
      }, 50);
    }
  }, [editingTransaction, initialPrefill, isOpen, categories, wallets]);

  // Adjust category when transaction type toggles
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const validCats = categories.filter((c) => c.type === newType);
    if (!validCats.some((c) => c.id === categoryId)) {
      setCategoryId(validCats[0]?.id || '');
    }
  };

  const currentAmountNum = parseRupiahInput(amountStr);

  const addAmount = (addVal: number) => {
    const nextVal = currentAmountNum + addVal;
    setAmountStr(nextVal.toString());
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmountNum <= 0) {
      setErrorMsg('Mohon masukkan nominal yang valid (lebih dari 0).');
      return;
    }
    if (!categoryId) {
      setErrorMsg('Silakan pilih kategori transaksi.');
      return;
    }
    if (!walletId) {
      setErrorMsg('Silakan pilih dompet / sumber dana.');
      return;
    }

    const txData: Omit<Transaction, 'id' | 'createdAt'> = {
      type,
      amount: currentAmountNum,
      categoryId,
      walletId,
      date,
      time,
      note: note.trim(),
    };

    onSave(txData);

    if (saveAsTemplate && onSaveTemplate && templateName.trim()) {
      onSaveTemplate(templateName.trim(), txData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${editingTransaction ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                {editingTransaction ? 'Ubah Rincian & Jumlah Transaksi' : 'Catat Keuangan Harian'}
              </h2>
              {editingTransaction && (
                <p className="text-[11px] text-stone-500">
                  Ubah nominal jumlah uang, kategori, atau catatan
                </p>
              )}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Type Toggle: Pengeluaran vs Pemasukan */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              <span>Pengeluaran</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
              <span>Pemasukan</span>
            </button>
          </div>

          {/* Amount Input with focus and edit emphasis */}
          <div className="bg-stone-50/70 p-3.5 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-800">
                Jumlah Nominal (Rp)
              </label>
              {editingTransaction && (
                <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Ketik untuk ubah nominal
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-stone-400 text-sm">
                Rp
              </span>
              <input
                ref={amountInputRef}
                type="text"
                inputMode="numeric"
                value={amountStr ? new Intl.NumberFormat('id-ID').format(currentAmountNum) : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setAmountStr(raw);
                }}
                onFocus={(e) => e.target.select()}
                placeholder="0"
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl font-mono text-2xl font-bold text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
              />
            </div>

            {/* Quick add chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] text-stone-600 font-medium mr-1">Tambah:</span>
              {[5000, 10000, 20000, 50000, 100000, 500000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => addAmount(val)}
                  className="px-2 py-0.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded text-[11px] font-mono cursor-pointer transition-colors shadow-2xs"
                >
                  +{val >= 1000000 ? `${val / 1000000}jt` : `${val / 1000}rb`}
                </button>
              ))}
              {currentAmountNum > 0 && (
                <button
                  type="button"
                  onClick={() => setAmountStr('')}
                  className="px-2 py-0.5 text-stone-400 hover:text-stone-600 text-[11px] underline ml-auto cursor-pointer"
                >
                  Reset 0
                </button>
              )}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              Kategori
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 border border-stone-200 rounded-xl bg-stone-50/50">
              {filteredCategories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-stone-900 bg-white text-stone-900 shadow-xs font-semibold'
                        : 'border-transparent text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${cat.color}20`,
                        color: cat.color,
                      }}
                    >
                      <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5" color={cat.color} />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wallet / Source */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
              <WalletIcon className="w-3.5 h-3.5 text-stone-400" />
              <span>Dompet / Sumber Dana</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {wallets.map((w) => {
                const isSelected = walletId === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWalletId(w.id)}
                    className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50 font-semibold text-stone-900 shadow-xs'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-medium truncate">{w.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Tanggal</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Waktu</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>

          {/* Note / Description */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              <span>Catatan / Keterangan</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Makan siang rendang + es teh, Beli bensin motor..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Save as Template checkbox (only for new transactions) */}
          {!editingTransaction && onSaveTemplate && (
            <div className="pt-2 border-t border-stone-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600">
                <input
                  type="checkbox"
                  checked={saveAsTemplate}
                  onChange={(e) => setSaveAsTemplate(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="flex items-center gap-1">
                  <BookmarkPlus className="w-3.5 h-3.5 text-stone-400" />
                  Simpan sebagai tombol cepat (1-klik harian)
                </span>
              </label>
              {saveAsTemplate && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Nama tombol cepat (contoh: Nasi Goreng Siang)"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400"
                  />
                </div>
              )}
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{editingTransaction ? 'Simpan Perubahan Nominal' : 'Simpan Transaksi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
