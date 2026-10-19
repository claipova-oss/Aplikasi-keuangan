import React from 'react';
import { Search, X, Calendar, Filter } from 'lucide-react';
import { FilterState, Category, Wallet, PeriodFilter } from '../types/finance';

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: Category[];
  wallets: Wallet[];
  totalResultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  categories,
  wallets,
  totalResultsCount,
}) => {
  const handlePeriodChange = (period: PeriodFilter) => {
    setFilter((prev) => ({ ...prev, period }));
  };

  const handleTypeChange = (type: 'all' | 'expense' | 'income') => {
    setFilter((prev) => ({ ...prev, type }));
  };

  const handleResetFilters = () => {
    setFilter({
      period: 'all',
      type: 'all',
      categoryId: 'all',
      walletId: 'all',
      searchQuery: '',
      startDate: undefined,
      endDate: undefined,
    });
  };

  const hasActiveFilters =
    filter.period !== 'all' ||
    filter.type !== 'all' ||
    filter.categoryId !== 'all' ||
    filter.walletId !== 'all' ||
    filter.searchQuery.trim() !== '';

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-3.5 mb-5 shadow-xs space-y-3">
      {/* Top row: Search input + Period filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            placeholder="Cari transaksi (contoh: makan siang, bensin, gaji)..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 focus:bg-white transition-colors"
          />
          {filter.searchQuery && (
            <button
              type="button"
              onClick={() => setFilter((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs font-medium overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => handlePeriodChange('all')}
            className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
              filter.period === 'all'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semua Waktu
          </button>
          <button
            type="button"
            onClick={() => handlePeriodChange('today')}
            className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
              filter.period === 'today'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Hari Ini
          </button>
          <button
            type="button"
            onClick={() => handlePeriodChange('this_week')}
            className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
              filter.period === 'this_week'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Minggu Ini
          </button>
          <button
            type="button"
            onClick={() => handlePeriodChange('this_month')}
            className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
              filter.period === 'this_month'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Bulan Ini
          </button>
          <button
            type="button"
            onClick={() => handlePeriodChange('custom')}
            className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1 ${
              filter.period === 'custom'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Kustom</span>
          </button>
        </div>
      </div>

      {/* Custom Date Pickers when 'custom' is active */}
      {filter.period === 'custom' && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
          <span>Dari:</span>
          <input
            type="date"
            value={filter.startDate || ''}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="px-2 py-1 bg-white border border-stone-300 rounded text-stone-800 text-xs focus:outline-none"
          />
          <span>Sampai:</span>
          <input
            type="date"
            value={filter.endDate || ''}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="px-2 py-1 bg-white border border-stone-300 rounded text-stone-800 text-xs focus:outline-none"
          />
        </div>
      )}

      {/* Bottom row: Type selector (Semua, Pengeluaran, Pemasukan), Category & Wallet dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-stone-100">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type segmented */}
          <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => handleTypeChange('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filter.type === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua Jenis
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filter.type === 'expense'
                  ? 'bg-rose-50 text-rose-700 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filter.type === 'income'
                  ? 'bg-emerald-50 text-emerald-700 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pemasukan
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={filter.categoryId}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, categoryId: e.target.value }))
            }
            className="px-2.5 py-1 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:border-stone-400 cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {categories
              .filter((c) => filter.type === 'all' || c.type === filter.type)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type === 'expense' ? 'Keluar' : 'Masuk'})
                </option>
              ))}
          </select>

          {/* Wallet Dropdown */}
          <select
            value={filter.walletId}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, walletId: e.target.value }))
            }
            className="px-2.5 py-1 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:border-stone-400 cursor-pointer"
          >
            <option value="all">Semua Dompet / Rekening</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status & Clear filters */}
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <span>Ditemukan: <strong className="text-stone-900 font-mono">{totalResultsCount}</strong> transaksi</span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <Filter className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
