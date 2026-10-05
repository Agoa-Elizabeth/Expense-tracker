import { AppHeader } from '@/components/app-header';
import { useTransactions } from '@/context/TransactionContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = [
  { name: 'Food', icon: 'restaurant-outline' },
  { name: 'Transport', icon: 'car-outline' },
  { name: 'Bills', icon: 'receipt-outline' },
  { name: 'Shopping', icon: 'bag-outline' },
  { name: 'Education', icon: 'school-outline' },
  { name: 'Health', icon: 'medkit-outline' },
  { name: 'Entertainment', icon: 'game-controller-outline' },
  { name: 'Other', icon: 'ellipsis-horizontal-outline' },
];

export default function BudgetScreen() {
  const { budgets, addBudget } = useTransactions();

  const [selectedCategory, setSelectedCategory] =
    useState('Food');

  const [amount, setAmount] = useState('');

  const handleCreateBudget = () => {
    const numericAmount = Number(
      amount.replace(/,/g, '')
    );

    if (!numericAmount || numericAmount <= 0) {
      Alert.alert(
        'Invalid amount',
        'Please enter a valid budget amount.'
      );
      return;
    }

    const alreadyExists = budgets.some(
      (budget) => budget.category === selectedCategory
    );

    if (alreadyExists) {
      Alert.alert(
        'Budget already exists',
        `You already have a ${selectedCategory} budget.`
      );
      return;
    }

    addBudget({
      category: selectedCategory,
      amount: numericAmount,
    });

    router.back();
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
          <AppHeader title="Create Budget" showBack />

          {/* Intro */}
          <View style={styles.intro}>
            <View style={styles.introIcon}>
              <Ionicons
                name="wallet-outline"
                size={30}
                color="#2563EB"
              />
            </View>

            <Text style={styles.title}>
              Set a monthly budget
            </Text>

            <Text style={styles.description}>
              Choose a spending category and decide how
              much you want to spend on it each month.
            </Text>
          </View>

          {/* Category */}
          <Text style={styles.label}>
            Budget category
          </Text>

          <View style={styles.categories}>
            {categories.map((category) => {
              const selected =
                selectedCategory === category.name;

              return (
                <Pressable
                  key={category.name}
                  style={[
                    styles.categoryButton,
                    selected &&
                      styles.selectedCategoryButton,
                  ]}
                  onPress={() =>
                    setSelectedCategory(category.name)
                  }
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      selected &&
                        styles.selectedCategoryIcon,
                    ]}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={20}
                      color={
                        selected
                          ? '#FFFFFF'
                          : '#64748B'
                      }
                    />
                  </View>

                  <Text
                    style={[
                      styles.categoryText,
                      selected &&
                        styles.selectedCategoryText,
                    ]}
                  >
                    {category.name}
                  </Text>

                  {selected && (
                    <View style={styles.check}>
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color="#FFFFFF"
                      />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Amount */}
          <Text style={styles.label}>
            Monthly budget
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
            />
          </View>

          <Text style={styles.helperText}>
            Example: 300000 for a UGX 300,000 monthly
            budget.
          </Text>

          {/* Preview */}
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>
                Budget preview
              </Text>

              <Ionicons
                name="eye-outline"
                size={18}
                color="#64748B"
              />
            </View>

            <View style={styles.previewRow}>
              <View style={styles.previewLeft}>
                <View style={styles.previewIcon}>
                  <Ionicons
                    name={
                      (categories.find(
                        (category) =>
                          category.name ===
                          selectedCategory
                      )?.icon ||
                        'wallet-outline') as any
                    }
                    size={20}
                    color="#2563EB"
                  />
                </View>

                <View>
                  <Text style={styles.previewCategory}>
                    {selectedCategory}
                  </Text>

                  <Text style={styles.previewPeriod}>
                    Monthly budget
                  </Text>
                </View>
              </View>

              <Text style={styles.previewAmount}>
                UGX{' '}
                {Number(
                  amount.replace(/,/g, '') || 0
                ).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Create */}
          <Pressable
            style={styles.createButton}
            onPress={handleCreateBudget}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={21}
              color="#FFFFFF"
            />

            <Text style={styles.createButtonText}>
              Create Budget
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
    paddingBottom: 40,
  },

  intro: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },

  introIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 23,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 330,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 11,
  },

  categories: {
    gap: 9,
    marginBottom: 27,
  },

  categoryButton: {
    minHeight: 58,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectedCategoryButton: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },

  categoryIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  selectedCategoryIcon: {
    backgroundColor: '#2563EB',
  },

  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },

  selectedCategoryText: {
    color: '#1D4ED8',
  },

  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
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

  helperText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8,
    marginBottom: 25,
  },

  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 20,
  },

  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  previewTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  previewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  previewIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  previewCategory: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },

  previewPeriod: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 3,
  },

  previewAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },

  createButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  createButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});