import { Streak, STREAK_MILESTONES } from './insights';

const startMessages = [
  'Just log one thing today.',
  'Small steps, big wins.',
  'Start where you are.',
  'Two minutes is enough.',
  'One log is a win today.',
  'Begin with the last spend.',
  'You only need day one.',
  'Open the app, add one.',
  'Tiny habit, huge payoff.',
  'Start smaller than you think.',
  'One entry beats no entry.',
  'Your streak starts now.',
];

const activeMessages = [
  'Day {days}. Keep going.',
  'Showing up counts.',
  'Momentum is up.',
  'Steady wins. Keep it.',
  'One more day in the books.',
  'That habit is forming.',
  'Day {days}, still strong.',
  'You are building something.',
  'Consistency is the win.',
  'Another day, same discipline.',
  'Kept it alive. Proud of you.',
  'The chain holds.',
];

const riskMessages = [
  'Do not break the chain.',
  '{days} days on the line.',
  'Two minutes. That is all.',
  'Log one thing to keep it.',
  'Your streak needs you today.',
  'Close the gap. One entry.',
  'Do not start from zero.',
  'Quick log, streak saved.',
  'Almost back on track.',
  'One spend. That is it.',
  'Save it before it dies.',
  'Today is easy to keep.',
];

const milestoneMessages = [
  '{days} days. Nice one.',
  'That is a real habit now.',
  'New record territory.',
  'Habit locked in.',
  '{days} days of showing up.',
  'Worth celebrating.',
  'That is how streaks are built.',
  'You did that. Repeatedly.',
  '{days} days. Keep the rhythm.',
  'Strong work.',
  'Momentum is real now.',
  'Level up.',
];

const dayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();

  return Math.floor(diff / (24 * 60 * 60 * 1000));
};

const fill = (template: string, days: number): string => {
  return template.replace('{days}', `${days}`);
};

export function getStreakMotivation(
  streak: Streak,
  now: Date = new Date()
): string {
  const index = dayOfYear(now);

  if (streak.current === 0) {
    return startMessages[index % startMessages.length];
  }

  if (streak.loggedToday && STREAK_MILESTONES.includes(streak.current)) {
    return fill(
      milestoneMessages[index % milestoneMessages.length],
      streak.current
    );
  }

  if (!streak.loggedToday) {
    return fill(
      riskMessages[index % riskMessages.length],
      streak.current
    );
  }

  return fill(
    activeMessages[index % activeMessages.length],
    streak.current
  );
}
