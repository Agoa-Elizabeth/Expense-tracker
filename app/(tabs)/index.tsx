import { AppHeader } from '@/components/app-header';
import { TransactionRow } from '@/components/transaction-row';
import { useTransactions } from '@/context/TransactionContext';
import {
  computeStreak,
  nextStreakMilestone,
  STREAK_MILESTONES,
} from '@/utils/insights';
import { getStreakMotivation } from '@/utils/motivation';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { transactions } = useTransactions();

  const streak = useMemo(
    () => computeStreak(transactions),
    [transactions]
  );

  const motivation = useMemo(
    () => getStreakMotivation(streak),
    [streak]
  );

  const milestone = nextStreakMilestone(streak.current);
  const isMilestone =
    streak.loggedToday &&
    STREAK_MILESTONES.includes(streak.current);

  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income - expenses;

  const formatAmount = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <AppHeader />

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>

          <Text
            style={[
              styles.balance,
              balance < 0 && styles.negativeBalance,
            ]}
          >
            {formatAmount(balance)}
          </Text>

          <View style={styles.balanceChange}>
            <Ionicons
              name={balance >= 0 ? 'trending-up' : 'trending-down'}
              size={16}
              color="#14532D"
            />

            <Text style={styles.changeText}>
              {transactions.length} transaction
              {transactions.length === 1 ? '' : 's'}
            </Text>
          </View>
        </View>

        {/* Income / Expense */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={[styles.iconContainer, styles.incomeIcon]}>
              <Ionicons
                name="arrow-down-outline"
                size={20}
                color="#16A34A"
              />
            </View>

            <Text style={styles.summaryLabel}>Income</Text>

            <Text style={styles.summaryAmount}>
              {formatAmount(income)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.iconContainer, styles.expenseIcon]}>
              <Ionicons
                name="arrow-up-outline"
                size={20}
                color="#DC2626"
              />
            </View>

            <Text style={styles.summaryLabel}>Expenses</Text>

            <Text style={styles.summaryAmount}>
              {formatAmount(expenses)}
            </Text>
          </View>
        </View>

        {/* Daily Streak */}
        <View
          style={[
            styles.streakCard,
            isMilestone && styles.streakCardMilestone,
          ]}
        >
          <View
            style={[
              styles.streakIcon,
              isMilestone && styles.streakIconMilestone,
            ]}
          >
            <Ionicons
              name="flame"
              size={18}
              color={streak.current > 0 ? '#EA580C' : '#9CA3AF'}
            />
          </View>

          <View style={styles.streakInfo}>
            <View style={styles.streakTitleRow}>
              <Text style={styles.streakTitle}>
                {streak.current > 0
                  ? `${streak.current}-day streak`
                  : 'Start a streak'}
              </Text>

              <Text style={styles.streakBest}>
                Best {streak.longest}
              </Text>
            </View>

            <Text style={styles.motivationText}>
              {motivation}
            </Text>

            {streak.current > 0 && milestone && (
              <View style={styles.streakProgressTrack}>
                <View
                  style={[
                    styles.streakProgressFill,
                    {
                      width: `${Math.min(
                        100,
                        Math.round((streak.current / milestone) * 100)
                      )}%` as const,
                    },
                  ]}
                />
              </View>
            )}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Recent Transactions
          </Text>

          {transactions.length > 0 && (
            <Pressable onPress={() => router.push('/transactions')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.transactionsCard}>
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="receipt-outline"
                  size={30}
                  color="#9CA3AF"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No transactions yet
              </Text>

              <Text style={styles.emptyText}>
                Tap the + button to add your first transaction.
              </Text>
            </View>
          ) : (
            transactions.slice(0, 5).map((transaction, index) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                isLast={index === Math.min(transactions.length, 5) - 1}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Transaction Button */}
      <Pressable
        style={styles.addButton}
        onPress={() => router.push('/modal')}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },

  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
    marginBottom: 20,
  },

  streakCardMilestone: {
    borderColor: '#FDBA74',
    backgroundColor: '#FFF7ED',
  },

  streakIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  streakIconMilestone: {
    backgroundColor: '#EA580C',
  },

  streakInfo: {
    flex: 1,
  },

  streakTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },

  streakTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  streakBest: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },

  streakProgressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F1F5F9',
    marginTop: 8,
    overflow: 'hidden',
  },

  streakProgressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EA580C',
  },

  motivationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    lineHeight: 16,
  },

  balanceCard: {
    backgroundColor: '#BBF7D0',
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
  },

  balanceLabel: {
    color: '#166534',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  balance: {
    color: '#14532D',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 20,
  },

  negativeBalance: {
    color: '#B91C1C',
  },

  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  changeText: {
    color: '#14532D',
    fontSize: 13,
    fontWeight: '600',
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  incomeIcon: {
    backgroundColor: '#DCFCE7',
  },

  expenseIcon: {
    backgroundColor: '#FEE2E2',
  },

  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 5,
  },

  summaryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
  },

  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },

  transactionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 35,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 19,
  },

  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});