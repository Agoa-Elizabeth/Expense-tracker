import { useTransactions } from '@/context/TransactionContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type MonthFilter = 'thisMonth' | 'lastMonth';

const categoryIcons: Record<string, any> = {
  Food: 'restaurant-outline',
  Transport: 'car-outline',
  Bills: 'receipt-outline',
  Shopping: 'bag-outline',
  Education: 'school-outline',
  Health: 'medkit-outline',
  Salary: 'briefcase-outline',
  Freelance: 'laptop-outline',
  Business: 'storefront-outline',
  Gift: 'gift-outline',
  Investment: 'trending-up-outline',
  Other: 'ellipsis-horizontal',
};

export default function AnalyticsScreen() {
  const { transactions } = useTransactions();

  const [monthFilter, setMonthFilter] =
    useState<MonthFilter>('thisMonth');

  const selectedMonth = useMemo(() => {
    const now = new Date();

    if (monthFilter === 'thisMonth') {
      return {
        month: now.getMonth(),
        year: now.getFullYear(),
      };
    }

    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    return {
      month: lastMonth.getMonth(),
      year: lastMonth.getFullYear(),
    };
  }, [monthFilter]);

  const monthTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const date = new Date(transaction.date);

      return (
        date.getMonth() === selectedMonth.month &&
        date.getFullYear() === selectedMonth.year
      );
    });
  }, [transactions, selectedMonth]);

  const income = useMemo(() => {
    return monthTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [monthTransactions]);

  const expenses = useMemo(() => {
    return monthTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [monthTransactions]);

  const balance = income - expenses;

  const spendingByCategory = useMemo(() => {
    const categoryTotals: Record<string, number> = {};

    monthTransactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        categoryTotals[transaction.category] =
          (categoryTotals[transaction.category] || 0) +
          transaction.amount;
      });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage:
          expenses > 0 ? (amount / expenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthTransactions, expenses]);

  const formatAmount = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  const monthName = new Date(
    selectedMonth.year,
    selectedMonth.month,
    1
  ).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const averageExpense =
    monthTransactions.filter(
      (transaction) => transaction.type === 'expense'
    ).length > 0
      ? expenses /
        monthTransactions.filter(
          (transaction) => transaction.type === 'expense'
        ).length
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Analytics</Text>
            <Text style={styles.subtitle}>
              Understand where your money goes
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="stats-chart"
              size={22}
              color="#2563EB"
            />
          </View>
        </View>

        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <Pressable
            style={[
              styles.monthButton,
              monthFilter === 'thisMonth' &&
                styles.activeMonthButton,
            ]}
            onPress={() => setMonthFilter('thisMonth')}
          >
            <Text
              style={[
                styles.monthButtonText,
                monthFilter === 'thisMonth' &&
                  styles.activeMonthText,
              ]}
            >
              This Month
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.monthButton,
              monthFilter === 'lastMonth' &&
                styles.activeMonthButton,
            ]}
            onPress={() => setMonthFilter('lastMonth')}
          >
            <Text
              style={[
                styles.monthButtonText,
                monthFilter === 'lastMonth' &&
                  styles.activeMonthText,
              ]}
            >
              Last Month
            </Text>
          </Pressable>
        </View>

        {/* Current Month */}
        <Text style={styles.periodTitle}>{monthName}</Text>

        {/* Overview Cards */}
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <View
              style={[
                styles.overviewIcon,
                styles.incomeIcon,
              ]}
            >
              <Ionicons
                name="arrow-down-outline"
                size={20}
                color="#16A34A"
              />
            </View>

            <Text style={styles.overviewLabel}>Income</Text>

            <Text style={styles.incomeAmount}>
              {formatAmount(income)}
            </Text>
          </View>

          <View style={styles.overviewCard}>
            <View
              style={[
                styles.overviewIcon,
                styles.expenseIcon,
              ]}
            >
              <Ionicons
                name="arrow-up-outline"
                size={20}
                color="#DC2626"
              />
            </View>

            <Text style={styles.overviewLabel}>Expenses</Text>

            <Text style={styles.expenseAmount}>
              {formatAmount(expenses)}
            </Text>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View>
            <Text style={styles.balanceLabel}>
              Net Balance
            </Text>

            <Text style={styles.balanceAmount}>
              {formatAmount(balance)}
            </Text>
          </View>

          <View style={styles.balanceIcon}>
            <Ionicons
              name={
                balance >= 0
                  ? 'trending-up-outline'
                  : 'trending-down-outline'
              }
              size={26}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* Spending Breakdown */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Spending Breakdown
            </Text>

            <Text style={styles.sectionSubtitle}>
              Where you spent your money
            </Text>
          </View>
        </View>

        <View style={styles.breakdownCard}>
          {spendingByCategory.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="pie-chart-outline"
                  size={28}
                  color="#9CA3AF"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No spending yet
              </Text>

              <Text style={styles.emptyText}>
                Add some expenses to see your spending
                breakdown.
              </Text>
            </View>
          ) : (
            spendingByCategory.map((item) => (
              <View
                key={item.category}
                style={styles.categoryRow}
              >
                <View style={styles.categoryTop}>
                  <View style={styles.categoryLeft}>
                    <View style={styles.categoryIcon}>
                      <Ionicons
                        name={
                          categoryIcons[item.category] ||
                          'ellipsis-horizontal'
                        }
                        size={18}
                        color="#475569"
                      />
                    </View>

                    <Text style={styles.categoryName}>
                      {item.category}
                    </Text>
                  </View>

                  <View style={styles.categoryAmount}>
                    <Text style={styles.amountText}>
                      {formatAmount(item.amount)}
                    </Text>

                    <Text style={styles.percentageText}>
                      {Math.round(item.percentage)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(
                          item.percentage,
                          100
                        )}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))
          )}
        </View>

        {/* Spending Statistics */}
        <Text style={styles.sectionTitle}>
          Spending Statistics
        </Text>

        <View style={styles.statisticsCard}>
          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <Ionicons
                name="receipt-outline"
                size={20}
                color="#64748B"
              />

              <Text style={styles.statLabel}>
                Transactions
              </Text>
            </View>

            <Text style={styles.statValue}>
              {monthTransactions.length}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <Ionicons
                name="cart-outline"
                size={20}
                color="#64748B"
              />

              <Text style={styles.statLabel}>
                Average expense
              </Text>
            </View>

            <Text style={styles.statValue}>
              {formatAmount(Math.round(averageExpense))}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <Ionicons
                name="pie-chart-outline"
                size={20}
                color="#64748B"
              />

              <Text style={styles.statLabel}>
                Categories used
              </Text>
            </View>

            <Text style={styles.statValue}>
              {spendingByCategory.length}
            </Text>
          </View>
        </View>

        {/* Empty Transactions */}
        {transactions.length === 0 && (
          <View style={styles.noDataCard}>
            <Ionicons
              name="analytics-outline"
              size={28}
              color="#2563EB"
            />

            <View style={styles.noDataTextContainer}>
              <Text style={styles.noDataTitle}>
                Start tracking your money
              </Text>

              <Text style={styles.noDataText}>
                Add income and expenses to unlock your
                analytics.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 45,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  monthSelector: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },

  monthButton: {
    flex: 1,
    height: 42,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeMonthButton: {
    backgroundColor: '#FFFFFF',
  },

  monthButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  activeMonthText: {
    color: '#2563EB',
  },

  periodTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },

  overviewGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  overviewCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },

  overviewIcon: {
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

  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  incomeAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
  },

  expenseAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
  },

  balanceCard: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },

  balanceLabel: {
    fontSize: 13,
    color: '#DBEAFE',
    marginBottom: 5,
  },

  balanceAmount: {
    fontSize: 23,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  balanceIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },

  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 28,
  },

  categoryRow: {
    marginBottom: 20,
  },

  categoryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },

  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  categoryAmount: {
    alignItems: 'flex-end',
  },

  amountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },

  percentageText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },

  progressBackground: {
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 15,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },

  statisticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    marginTop: 12,
  },

  statRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  statLabel: {
    fontSize: 13,
    color: '#64748B',
  },

  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  statDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },

  noDataCard: {
    marginTop: 18,
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  noDataTextContainer: {
    flex: 1,
  },

  noDataTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 3,
  },

  noDataText: {
    fontSize: 12,
    color: '#3B82F6',
    lineHeight: 17,
  },
});