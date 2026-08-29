import { useTransactions } from '@/context/TransactionContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type FilterType = 'all' | 'income' | 'expense';
type DateFilter = 'all' | 'thisMonth' | 'lastMonth';

export default function TransactionsScreen() {
  const { transactions } = useTransactions();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const filteredTransactions = useMemo(() => {
    const now = new Date();

    return transactions.filter((transaction) => {
      // Type filter
      if (filter !== 'all' && transaction.type !== filter) {
        return false;
      }

      // Search filter
      const searchText = search.toLowerCase().trim();

      if (searchText) {
        const matchesSearch =
          transaction.note.toLowerCase().includes(searchText) ||
          transaction.category.toLowerCase().includes(searchText) ||
          transaction.paymentMethod.toLowerCase().includes(searchText);

        if (!matchesSearch) {
          return false;
        }
      }

      // Date filter
      const transactionDate = new Date(transaction.date);

      if (dateFilter === 'thisMonth') {
        const sameMonth =
          transactionDate.getMonth() === now.getMonth() &&
          transactionDate.getFullYear() === now.getFullYear();

        if (!sameMonth) {
          return false;
        }
      }

      if (dateFilter === 'lastMonth') {
        const lastMonthDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );

        const sameMonth =
          transactionDate.getMonth() === lastMonthDate.getMonth() &&
          transactionDate.getFullYear() ===
            lastMonthDate.getFullYear();

        if (!sameMonth) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, search, filter, dateFilter]);

  const formatAmount = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return 'Today';
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return 'Yesterday';
    }

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const totalIncome = filteredTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Transactions</Text>
            <Text style={styles.subtitle}>
              Keep track of your money
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {transactions.length}
            </Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={21}
            color="#9CA3AF"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search transactions..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons
                name="close-circle"
                size={20}
                color="#9CA3AF"
              />
            </Pressable>
          )}
        </View>

        {/* Transaction Type Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <Pressable
            style={[
              styles.filterButton,
              filter === 'all' && styles.activeFilter,
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'all' && styles.activeFilterText,
              ]}
            >
              All
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filter === 'income' && styles.activeIncomeFilter,
            ]}
            onPress={() => setFilter('income')}
          >
            <Ionicons
              name="arrow-down-outline"
              size={16}
              color={
                filter === 'income' ? '#16A34A' : '#6B7280'
              }
            />

            <Text
              style={[
                styles.filterText,
                filter === 'income' &&
                  styles.activeIncomeFilterText,
              ]}
            >
              Income
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filter === 'expense' && styles.activeExpenseFilter,
            ]}
            onPress={() => setFilter('expense')}
          >
            <Ionicons
              name="arrow-up-outline"
              size={16}
              color={
                filter === 'expense' ? '#DC2626' : '#6B7280'
              }
            />

            <Text
              style={[
                styles.filterText,
                filter === 'expense' &&
                  styles.activeExpenseFilterText,
              ]}
            >
              Expenses
            </Text>
          </Pressable>
        </ScrollView>

        {/* Date Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateFilterRow}
        >
          <Pressable
            style={[
              styles.dateButton,
              dateFilter === 'all' && styles.activeDateButton,
            ]}
            onPress={() => setDateFilter('all')}
          >
            <Text
              style={[
                styles.dateText,
                dateFilter === 'all' && styles.activeDateText,
              ]}
            >
              All time
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.dateButton,
              dateFilter === 'thisMonth' &&
                styles.activeDateButton,
            ]}
            onPress={() => setDateFilter('thisMonth')}
          >
            <Text
              style={[
                styles.dateText,
                dateFilter === 'thisMonth' &&
                  styles.activeDateText,
              ]}
            >
              This month
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.dateButton,
              dateFilter === 'lastMonth' &&
                styles.activeDateButton,
            ]}
            onPress={() => setDateFilter('lastMonth')}
          >
            <Text
              style={[
                styles.dateText,
                dateFilter === 'lastMonth' &&
                  styles.activeDateText,
              ]}
            >
              Last month
            </Text>
          </Pressable>
        </ScrollView>

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={styles.incomeSummary}>
                + {formatAmount(totalIncome)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={styles.expenseSummary}>
                - {formatAmount(totalExpenses)}
              </Text>
            </View>
          </View>
        )}

        {/* Results */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {search || filter !== 'all' || dateFilter !== 'all'
              ? 'Filtered Transactions'
              : 'All Transactions'}
          </Text>

          <Text style={styles.resultsCount}>
            {filteredTransactions.length}
          </Text>
        </View>

        {/* Transaction List */}
        <View style={styles.transactionsCard}>
          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name={
                    search ||
                    filter !== 'all' ||
                    dateFilter !== 'all'
                      ? 'search-outline'
                      : 'receipt-outline'
                  }
                  size={30}
                  color="#9CA3AF"
                />
              </View>

              <Text style={styles.emptyTitle}>
                {search ||
                filter !== 'all' ||
                dateFilter !== 'all'
                  ? 'No transactions found'
                  : 'No transactions yet'}
              </Text>

              <Text style={styles.emptyText}>
                {search ||
                filter !== 'all' ||
                dateFilter !== 'all'
                  ? 'Try changing your search or filters.'
                  : 'Your transactions will appear here.'}
              </Text>
            </View>
          ) : (
            filteredTransactions.map((transaction) => (
              <View
                key={transaction.id}
                style={styles.transaction}
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
                      {transaction.note ||
                        transaction.category}
                    </Text>

                    <Text style={styles.transactionCategory}>
                      {transaction.category} •{' '}
                      {transaction.paymentMethod}
                    </Text>

                    <Text style={styles.transactionDate}>
                      {formatDate(transaction.date)}
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
    paddingBottom: 40,
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

  countBadge: {
    minWidth: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },

  searchContainer: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },

  filterRow: {
    gap: 8,
    paddingBottom: 12,
  },

  filterButton: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  activeFilter: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },

  activeIncomeFilter: {
    backgroundColor: '#DCFCE7',
    borderColor: '#BBF7D0',
  },

  activeExpenseFilter: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },

  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },

  activeFilterText: {
    color: '#FFFFFF',
  },

  activeIncomeFilterText: {
    color: '#16A34A',
  },

  activeExpenseFilterText: {
    color: '#DC2626',
  },

  dateFilterRow: {
    gap: 8,
    paddingBottom: 18,
  },

  dateButton: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeDateButton: {
    backgroundColor: '#DBEAFE',
  },

  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  activeDateText: {
    color: '#2563EB',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  summaryItem: {
    flex: 1,
  },

  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 5,
  },

  incomeSummary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },

  expenseSummary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 14,
  },

  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  resultsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  transactionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },

  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },

  transactionIcon: {
    width: 44,
    height: 44,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },

  transactionCategory: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 3,
  },

  transactionDate: {
    fontSize: 10,
    color: '#9CA3AF',
  },

  transactionAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
    marginLeft: 8,
  },

  incomeAmount: {
    color: '#16A34A',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 55,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 19,
  },
});