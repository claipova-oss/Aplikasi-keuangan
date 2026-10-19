import React, { useState } from 'react';
import { Plus, Wallet as WalletIcon, CreditCard, Smartphone, Banknote, Trash2, Check } from 'lucide-react';
import { Wallet, Transaction, WalletType } from '../types/finance';
import { formatRupiah } from '../utils/formatters';

interface WalletViewProps {
  wallets: Wallet[];
  transactions: Transaction[];
  onAddWallet: (wallet: Omit<Wallet, 'id'>) => void;
  onDeleteWallet: (id: string) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  wallets,
  transactions,
  onAddWallet,
  onDeleteWallet,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<WalletType>('bank');
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate balance and transaction count per wallet
  const walletStats = wallets.map((w) => {
    const wTxs = transactions.filter((t) => t.walletId === w.id);
    const inc = wTxs
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const exp = wTxs
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = inc - exp;

    return {
      wallet: w,
      balance,
      income: inc,
      expense: exp,
      count: wTxs.length,
    };
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama dompet tidak boleh kosong.');
      return;
    }

    let iconName = 'Wallet';
    let color = '#2563eb';
    if (type === 'cash') {
      iconName = 'Banknote';
      color = '#10b981';
    } else if (type === 'ewallet') {
      iconName = 'Smartphone';
      color = '#8b5cf6';
    } else if (type === 'bank') {
      iconName = 'CreditCard';
      color = '#0284c7';
    }

    onAddWallet({
      name: name.trim(),
      type,
      iconName,
      color,
    });

    setName('');
    setShowAddModal(false);
    setErrorMsg('');
  };

  const getWalletIcon = (wType: WalletType) => {
    switch (wType) {
      case 'cash':
        return <Banknote className="w-5 h-5" />;
      case 'bank':
        return <CreditCard className="w-5 h-5" />;
      case 'ewallet':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <WalletIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <WalletIcon className="w-4 h-4 text-emerald-600" />
            <span>Manajemen Dompet & Rekening</span>
          </h2>
          <p className="text-xs text-stone-500">
            Kelola tempat penyimpanan uang Anda (Tunai di dompet, Rekening Bank, atau E-Wallet)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Dompet Baru</span>
        </button>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {walletStats.map(({ wallet, balance, income, expense, count }) => (
          <div
            key={wallet.id}
            className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${wallet.color}15`,
                    color: wallet.color,
                  }}
                >
                  {getWalletIcon(wallet.type)}
                </div>
                {wallets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Hapus dompet "${wallet.name}"? Catatan transaksi yang menggunakannya tetap tersimpan.`
                        )
                      ) {
                        onDeleteWallet(wallet.id);
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Dompet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <h3 className="font-bold text-stone-900 text-sm">{wallet.name}</h3>
              <div className="text-[11px] text-stone-500 capitalize">
                Tipe: {wallet.type === 'cash' ? 'Uang Tunai' : wallet.type === 'bank' ? 'Rekening Bank' : wallet.type === 'ewallet' ? 'Dompet Digital' : 'Lainnya'}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100">
              <div className="text-[11px] text-stone-600 font-medium">Saldo Dompet</div>
              <div
                className={`text-lg font-bold font-mono ${
                  balance >= 0 ? 'text-stone-900' : 'text-rose-600'
                }`}
              >
                {formatRupiah(balance)}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-stone-100 text-[11px] font-mono">
                <div>
                  <span className="text-stone-600 block text-[10px]">Masuk</span>
                  <span className="text-emerald-700 font-medium">+{formatRupiah(income)}</span>
                </div>
                <div>
                  <span className="text-stone-600 block text-[10px]">Keluar</span>
                  <span className="text-rose-700 font-medium">-{formatRupiah(expense)}</span>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-stone-600">
                {count} catatan transaksi tercatat
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Wallet */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Tambah Dompet / Rekening</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              {errorMsg && (
                <div className="p-2 text-xs bg-rose-50 text-rose-700 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nama Dompet / Rekening
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: BCA Tabungan, GoPay, Dompet Saku"
                  autoFocus
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Jenis Dompet
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('bank')}
                    className={`p-2 rounded-lg border text-center text-xs transition-colors cursor-pointer ${
                      type === 'bank'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Bank
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('ewallet')}
                    className={`p-2 rounded-lg border text-center text-xs transition-colors cursor-pointer ${
                      type === 'ewallet'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-semibold'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    E-Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('cash')}
                    className={`p-2 rounded-lg border text-center text-xs transition-colors cursor-pointer ${
                      type === 'cash'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Tunai
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
