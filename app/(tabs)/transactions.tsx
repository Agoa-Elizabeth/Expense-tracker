import { AppHeader } from '@/components/app-header';
import { TransactionRow } from '@/components/transaction-row';
import { useTransactions } from '@/context/TransactionContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterType = 'all' | 'income' | 'expense';
type DateFilter = 'all' | 'thisMonth' | 'lastMonth';

export default function TransactionsScreen() {
  const { transactions } = useTransactions();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount =
    (filter !== 'all' ? 1 : 0) + (dateFilter !== 'all' ? 1 : 0);

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
        <AppHeader
          title="Transactions"
          subtitle="Keep track of your money"
        />

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

        {/* Filters Dropdown */}
        <View style={styles.dropdown}>
          <Pressable
            style={styles.dropdownHeader}
            onPress={() => setFiltersOpen((open) => !open)}
          >
            <View style={styles.dropdownHeaderLeft}>
              <Ionicons
                name="filter-outline"
                size={18}
                color="#4F46E5"
              />

              <Text style={styles.dropdownTitle}>Filters</Text>

              {activeFilterCount > 0 && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>
                    {activeFilterCount}
                  </Text>
                </View>
              )}
            </View>

            <Ionicons
              name={filtersOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#6B7280"
            />
          </Pressable>

          {filtersOpen && (
            <View style={styles.dropdownBody}>
              <Text style={styles.dropdownSection}>
                Type
              </Text>

              <View style={styles.optionRow}>
                {(
                  [
                    { key: 'all', label: 'All' },
                    { key: 'income', label: 'Income' },
                    { key: 'expense', label: 'Expenses' },
                  ] as const
                ).map((option) => {
                  const isActive = filter === option.key;

                  return (
                    <Pressable
                      key={option.key}
                      style={[
                        styles.optionButton,
                        isActive &&
                          (option.key === 'income'
                            ? styles.activeIncomeOption
                            : option.key === 'expense'
                              ? styles.activeExpenseOption
                              : styles.activeOption),
                      ]}
                      onPress={() => setFilter(option.key)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isActive &&
                            (option.key === 'income'
                              ? styles.activeIncomeOptionText
                              : option.key === 'expense'
                                ? styles.activeExpenseOptionText
                                : styles.activeOptionText),
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.dropdownSection}>
                Period
              </Text>

              <View style={styles.optionRow}>
                {(
                  [
                    { key: 'all', label: 'All time' },
                    { key: 'thisMonth', label: 'This month' },
                    { key: 'lastMonth', label: 'Last month' },
                  ] as const
                ).map((option) => {
                  const isActive = dateFilter === option.key;

                  return (
                    <Pressable
                      key={option.key}
                      style={[
                        styles.optionButton,
                        isActive && styles.activeDateOption,
                      ]}
                      onPress={() => setDateFilter(option.key)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isActive &&
                            styles.activeDateOptionText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {activeFilterCount > 0 && (
                <Pressable
                  style={styles.clearButton}
                  onPress={() => {
                    setFilter('all');
                    setDateFilter('all');
                  }}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={16}
                    color="#6B7280"
                  />

                  <Text style={styles.clearButtonText}>
                    Clear filters
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

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
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                showDate
                showChevron
              />
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

  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 18,
    overflow: 'hidden',
  },

  dropdownHeader: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },

  dropdownHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  dropdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  activeBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },

  activeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  dropdownBody: {
    paddingHorizontal: 15,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },

  dropdownSection: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },

  optionButton: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeOption: {
    backgroundColor: '#111827',
  },

  activeIncomeOption: {
    backgroundColor: '#DCFCE7',
  },

  activeExpenseOption: {
    backgroundColor: '#FEE2E2',
  },

  activeDateOption: {
    backgroundColor: '#DBEAFE',
  },

  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },

  activeOptionText: {
    color: '#FFFFFF',
  },

  activeIncomeOptionText: {
    color: '#16A34A',
  },

  activeExpenseOptionText: {
    color: '#DC2626',
  },

  activeDateOptionText: {
    color: '#2563EB',
  },

  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },

  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
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