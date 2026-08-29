import { useTransactions } from '@/context/TransactionContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function GeneralSavingsScreen() {
  const {
    generalSavings,
    addToGeneralSavings,
    withdrawFromGeneralSavings,
  } = useTransactions();

  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'add' | 'withdraw'>(
    'add'
  );

  const numericAmount = Number(
    amount.replace(/,/g, '')
  );

  const formatAmount = (value: number) => {
    return `UGX ${value.toLocaleString()}`;
  };

  const handleAction = () => {
    if (!numericAmount || numericAmount <= 0) {
      Alert.alert(
        'Invalid amount',
        'Please enter a valid amount.'
      );
      return;
    }

    if (
      mode === 'withdraw' &&
      numericAmount > generalSavings
    ) {
      Alert.alert(
        'Insufficient savings',
        'You cannot withdraw more than your current savings.'
      );
      return;
    }

    if (mode === 'add') {
      addToGeneralSavings(numericAmount);

      Alert.alert(
        'Savings updated',
        `${formatAmount(
          numericAmount
        )} has been added to your general savings.`,
        [
          {
            text: 'Done',
            onPress: () => {
              setAmount('');
              router.back();
            },
          },
        ]
      );
    } else {
      withdrawFromGeneralSavings(numericAmount);

      Alert.alert(
        'Savings updated',
        `${formatAmount(
          numericAmount
        )} has been withdrawn from your savings.`,
        [
          {
            text: 'Done',
            onPress: () => {
              setAmount('');
              router.back();
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color="#111827"
              />
            </Pressable>

            <Text style={styles.headerTitle}>
              General Savings
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          {/* Current Savings */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceIcon}>
              <Ionicons
                name="cash-outline"
                size={30}
                color="#16A34A"
              />
            </View>

            <Text style={styles.balanceLabel}>
              Current savings
            </Text>

            <Text style={styles.balanceAmount}>
              {formatAmount(generalSavings)}
            </Text>

            <Text style={styles.balanceDescription}>
              Money you&apos;ve set aside for future use.
            </Text>
          </View>

          {/* Add / Withdraw */}
          <View style={styles.modeSelector}>
            <Pressable
              style={[
                styles.modeButton,
                mode === 'add' &&
                  styles.activeAddButton,
              ]}
              onPress={() => setMode('add')}
            >
              <Ionicons
                name="add-circle-outline"
                size={19}
                color={
                  mode === 'add'
                    ? '#16A34A'
                    : '#64748B'
                }
              />

              <Text
                style={[
                  styles.modeText,
                  mode === 'add' &&
                    styles.activeAddText,
                ]}
              >
                Add Savings
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modeButton,
                mode === 'withdraw' &&
                  styles.activeWithdrawButton,
              ]}
              onPress={() => setMode('withdraw')}
            >
              <Ionicons
                name="remove-circle-outline"
                size={19}
                color={
                  mode === 'withdraw'
                    ? '#DC2626'
                    : '#64748B'
                }
              />

              <Text
                style={[
                  styles.modeText,
                  mode === 'withdraw' &&
                    styles.activeWithdrawText,
                ]}
              >
                Withdraw
              </Text>
            </Pressable>
          </View>

          {/* Amount */}
          <Text style={styles.label}>
            {mode === 'add'
              ? 'Amount to save'
              : 'Amount to withdraw'}
          </Text>

          <View style={styles.amountContainer}>
            <Text style={styles.currency}>UGX</Text>

            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor="#CBD5E1"
              keyboardType="numeric"
              autoFocus
            />
          </View>

          {/* Quick amounts */}
          <Text style={styles.quickLabel}>
            Quick amount
          </Text>

          <View style={styles.quickAmounts}>
            {[10000, 50000, 100000, 500000].map(
              (value) => (
                <Pressable
                  key={value}
                  style={styles.quickButton}
                  onPress={() =>
                    setAmount(value.toString())
                  }
                >
                  <Text style={styles.quickText}>
                    {value >= 1000
                      ? `${value / 1000}K`
                      : value}
                  </Text>
                </Pressable>
              )
            )}
          </View>

          {/* Preview */}
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>
              After this transaction
            </Text>

            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>
                Current savings
              </Text>

              <Text style={styles.previewValue}>
                {formatAmount(generalSavings)}
              </Text>
            </View>

            <View style={styles.previewDivider} />

            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>
                {mode === 'add'
                  ? 'Amount added'
                  : 'Amount withdrawn'}
              </Text>

              <Text
                style={[
                  styles.previewValue,
                  mode === 'add'
                    ? styles.addValue
                    : styles.withdrawValue,
                ]}
              >
                {mode === 'add' ? '+' : '-'}{' '}
                {formatAmount(numericAmount || 0)}
              </Text>
            </View>

            <View style={styles.previewDivider} />

            <View style={styles.previewRow}>
              <Text style={styles.totalLabel}>
                New balance
              </Text>

              <Text style={styles.totalValue}>
                {formatAmount(
                  mode === 'add'
                    ? generalSavings +
                        (numericAmount || 0)
                    : Math.max(
                        0,
                        generalSavings -
                          (numericAmount || 0)
                      )
                )}
              </Text>
            </View>
          </View>

          {/* Action */}
          <Pressable
            style={[
              styles.actionButton,
              mode === 'withdraw' &&
                styles.withdrawActionButton,
            ]}
            onPress={handleAction}
          >
            <Ionicons
              name={
                mode === 'add'
                  ? 'add-circle-outline'
                  : 'remove-circle-outline'
              }
              size={21}
              color="#FFFFFF"
            />

            <Text style={styles.actionText}>
              {mode === 'add'
                ? 'Add to Savings'
                : 'Withdraw Savings'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  keyboardContainer: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 45,
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  headerSpacer: {
    width: 42,
  },

  balanceCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 24,
  },

  balanceIcon: {
    width: 64,
    height: 64,
    borderRadius: 21,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  balanceLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },

  balanceAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#15803D',
  },

  balanceDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 7,
    textAlign: 'center',
  },

  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 15,
    padding: 4,
    marginBottom: 26,
  },

  modeButton: {
    flex: 1,
    height: 44,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  activeAddButton: {
    backgroundColor: '#DCFCE7',
  },

  activeWithdrawButton: {
    backgroundColor: '#FEE2E2',
  },

  modeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  activeAddText: {
    color: '#15803D',
  },

  activeWithdrawText: {
    color: '#B91C1C',
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },

  amountContainer: {
    height: 65,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
  },

  currency: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    marginRight: 12,
  },

  amountInput: {
    flex: 1,
    fontSize: 25,
    fontWeight: '800',
    color: '#111827',
  },

  quickLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 18,
    marginBottom: 9,
  },

  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 25,
  },

  quickButton: {
    flex: 1,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },

  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 17,
    marginBottom: 20,
  },

  previewTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },

  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 38,
  },

  previewLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  previewValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  addValue: {
    color: '#16A34A',
  },

  withdrawValue: {
    color: '#DC2626',
  },

  previewDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },

  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },

  totalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },

  actionButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  withdrawActionButton: {
    backgroundColor: '#DC2626',
  },

  actionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});