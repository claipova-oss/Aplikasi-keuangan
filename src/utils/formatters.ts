/**
 * Indonesian Rupiah and Date formatting utilities
 */

export function formatRupiah(amount: number): string {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const formatted = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(absVal);
  return `${isNegative ? '-' : ''}Rp ${formatted}`;
}

export function parseRupiahInput(value: string): number {
  // Remove anything that's not a digit
  const clean = value.replace(/[^0-9]/g, '');
  if (!clean) return 0;
  const num = parseInt(clean, 10);
  return isNaN(num) ? 0 : num;
}

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const MONTH_SHORT_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
];

const DAY_NAMES_ID = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentTimeString(): string {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDateIndonesian(dateStr: string, includeDayName = true): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const dateObj = new Date(year, month, day);
  const dayName = DAY_NAMES_ID[dateObj.getDay()];
  const monthName = MONTH_NAMES_ID[month] || '';

  if (includeDayName) {
    return `${dayName}, ${day} ${monthName} ${year}`;
  }
  return `${day} ${monthName} ${year}`;
}

export function formatShortDateIndonesian(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  return `${day} ${MONTH_SHORT_ID[month]} ${year}`;
}

export function getRelativeDayLabel(dateStr: string): string {
  const today = getTodayDateString();
  if (dateStr === today) {
    return 'Hari Ini';
  }

  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yesterdayYear = d.getFullYear();
  const yesterdayMonth = String(d.getMonth() + 1).padStart(2, '0');
  const yesterdayDay = String(d.getDate()).padStart(2, '0');
  const yesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;

  if (dateStr === yesterday) {
    return 'Kemarin';
  }

  return formatDateIndonesian(dateStr, true);
}
