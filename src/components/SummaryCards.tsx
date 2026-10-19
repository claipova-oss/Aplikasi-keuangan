import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Target, AlertTriangle } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { BudgetConfig } from '../types/finance';

interface SummaryCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  todayExpense: number;
  budget: BudgetConfig;
  onOpenBudgetModal: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalBalance,
  totalIncome,
  totalExpense,
  todayExpense,
  budget,
  onOpenBudgetModal,
}) => {
  const dailyLimit = budget.dailyLimit || 150000;
  const dailyRemaining = dailyLimit - todayExpense;
  const dailyPercentage = Math.min(Math.round((todayExpense / dailyLimit) * 100), 100);
  const isOverBudget = todayExpense > dailyLimit;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* Card 1: Saldo Bersih */}
      <div className="bg-white rounded-xl border border-stone-200 p-4.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-xs font-medium tracking-wide">Total Saldo Kas</span>
          <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
            <Wallet className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <div
            className={`text-2xl font-bold font-mono tracking-tight ${
              totalBalance >= 0 ? 'text-stone-900' : 'text-rose-600'
            }`}
          >
            {formatRupiah(totalBalance)}
          </div>
          <div className="mt-1 text-xs text-stone-600 flex items-center gap-1.5">
            <span>Kas bersih di seluruh dompet</span>
          </div>
        </div>
      </div>

      {/* Card 2: Total Pemasukan */}
      <div className="bg-white rounded-xl border border-stone-200 p-4.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-xs font-medium tracking-wide">Total Pemasukan</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold font-mono tracking-tight text-emerald-700">
            {formatRupiah(totalIncome)}
          </div>
          <div className="mt-1 text-xs text-stone-600">
            Uang masuk terfilter
          </div>
        </div>
      </div>

      {/* Card 3: Total Pengeluaran */}
      <div className="bg-white rounded-xl border border-stone-200 p-4.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-xs font-medium tracking-wide">Total Pengeluaran</span>
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold font-mono tracking-tight text-rose-700">
            {formatRupiah(totalExpense)}
          </div>
          <div className="mt-1 text-xs text-stone-600">
            Uang keluar terfilter
          </div>
        </div>
      </div>

      {/* Card 4: Anggaran Hari Ini */}
      <div
        className={`bg-white rounded-xl border p-4.5 shadow-xs flex flex-col justify-between transition-colors ${
          isOverBudget ? 'border-rose-300 bg-rose-50/20' : 'border-stone-200'
        }`}
      >
        <div className="flex items-center justify-between text-stone-500 mb-1.5">
          <span className="text-xs font-medium tracking-wide flex items-center gap-1.5">
            <span>Batas Belanja Hari Ini</span>
            {isOverBudget && (
              <span className="text-rose-600 flex items-center text-[11px] font-semibold">
                <AlertTriangle className="w-3 h-3 mr-0.5" /> Lewat
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={onOpenBudgetModal}
            className="w-7 h-7 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            title="Ubah Anggaran"
          >
            <Target className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span
              className={`text-xl font-bold font-mono tracking-tight ${
                isOverBudget ? 'text-rose-600' : 'text-stone-900'
              }`}
            >
              {formatRupiah(todayExpense)}
            </span>
            <span className="text-xs text-stone-600 font-mono">
              / {formatRupiah(dailyLimit)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverBudget
                  ? 'bg-rose-500'
                  : dailyPercentage > 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${dailyPercentage}%` }}
            />
          </div>

          <div className="mt-1.5 text-[11px] text-stone-600 flex justify-between">
            <span>
              {isOverBudget
                ? `Berlebih ${formatRupiah(Math.abs(dailyRemaining))}`
                : `Sisa jatah: ${formatRupiah(dailyRemaining)}`}
            </span>
            <span>{dailyPercentage}% terpakai</span>
          </div>
        </div>
      </div>
    </div>
  );
};
