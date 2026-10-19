import React, { useState } from 'react';
import {
  Plus,
  Download,
  Sliders,
  Wallet,
  RotateCcw,
  BarChart3,
  ListFilter,
  Check,
  FileSpreadsheet,
} from 'lucide-react';
import { formatDateIndonesian, getTodayDateString } from '../utils/formatters';

interface HeaderProps {
  activeTab: 'list' | 'analytics' | 'wallets';
  setActiveTab: (tab: 'list' | 'analytics' | 'wallets') => void;
  onOpenNewTransaction: () => void;
  onOpenBudgetModal: () => void;
  onOpenWalletModal: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onResetSampleData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewTransaction,
  onOpenBudgetModal,
  onOpenWalletModal,
  onExportCSV,
  onExportJSON,
  onResetSampleData,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [sampleLoadedNotice, setSampleLoadedNotice] = useState(false);
  const todayStr = getTodayDateString();

  const handleReset = () => {
    if (window.confirm('Muat ulang data contoh transaksi? (Catatan Anda saat ini akan ditimpa dengan data percontohan)')) {
      onResetSampleData();
      setSampleLoadedNotice(true);
      setTimeout(() => setSampleLoadedNotice(false), 3000);
    }
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Date */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                  <span className="font-extrabold text-base tracking-tighter">Rp</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-stone-900 leading-tight">
                    BukuKas Harian
                  </h1>
                  <p className="text-xs text-stone-500 font-medium">
                    {formatDateIndonesian(todayStr, true)}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile New Transaction Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={onOpenNewTransaction}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Catat</span>
              </button>
            </div>
          </div>

          {/* Controls & Nav */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 pt-1 md:pt-0">
            {/* View Tabs */}
            <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs font-medium border border-stone-200/60">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'list'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Catatan</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Laporan</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('wallets')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'wallets'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Dompet</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5 relative">
              <button
                type="button"
                onClick={onOpenBudgetModal}
                title="Atur Batas Anggaran Belanja"
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors text-xs flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-stone-500" />
                <span className="hidden sm:inline font-medium">Anggaran</span>
              </button>

              {/* Export menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Unduh / Cadangkan Data"
                >
                  <Download className="w-4 h-4 text-stone-500" />
                  <span className="hidden sm:inline font-medium">Ekspor</span>
                </button>

                {showExportMenu && (
                  <div
                    className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50 text-xs text-stone-700 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setShowExportMenu(false)}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onExportCSV();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-stone-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>Unduh Excel / CSV</div>
                        <div className="text-[10px] text-stone-600">Bisa dibuka di Excel / Sheets</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onExportJSON();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-stone-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                      <div>
                        <div>Cadangkan File (JSON)</div>
                        <div className="text-[10px] text-stone-600">Simpan backup transaksi</div>
                      </div>
                    </button>
                    <div className="border-t border-stone-100 my-1"></div>
                    <button
                      type="button"
                      onClick={() => {
                        handleReset();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-amber-50 text-stone-600 hover:text-amber-800 flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                      <span>Muat Data Contoh Demo</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop Catat Transaksi */}
              <button
                type="button"
                onClick={onOpenNewTransaction}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Catat Transaksi</span>
              </button>
            </div>
          </div>
        </div>

        {sampleLoadedNotice && (
          <div className="mt-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Data contoh transaksi harian berhasil dimuat ulang!</span>
          </div>
        )}
      </div>
    </header>
  );
};
