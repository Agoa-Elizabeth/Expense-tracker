import { useTransactions } from '@/context/TransactionContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
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
  const { addTransaction } = useTransactions();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [paymentMethod, setPaymentMethod] = useState('Mobile Money');
  const [note, setNote] = useState('');

  const categories =
    type === 'expense' ? expenseCategories : incomeCategories;

  const handleTypeChange = (newType: 'expense' | 'income') => {
    setType(newType);

    // Reset category when switching between Expense and Income.
    setCategory(newType === 'expense' ? 'Food' : 'Salary');
  };

  const handleSave = () => {
    if (!amount.trim()) {
      return;
    }

    addTransaction({
      type,
      amount: Number(amount),
      category,
      paymentMethod,
      note,
    });

    router.back();
  };

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
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Add Transaction</Text>
            <Text style={styles.subtitle}>
              Record your income or expense
            </Text>
          </View>

          <Pressable
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color="#111827" />
          </Pressable>
        </View>

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
            Save Transaction
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </Pressable>
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
});