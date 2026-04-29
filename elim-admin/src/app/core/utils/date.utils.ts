import {
  DAYS_LONG, DAYS_SHORT, MONTHS_LONG, MONTHS_LONG_LOWER,
  MONTHS_SHORT, MONTHS_SHORT_UPPER, MS_PER_DAY,
} from '../constants';

/** Stateless date helpers. `today` is passed in to avoid coupling to clock state. */
export function formatDate(date: Date): string {
  return `${DAYS_LONG[date.getDay()]}, ${date.getDate()} ${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateShort(date: Date): string {
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatBirthDate(date: Date): string {
  return `${date.getDate()} ${MONTHS_LONG_LOWER[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatJoinedDate(date: Date): string {
  return `${MONTHS_LONG_LOWER[date.getMonth()]} ${date.getFullYear()}`;
}

export function getMonthShort(date: Date): string {
  return MONTHS_SHORT_UPPER[date.getMonth()];
}

export function getWeekdayShort(date: Date): string {
  return DAYS_SHORT[date.getDay()];
}

export function daysBetween(target: Date, ref: Date): number {
  return Math.ceil((target.getTime() - ref.getTime()) / MS_PER_DAY);
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export function getAge(birthDate: Date, ref: Date): number {
  return Math.floor((ref.getTime() - birthDate.getTime()) / (MS_PER_DAY * 365.25));
}

export function startOfDay(d = new Date()): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}
