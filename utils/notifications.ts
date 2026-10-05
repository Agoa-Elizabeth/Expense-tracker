import {
  Budget,
  SavingsGoal,
  Transaction,
} from '@/context/TransactionContext';

import { computeStreak, STREAK_MILESTONES } from './insights';
import { getStreakMotivation } from './motivation';

export type NotificationItem = {
  id: string;
  icon: string;
  iconColor: string;
  iconBackground: string;
  title: string;
  message: string;
  date: string;
  route: string;
};

const monthKey = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth()}`;
};

function latestTransactionDate(
  transactions: Transaction[],
  category: string,
  now: Date
): string {
  const currentMonth = monthKey(now);
  let latest: Date | null = null;

  for (const transaction of transactions) {
    if (transaction.category !== category) {
      continue;
    }

    const date = new Date(transaction.date);

    if (
      Number.isNaN(date.getTime()) ||
      monthKey(date) !== currentMonth
    ) {
      continue;
    }

    if (!latest || date > latest) {
      latest = date;
    }
  }

  return (latest ?? now).toISOString();
}

export function buildNotifications(
  transactions: Transaction[],
  budgets: Budget[],
  savingsGoals: SavingsGoal[]
): NotificationItem[] {
  const now = new Date();
  const items: NotificationItem[] = [];

  // -----------------------------
  // BUDGETS
  // -----------------------------

  for (const budget of budgets) {
    if (budget.amount <= 0) {
      continue;
    }

    const currentMonth = monthKey(now);

    let spent = 0;
    let latestDate: Date | null = null;

    for (const transaction of transactions) {
      if (
        transaction.type !== 'expense' ||
        transaction.category !== budget.category
      ) {
        continue;
      }

      const date = new Date(transaction.date);

      if (
        Number.isNaN(date.getTime()) ||
        monthKey(date) !== currentMonth
      ) {
        continue;
      }

      spent += transaction.amount;

      if (!latestDate || date > latestDate) {
        latestDate = date;
      }
    }

    if (spent === 0) {
      continue;
    }

    const date = (latestDate ?? now).toISOString();

    if (spent >= budget.amount) {
      items.push({
        id: `budget-exceeded-${budget.id}-${currentMonth}`,
        icon: 'alert-circle',
        iconColor: '#DC2626',
        iconBackground: '#FEE2E2',
        title: 'Budget exceeded',
        message: `You've spent UGX ${spent.toLocaleString()} of your UGX ${budget.amount.toLocaleString()} ${budget.category} budget this month.`,
        date,
        route: '/plans',
      });
    } else if (spent >= budget.amount * 0.8) {
      items.push({
        id: `budget-warning-${budget.id}-${currentMonth}`,
        icon: 'speedometer-outline',
        iconColor: '#D97706',
        iconBackground: '#FEF3C7',
        title: 'Close to budget limit',
        message: `You've used ${Math.round(
          (spent / budget.amount) * 100
        )}% of your ${budget.category} budget this month.`,
        date,
        route: '/plans',
      });
    }
  }

  // -----------------------------
  // SAVINGS GOALS
  // -----------------------------

  for (const goal of savingsGoals) {
    if (goal.targetAmount <= 0) {
      continue;
    }

    if (goal.savedAmount >= goal.targetAmount) {
      items.push({
        id: `goal-reached-${goal.id}`,
        icon: 'trophy',
        iconColor: '#16A34A',
        iconBackground: '#DCFCE7',
        title: 'Goal reached! 🎉',
        message: `You hit your ${goal.name} goal of UGX ${goal.targetAmount.toLocaleString()}.`,
        date: now.toISOString(),
        route: '/plans',
      });
    } else if (goal.savedAmount >= goal.targetAmount / 2) {
      items.push({
        id: `goal-halfway-${goal.id}`,
        icon: 'trending-up',
        iconColor: '#2563EB',
        iconBackground: '#EFF6FF',
        title: 'Halfway there!',
        message: `You're over halfway to your ${goal.name} goal. Keep going!`,
        date: now.toISOString(),
        route: '/plans',
      });
    }
  }

  // -----------------------------
  // STREAK
  // -----------------------------

  const streak = computeStreak(transactions);
  const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

  if (
    streak.loggedToday &&
    STREAK_MILESTONES.includes(streak.current)
  ) {
    items.push({
      id: `streak-milestone-${streak.current}`,
      icon: 'flame',
      iconColor: '#EA580C',
      iconBackground: '#FFEDD5',
      title: `${streak.current}-day streak! 🔥`,
      message: getStreakMotivation(streak, now),
      date: now.toISOString(),
      route: '/transactions',
    });
  } else if (streak.current > 0 && !streak.loggedToday) {
    items.push({
      id: `streak-risk-${todayKey}`,
      icon: 'flame-outline',
      iconColor: '#DC2626',
      iconBackground: '#FEE2E2',
      title: 'Streak at risk',
      message: getStreakMotivation(streak, now),
      date: now.toISOString(),
      route: '/modal',
    });
  }

  return items.sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / (60 * 1000));

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString();
}
