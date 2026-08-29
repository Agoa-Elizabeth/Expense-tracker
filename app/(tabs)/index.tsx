import { useTransactions } from '@/context/TransactionContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const { transactions } = useTransactions();

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
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.name}>Elizabeth</Text>
          </View>

          <Pressable style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color="#111827"
            />
          </Pressable>
        </View>

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

          <View style={styles.balanceFooter}>
            <View style={styles.balanceChange}>
              <Ionicons
                name={balance >= 0 ? 'trending-up' : 'trending-down'}
                size={16}
                color="#D1FAE5"
              />

              <Text style={styles.changeText}>
                {transactions.length} transaction
                {transactions.length === 1 ? '' : 's'}
              </Text>
            </View>

            <Text style={styles.thisMonth}>All time</Text>
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

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Recent Transactions
          </Text>

          {transactions.length > 0 && (
            <Pressable>
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
              <View
                key={transaction.id}
                style={[
                  styles.transaction,
                  index === Math.min(transactions.length, 5) - 1 &&
                    styles.lastTransaction,
                ]}
              >
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.transactionIcon,
                      transaction.type === 'income' &&
                        styles.incomeTransactionIcon,
                    ]}
                  >
                    <Ionicons
                      name={
                        transaction.type === 'income'
                          ? 'arrow-down-outline'
                          : 'arrow-up-outline'
                      }
                      size={21}
                      color={
                        transaction.type === 'income'
                          ? '#16A34A'
                          : '#DC2626'
                      }
                    />
                  </View>

                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>
                      {transaction.note || transaction.category}
                    </Text>

                    <Text style={styles.transactionCategory}>
                      {transaction.category} •{' '}
                      {transaction.paymentMethod}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === 'income' &&
                      styles.incomeAmount,
                  ]}
                >
                  {transaction.type === 'income' ? '+' : '-'}{' '}
                  {formatAmount(transaction.amount)}
                </Text>
              </View>
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },

  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  balanceCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
  },

  balanceLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },

  balance: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 20,
  },

  negativeBalance: {
    color: '#FCA5A5',
  },

  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  changeText: {
    color: '#D1FAE5',
    fontSize: 13,
    fontWeight: '600',
  },

  thisMonth: {
    color: '#9CA3AF',
    fontSize: 13,
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

  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  lastTransaction: {
    borderBottomWidth: 0,
  },

  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  incomeTransactionIcon: {
    backgroundColor: '#DCFCE7',
  },

  transactionInfo: {
    flex: 1,
  },

  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 3,
  },

  transactionCategory: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  transactionAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },

  incomeAmount: {
    color: '#16A34A',
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