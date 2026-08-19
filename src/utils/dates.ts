/**
 * Date formatting and reading time calculation utilities
 */

export function formatDate(date: Date | string | undefined): string {
  if (!date) return '2026-08-18';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '2026-08-18';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatChineseDate(date: Date | string | undefined): string {
  if (!date) return '2026年8月18日';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '2026年8月18日';

  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function estimateReadingTime(content: string): number {
  if (!content) return 3;
  // Average Chinese reading speed: ~350-400 chars/min
  const charCount = content.replace(/\s+/g, '').length;
  const minutes = Math.ceil(charCount / 350);
  return Math.max(2, Math.min(minutes, 30));
}
