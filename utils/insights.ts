import { Transaction } from '@/context/TransactionContext';

export type Streak = {
  current: number;
  longest: number;
  loggedToday: boolean;
};

export const STREAK_MILESTONES = [3, 7, 14, 30];

const DAY_MS = 24 * 60 * 60 * 1000;

const dayKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export function computeStreak(
  transactions: Transaction[]
): Streak {
  const days = new Set<string>();

  for (const transaction of transactions) {
    const date = new Date(transaction.date);

    if (!Number.isNaN(date.getTime())) {
      days.add(dayKey(date));
    }
  }

  if (days.size === 0) {
    return { current: 0, longest: 0, loggedToday: false };
  }

  const today = new Date();
  const todayKey = dayKey(today);
  const loggedToday = days.has(todayKey);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = dayKey(yesterday);

  let anchor = today;

  if (!loggedToday) {
    if (!days.has(yesterdayKey)) {
      let longest = 0;
      let run = 0;
      let previous: Date | null = null;

      for (const key of Array.from(days).sort()) {
        const date = new Date(`${key}T00:00:00`);

        if (previous) {
          const diff = Math.round(
            (date.getTime() - previous.getTime()) / DAY_MS
          );

          run = diff === 1 ? run + 1 : 1;
        } else {
          run = 1;
        }

        longest = Math.max(longest, run);
        previous = date;
      }

      return { current: 0, longest, loggedToday: false };
    }

    anchor = yesterday;
  }

  let current = 0;
  const cursor = new Date(anchor);

  while (days.has(dayKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  let longest = 0;
  let run = 0;
  let previous: Date | null = null;

  for (const key of Array.from(days).sort()) {
    const date = new Date(`${key}T00:00:00`);

    if (previous) {
      const diff = Math.round(
        (date.getTime() - previous.getTime()) / DAY_MS
      );

      run = diff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }

    longest = Math.max(longest, run);
    previous = date;
  }

  return {
    current,
    longest: Math.max(longest, current),
    loggedToday,
  };
}

export function nextStreakMilestone(
  current: number
): number | null {
  return (
    STREAK_MILESTONES.find((milestone) => milestone > current) ??
    null
  );
}
