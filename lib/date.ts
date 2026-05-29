const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Local calendar date as YYYY-MM-DD (device timezone). */
export function getAppLocalDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getLocalDateKeyFromParams(date: string): string | null {
  if (!DATE_KEY_RE.test(date)) return null;
  const [y, m, d] = date.split('-').map(Number);
  const parsed = new Date(y, m - 1, d);
  if (
    parsed.getFullYear() !== y ||
    parsed.getMonth() !== m - 1 ||
    parsed.getDate() !== d
  ) {
    return null;
  }
  return date;
}

export function compareLocalDateKeys(a: string, b: string): -1 | 0 | 1 {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export function isTodayLocalDate(dateKey: string): boolean {
  return compareLocalDateKeys(dateKey, getAppLocalDateKey()) === 0;
}

export function isPastLocalDate(dateKey: string): boolean {
  return compareLocalDateKeys(dateKey, getAppLocalDateKey()) < 0;
}

export function isFutureLocalDate(dateKey: string): boolean {
  return compareLocalDateKeys(dateKey, getAppLocalDateKey()) > 0;
}
