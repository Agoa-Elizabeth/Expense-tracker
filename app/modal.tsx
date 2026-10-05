import { AppHeader } from '@/components/app-header';
import {
  TransactionType,
  useTransactions,
} from '@/context/TransactionContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const expenseCategories = [
  { name: 'Food', icon: 'restaurant-outline' as const },
  { name: 'Transport', icon: 'car-outline' as const },
  { name: 'Bills', icon: 'receipt-outline' as const },
  { name: 'Shopping', icon: 'bag-outline' as const },
  { name: 'Education', icon: 'school-outline' as const },
  { name: 'Other', icon: 'ellipsis-horizontal' as const },
];

const incomeCategories = [
  { name: 'Salary', icon: 'briefcase-outline' as const },
  { name: 'Freelance', icon: 'laptop-outline' as const },
  { name: 'Business', icon: 'storefront-outline' as const },
  { name: 'Gift', icon: 'gift-outline' as const },
  { name: 'Investment', icon: 'trending-up-outline' as const },
  { name: 'Other', icon: 'ellipsis-horizontal' as const },
];

const paymentMethods = [
  { name: 'Mobile Money', icon: 'phone-portrait-outline' as const },
  { name: 'Cash', icon: 'cash-outline' as const },
  { name: 'Bank', icon: 'card-outline' as const },
];

export default function ModalScreen() {
  const params = useLocalSearchParams<{ id?: string }>();

  const {
    transactions,
    hydrated,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const existingTransaction = params.id
    ? transactions.find(
        (transaction) => transaction.id === params.id
      )
    : undefined;

  const isEditing = !!existingTransaction;

  const [type, setType] = useState<TransactionType>(
    existingTransaction?.type ?? 'expense'
  );
  const [amount, setAmount] = useState(
    existingTransaction
      ? existingTransaction.amount.toString()
      : ''
  );
  const [category, setCategory] = useState(
    existingTransaction?.category ?? 'Food'
  );
  const [paymentMethod, setPaymentMethod] = useState(
    existingTransaction?.paymentMethod ?? 'Mobile Money'
  );
  const [note, setNote] = useState(
    existingTransaction?.note ?? ''
  );

  const categories =
    type === 'expense' ? expenseCategories : incomeCategories;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);

    // Reset category when switching between Expense and Income.
    setCategory(newType === 'expense' ? 'Food' : 'Salary');
  };

  const handleSave = () => {
    const numericAmount = Number(
      amount.replace(/,/g, '')
    );

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert(
        'Invalid amount',
        'Please enter an amount greater than 0.'
      );
      return;
    }

    const payload = {
      type,
      amount: numericAmount,
      category,
      paymentMethod,
      note,
    };

    if (existingTransaction) {
      updateTransaction(existingTransaction.id, payload);
    } else {
      addTransaction(payload);
    }

    router.back();
  };

  const handleDelete = () => {
    if (!existingTransaction) {
      return;
    }

    Alert.alert(
      'Delete transaction?',
      `${
        existingTransaction.note || existingTransaction.category
      } will be removed permanently.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(existingTransaction.id);
            router.back();
          },
        },
      ]
    );
  };

  if (params.id && (!hydrated || !existingTransaction)) {
    return (
      <View style={[styles.container, styles.content]}>
        <AppHeader title="Edit Transaction" showBack />

        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="receipt-outline"
              size={30}
              color="#9CA3AF"
            />
          </View>

          <Text style={styles.emptyTitle}>
            Transaction not found
          </Text>

          <Text style={styles.emptyText}>
            It may have already been deleted.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <AppHeader
          title={
            isEditing ? 'Edit Transaction' : 'Add Transaction'
          }
          subtitle={
            isEditing
              ? 'Update your income or expense'
              : 'Record your income or expense'
          }
          showBack
        />

        {/* Transaction Type */}
        <View style={styles.typeContainer}>
          <Pressable
            style={[
              styles.typeButton,
              type === 'expense' && styles.activeExpense,
            ]}
            onPress={() => handleTypeChange('expense')}
          >
            <Ionicons
              name="arrow-up-outline"
              size={18}
              color={type === 'expense' ? '#DC2626' : '#6B7280'}
            />

            <Text
              style={[
                styles.typeText,
                type === 'expense' && styles.activeExpenseText,
              ]}
            >
              Expense
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.typeButton,
              type === 'income' && styles.activeIncome,
            ]}
            onPress={() => handleTypeChange('income')}
          >
            <Ionicons
              name="arrow-down-outline"
              size={18}
              color={type === 'income' ? '#16A34A' : '#6B7280'}
            />

            <Text
              style={[
                styles.typeText,
                type === 'income' && styles.activeIncomeText,
              ]}
            >
              Income
            </Text>
          </Pressable>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Amount</Text>

          <View style={styles.amountInputContainer}>
            <Text style={styles.currency}>UGX</Text>

            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              style={styles.amountInput}
            />
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>
            {type === 'expense' ? 'Expense Category' : 'Income Category'}
          </Text>

          <View style={styles.optionsGrid}>
            {categories.map((item) => (
              <Pressable
                key={item.name}
                style={[
                  styles.optionCard,
                  category === item.name && styles.selectedOption,
                ]}
                onPress={() => setCategory(item.name)}
              >
                <Ionicons
                  name={item.icon}
                  size={21}
                  color={
                    category === item.name ? '#2563EB' : '#4B5563'
                  }
                />

                <Text
                  style={[
                    styles.optionText,
                    category === item.name &&
                      styles.selectedOptionText,
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.label}>Payment Method</Text>

          <View style={styles.paymentList}>
            {paymentMethods.map((item) => (
              <Pressable
                key={item.name}
                style={[
                  styles.paymentOption,
                  paymentMethod === item.name &&
                    styles.selectedPayment,
                ]}
                onPress={() => setPaymentMethod(item.name)}
              >
                <View style={styles.paymentLeft}>
                  <View style={styles.paymentIcon}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={
                        paymentMethod === item.name
                          ? '#2563EB'
                          : '#4B5563'
                      }
                    />
                  </View>

                  <Text
                    style={[
                      styles.paymentText,
                      paymentMethod === item.name &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>

                {paymentMethod === item.name && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color="#2563EB"
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={styles.label}>Note</Text>

          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="What was this transaction for?"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            style={styles.noteInput}
            textAlignVertical="top"
          />
        </View>

        {/* Save */}
        <Pressable
          style={[
            styles.saveButton,
            !amount.trim() && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={!amount.trim()}
        >
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Save Changes' : 'Save Transaction'}
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </Pressable>

        {/* Delete */}
        {isEditing && (
          <Pressable
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Ionicons
              name="trash-outline"
              size={19}
              color="#DC2626"
            />

            <Text style={styles.deleteButtonText}>
              Delete Transaction
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  typeContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },

  typeButton: {
    flex: 1,
    height: 46,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  activeExpense: {
    backgroundColor: '#FFFFFF',
  },

  activeIncome: {
    backgroundColor: '#FFFFFF',
  },

  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },

  activeExpenseText: {
    color: '#DC2626',
  },

  activeIncomeText: {
    color: '#16A34A',
  },

  section: {
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },

  amountInputContainer: {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  currency: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
    marginRight: 10,
  },

  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },

  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  optionCard: {
    width: '31.5%',
    minHeight: 82,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  selectedOption: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },

  optionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },

  selectedOptionText: {
    color: '#2563EB',
  },

  paymentList: {
    gap: 10,
  },

  paymentOption: {
    minHeight: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectedPayment: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },

  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paymentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  noteInput: {
    minHeight: 90,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 15,
    fontSize: 14,
    color: '#111827',
  },

  saveButton: {
    height: 58,
    borderRadius: 17,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
  },

  disabledButton: {
    opacity: 0.45,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  deleteButton: {
    height: 56,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 12,
  },

  deleteButtonText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },

  emptyState: {
    flex: 1,
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
