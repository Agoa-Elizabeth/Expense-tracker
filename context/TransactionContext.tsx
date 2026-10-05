import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  loadState,
  PersistedState,
  saveState,
} from './storage';

export type TransactionType = 'expense' | 'income';

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  paymentMethod: string;
  note: string;
  date: string;
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  icon: string;
};

type TransactionContextType = {
  hydrated: boolean;

  transactions: Transaction[];

  budgets: Budget[];

  generalSavings: number;

  savingsGoals: SavingsGoal[];

  seenNotificationIds: string[];

  addTransaction: (
    transaction: Omit<Transaction, 'id' | 'date'>
  ) => void;

  updateTransaction: (
    id: string,
    updates: Omit<Transaction, 'id' | 'date'>
  ) => void;

  deleteTransaction: (id: string) => void;

  addBudget: (
    budget: Omit<Budget, 'id'>
  ) => void;

  deleteBudget: (id: string) => void;

  addToGeneralSavings: (amount: number) => void;

  withdrawFromGeneralSavings: (amount: number) => void;

  addSavingsGoal: (
    goal: Omit<SavingsGoal, 'id' | 'savedAmount'>
  ) => void;

  addToSavingsGoal: (
    id: string,
    amount: number
  ) => void;

  deleteSavingsGoal: (id: string) => void;

  markNotificationsSeen: (ids: string[]) => void;
};

const TransactionContext =
  createContext<TransactionContextType | undefined>(
    undefined
  );

export function TransactionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    []
  );

  const [budgets, setBudgets] = useState<Budget[]>([]);

  const [generalSavings, setGeneralSavings] =
    useState<number>(0);

  const [savingsGoals, setSavingsGoals] = useState<
    SavingsGoal[]
  >([]);

  const [seenNotificationIds, setSeenNotificationIds] =
    useState<string[]>([]);

  const [hydrated, setHydrated] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    loadState().then((state) => {
      if (cancelled) return;

      setTransactions(state.transactions);
      setBudgets(state.budgets);
      setGeneralSavings(state.generalSavings);
      setSavingsGoals(state.savingsGoals);
      setSeenNotificationIds(state.seenNotificationIds);
      setHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(() => {
      const state: PersistedState = {
        transactions,
        budgets,
        generalSavings,
        savingsGoals,
        seenNotificationIds,
      };

      saveState(state);
    }, 300);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [hydrated, transactions, budgets, generalSavings, savingsGoals, seenNotificationIds]);

  // -----------------------------
  // TRANSACTIONS
  // -----------------------------

  const addTransaction = (
    transaction: Omit<Transaction, 'id' | 'date'>
  ) => {
    if (
      !Number.isFinite(transaction.amount) ||
      transaction.amount <= 0
    ) {
      return;
    }

    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    setTransactions((currentTransactions) => [
      newTransaction,
      ...currentTransactions,
    ]);
  };

  const updateTransaction = (
    id: string,
    updates: Omit<Transaction, 'id' | 'date'>
  ) => {
    if (!Number.isFinite(updates.amount) || updates.amount <= 0) {
      return;
    }

    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...updates }
          : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) => transaction.id !== id
      )
    );
  };

  // -----------------------------
  // BUDGETS
  // -----------------------------

  const addBudget = (
    budget: Omit<Budget, 'id'>
  ) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
    };

    setBudgets((currentBudgets) => [
      ...currentBudgets,
      newBudget,
    ]);
  };

  const deleteBudget = (id: string) => {
    setBudgets((currentBudgets) =>
      currentBudgets.filter(
        (budget) => budget.id !== id
      )
    );
  };

  // -----------------------------
  // GENERAL SAVINGS
  // -----------------------------

  const addToGeneralSavings = (amount: number) => {
    if (amount <= 0) return;

    setGeneralSavings(
      (currentSavings) => currentSavings + amount
    );
  };

  const withdrawFromGeneralSavings = (amount: number) => {
    if (amount <= 0) return;

    setGeneralSavings((currentSavings) =>
      Math.max(0, currentSavings - amount)
    );
  };

  // -----------------------------
  // SAVINGS GOALS
  // -----------------------------

  const addSavingsGoal = (
    goal: Omit<SavingsGoal, 'id' | 'savedAmount'>
  ) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: Date.now().toString(),
      savedAmount: 0,
    };

    setSavingsGoals((currentGoals) => [
      ...currentGoals,
      newGoal,
    ]);
  };

  const addToSavingsGoal = (
    id: string,
    amount: number
  ) => {
    if (amount <= 0) return;

    setSavingsGoals((currentGoals) =>
      currentGoals.map((goal) => {
        if (goal.id !== id) {
          return goal;
        }

        return {
          ...goal,
          savedAmount: Math.min(
            goal.targetAmount,
            goal.savedAmount + amount
          ),
        };
      })
    );
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals((currentGoals) =>
      currentGoals.filter(
        (goal) => goal.id !== id
      )
    );
  };

  // -----------------------------
  // NOTIFICATIONS
  // -----------------------------

  const markNotificationsSeen = (ids: string[]) => {
    setSeenNotificationIds((currentIds) => {
      const next = new Set(currentIds);

      for (const id of ids) {
        next.add(id);
      }

      const merged = Array.from(next);

      if (merged.length === currentIds.length) {
        return currentIds;
      }

      return merged;
    });
  };

  return (
    <TransactionContext.Provider
      value={{
        hydrated,

        transactions,

        budgets,

        generalSavings,

        savingsGoals,

        seenNotificationIds,

        addTransaction,

        updateTransaction,

        deleteTransaction,

        addBudget,

        deleteBudget,

        addToGeneralSavings,

        withdrawFromGeneralSavings,

        addSavingsGoal,

        addToSavingsGoal,

        deleteSavingsGoal,

        markNotificationsSeen,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error(
      'useTransactions must be used inside TransactionProvider'
    );
  }

  return context;
}