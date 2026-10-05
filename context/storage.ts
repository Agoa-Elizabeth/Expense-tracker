import AsyncStorage from '@react-native-async-storage/async-storage';

import { Budget, SavingsGoal, Transaction } from './TransactionContext';

export type PersistedState = {
  transactions: Transaction[];
  budgets: Budget[];
  generalSavings: number;
  savingsGoals: SavingsGoal[];
  seenNotificationIds: string[];
};

const STORAGE_KEY = '@expense-tracker/state';

export const emptyState: PersistedState = {
  transactions: [],
  budgets: [],
  generalSavings: 0,
  savingsGoals: [],
  seenNotificationIds: [],
};

export async function loadState(): Promise<PersistedState> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);

    if (!json) {
      return emptyState;
    }

    const parsed = JSON.parse(json);

    return {
      transactions: Array.isArray(parsed?.transactions)
        ? parsed.transactions
        : [],

      budgets: Array.isArray(parsed?.budgets)
        ? parsed.budgets
        : [],

      generalSavings:
        typeof parsed?.generalSavings === 'number'
          ? parsed.generalSavings
          : 0,

      savingsGoals: Array.isArray(parsed?.savingsGoals)
        ? parsed.savingsGoals
        : [],

      seenNotificationIds: Array.isArray(
        parsed?.seenNotificationIds
      )
        ? parsed.seenNotificationIds.filter(
            (id: unknown) => typeof id === 'string'
          )
        : [],
    };
  } catch {
    return emptyState;
  }
}

export async function saveState(
  state: PersistedState
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );
  } catch {
    // Storage write failed; keep app usable in-memory.
  }
}
