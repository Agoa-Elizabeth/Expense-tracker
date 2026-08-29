import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

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
  transactions: Transaction[];

  budgets: Budget[];

  generalSavings: number;

  savingsGoals: SavingsGoal[];

  addTransaction: (
    transaction: Omit<Transaction, 'id' | 'date'>
  ) => void;

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

  // -----------------------------
  // TRANSACTIONS
  // -----------------------------

  const addTransaction = (
    transaction: Omit<Transaction, 'id' | 'date'>
  ) => {
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

  return (
    <TransactionContext.Provider
      value={{
        transactions,

        budgets,

        generalSavings,

        savingsGoals,

        addTransaction,

        addBudget,

        deleteBudget,

        addToGeneralSavings,

        withdrawFromGeneralSavings,

        addSavingsGoal,

        addToSavingsGoal,

        deleteSavingsGoal,
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