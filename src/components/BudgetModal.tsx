import React, { useState } from 'react';
import { X, Target, Check, Info } from 'lucide-react';
import { BudgetConfig } from '../types/finance';
import { formatRupiah, parseRupiahInput } from '../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: BudgetConfig;
  onSave: (budget: BudgetConfig) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  budget,
  onSave,
}) => {
  const [dailyLimitStr, setDailyLimitStr] = useState(budget.dailyLimit.toString());
  const [monthlyLimitStr, setMonthlyLimitStr] = useState(budget.monthlyLimit.toString());
  const [isEnabled, setIsEnabled] = useState(budget.isEnabled);

  if (!isOpen) return null;

  const currentDailyNum = parseRupiahInput(dailyLimitStr);
  const currentMonthlyNum = parseRupiahInput(monthlyLimitStr);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      dailyLimit: currentDailyNum > 0 ? currentDailyNum : 150000,
      monthlyLimit: currentMonthlyNum > 0 ? currentMonthlyNum : 4500000,
      isEnabled,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-bold text-stone-900">Atur Batas Anggaran</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <div className="text-xs font-semibold text-stone-900">
                Aktifkan Pengingat Anggaran
              </div>
              <div className="text-[11px] text-stone-500">
                Tampilkan peringatan saat belanja mendekati batas
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Batas Belanja Harian (Rp / Hari)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-stone-400 text-sm">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={new Intl.NumberFormat('id-ID').format(currentDailyNum)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setDailyLimitStr(raw);
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-lg font-bold text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] text-stone-600 font-medium">Pilihan cepat:</span>
              {[50000, 100000, 150000, 200000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDailyLimitStr(val.toString())}
                  className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 rounded text-[11px] font-mono cursor-pointer transition-colors"
                >
                  {val / 1000}rb
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Batas Belanja Bulanan (Rp / Bulan)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-stone-400 text-sm">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={new Intl.NumberFormat('id-ID').format(currentMonthlyNum)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setMonthlyLimitStr(raw);
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-lg font-bold text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-start gap-2 text-xs text-emerald-900">
            <Info className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Tips: Menetapkan batas harian realistis (misal Rp 100.000 - Rp 150.000) membantu menekan pengeluaran impulsif untuk jajan dan belanja harian.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
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
              <span>Simpan Anggaran</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
