import { AppHeader } from '@/components/app-header';
import { useTransactions } from '@/context/TransactionContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlansScreen() {
  const router = useRouter();

  const {
    budgets,
    generalSavings,
    savingsGoals,
    transactions,
  } = useTransactions();

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();

    return transactions.filter((transaction) => {
      const date = new Date(transaction.date);

      return (
        transaction.type === 'expense' &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });
  }, [transactions]);

  const getBudgetSpent = (category: string) => {
    return currentMonthExpenses
      .filter(
        (transaction) => transaction.category === category
      )
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );
  };

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
        <AppHeader
          title="Plans"
          subtitle="Plan where your money should go"
        />

        {/* Budgets */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Budgets</Text>
            <Text style={styles.sectionSubtitle}>
              Keep your spending under control
            </Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() => router.push('/budget')}
          >
            <Ionicons
              name="add"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        <View style={styles.card}>
          {budgets.length === 0 ? (
            <View style={styles.emptySection}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="wallet-outline"
                  size={26}
                  color="#64748B"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No budgets yet
              </Text>

              <Text style={styles.emptyText}>
                Create a budget to start controlling your
                spending.
              </Text>

              <Pressable
                style={styles.primaryButton}
                onPress={() => router.push('/budget')}
              >
                <Ionicons
                  name="add"
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.primaryButtonText}>
                  Create Budget
                </Text>
              </Pressable>
            </View>
          ) : (
            budgets.map((budget) => {
              const spent = getBudgetSpent(budget.category);
              const percentage =
                budget.amount > 0
                  ? (spent / budget.amount) * 100
                  : 0;

              const progress = Math.min(percentage, 100);
              const remaining = Math.max(
                budget.amount - spent,
                0
              );

              return (
                <View
                  key={budget.id}
                  style={styles.budgetItem}
                >
                  <View style={styles.itemTop}>
                    <View style={styles.itemLeft}>
                      <View style={styles.itemIcon}>
                        <Ionicons
                          name="wallet-outline"
                          size={19}
                          color="#2563EB"
                        />
                      </View>

                      <Text style={styles.itemName}>
                        {budget.category}
                      </Text>
                    </View>

                    <Text style={styles.itemAmount}>
                      {formatAmount(spent)} /{' '}
                      {formatAmount(budget.amount)}
                    </Text>
                  </View>

                  <View style={styles.progressBackground}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${progress}%`,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.itemBottom}>
                    <Text style={styles.remainingText}>
                      {remaining > 0
                        ? `${formatAmount(
                            remaining
                          )} remaining`
                        : 'Budget reached'}
                    </Text>

                    <Text style={styles.percentText}>
                      {Math.round(percentage)}%
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* General Savings */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              General Savings
            </Text>
            <Text style={styles.sectionSubtitle}>
              Money you&apos;ve set aside without a specific goal
            </Text>
          </View>
        </View>

        <View style={styles.savingsCard}>
          <View style={styles.savingsIcon}>
            <Ionicons
              name="cash-outline"
              size={28}
              color="#16A34A"
            />
          </View>

          <View style={styles.savingsInfo}>
            <Text style={styles.savingsLabel}>
              Total saved
            </Text>

            <Text style={styles.savingsAmount}>
              {formatAmount(generalSavings)}
            </Text>
          </View>

          <Pressable
            style={styles.smallAddButton}
            onPress={() =>
              router.push('/general-savings')
            }
          >
            <Ionicons
              name="add"
              size={20}
              color="#16A34A"
            />
          </Pressable>
        </View>

        {/* Savings Goals */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Savings Goals
            </Text>
            <Text style={styles.sectionSubtitle}>
              Save towards something specific
            </Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() =>
              router.push('/savings-goal')
            }
          >
            <Ionicons
              name="add"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        <View style={styles.card}>
          {savingsGoals.length === 0 ? (
            <View style={styles.emptySection}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="trophy-outline"
                  size={26}
                  color="#64748B"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No savings goals yet
              </Text>

              <Text style={styles.emptyText}>
                Create a goal for something you&apos;re saving
                towards.
              </Text>

              <Pressable
                style={styles.primaryButton}
                onPress={() =>
                  router.push('/savings-goal')
                }
              >
                <Ionicons
                  name="add"
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.primaryButtonText}>
                  Create Goal
                </Text>
              </Pressable>
            </View>
          ) : (
            savingsGoals.map((goal) => {
              const percentage =
                goal.targetAmount > 0
                  ? (goal.savedAmount /
                      goal.targetAmount) *
                    100
                  : 0;

              const progress = Math.min(
                percentage,
                100
              );

              const remaining = Math.max(
                goal.targetAmount - goal.savedAmount,
                0
              );

              return (
                <View
                  key={goal.id}
                  style={styles.goalItem}
                >
                  <View style={styles.itemTop}>
                    <View style={styles.itemLeft}>
                      <View style={styles.goalIcon}>
                        <Ionicons
                          name="trophy-outline"
                          size={19}
                          color="#7C3AED"
                        />
                      </View>

                      <Text style={styles.itemName}>
                        {goal.name}
                      </Text>
                    </View>

                    <Text style={styles.itemAmount}>
                      {formatAmount(
                        goal.savedAmount
                      )}
                    </Text>
                  </View>

                  <View style={styles.progressBackground}>
                    <View
                      style={[
                        styles.goalProgressFill,
                        {
                          width: `${progress}%`,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.itemBottom}>
                    <Text style={styles.remainingText}>
                      {remaining > 0
                        ? `${formatAmount(
                            remaining
                          )} remaining`
                        : 'Goal completed 🎉'}
                    </Text>

                    <Text style={styles.percentText}>
                      {Math.round(percentage)}%
                    </Text>
                  </View>

                  <Pressable
                    style={styles.contributeButton}
                    onPress={() =>
                      router.push({
                        pathname: '/savings-goal',
                        params: {
                          goalId: goal.id,
                        },
                      })
                    }
                  >
                    <Text
                      style={styles.contributeText}
                    >
                      Add Savings
                    </Text>
                  </Pressable>
                </View>
              );
            })
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
    paddingBottom: 45,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
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
    maxWidth: 280,
  },

  addButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    marginBottom: 28,
  },

  budgetItem: {
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  goalItem: {
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },

  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  goalIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },

  itemAmount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 8,
  },

  progressBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },

  goalProgressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 4,
  },

  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },

  remainingText: {
    fontSize: 11,
    color: '#94A3B8',
  },

  percentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },

  savingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  savingsIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  savingsInfo: {
    flex: 1,
    marginLeft: 13,
  },

  savingsLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },

  savingsAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#16A34A',
  },

  smallAddButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptySection: {
    alignItems: 'center',
    paddingVertical: 32,
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
    marginBottom: 16,
  },

  primaryButton: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  contributeButton: {
    height: 38,
    borderRadius: 11,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 13,
  },

  contributeText: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '700',
  },
});