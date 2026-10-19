import React, { useState } from 'react';
import { Zap, Plus, Check } from 'lucide-react';
import { QuickTemplate, Category, Wallet } from '../types/finance';
import { formatRupiah } from '../utils/formatters';

interface QuickTemplatesBarProps {
  templates: QuickTemplate[];
  categories: Category[];
  wallets: Wallet[];
  onUseTemplate: (template: QuickTemplate) => void;
  onOpenNewTransactionWithPrefill: (prefill: Partial<QuickTemplate>) => void;
}

export const QuickTemplatesBar: React.FC<QuickTemplatesBarProps> = ({
  templates,
  onUseTemplate,
}) => {
  const [lastUsedId, setLastUsedId] = useState<string | null>(null);

  const handleClick = (tmpl: QuickTemplate) => {
    onUseTemplate(tmpl);
    setLastUsedId(tmpl.id);
    setTimeout(() => {
      setLastUsedId(null);
    }, 1800);
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-xl p-3 mb-6 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Catat Cepat Harian (1-Klik)</span>
        </div>
        <span className="text-[11px] text-stone-600 hidden sm:inline">
          Klik untuk langsung mencatat pengeluaran rutin hari ini
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {templates.map((tmpl) => {
          const isJustUsed = lastUsedId === tmpl.id;

          return (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => handleClick(tmpl)}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                isJustUsed
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800 hover:border-stone-300'
              }`}
            >
              {isJustUsed ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-stone-400" />
              )}
              <span className="font-medium">{tmpl.title}</span>
              <span className="font-mono text-stone-500 text-[11px]">
                {formatRupiah(tmpl.amount)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
