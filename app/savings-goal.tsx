import { useTransactions } from '@/context/TransactionContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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

const goalIcons = [
  { name: 'Laptop', icon: 'laptop-outline' },
  { name: 'Phone', icon: 'phone-portrait-outline' },
  { name: 'Car', icon: 'car-outline' },
  { name: 'Home', icon: 'home-outline' },
  { name: 'Education', icon: 'school-outline' },
  { name: 'Travel', icon: 'airplane-outline' },
  { name: 'Emergency', icon: 'shield-checkmark-outline' },
  { name: 'Other', icon: 'flag-outline' },
];

export default function SavingsGoalScreen() {
  const params = useLocalSearchParams<{
    goalId?: string;
  }>();

  const {
    savingsGoals,
    addSavingsGoal,
    addToSavingsGoal,
  } = useTransactions();

  const existingGoal = params.goalId
    ? savingsGoals.find(
        (goal) => goal.id === params.goalId
      )
    : undefined;

  const isAddingToExistingGoal = !!existingGoal;

  const [name, setName] = useState(
    existingGoal?.name ?? ''
  );

  const [targetAmount, setTargetAmount] = useState(
    existingGoal?.targetAmount
      ? existingGoal.targetAmount.toString()
      : ''
  );

  const [selectedIcon, setSelectedIcon] = useState(
    existingGoal?.icon ?? 'Laptop'
  );

  const [contributionAmount, setContributionAmount] =
    useState('');

  const numericTarget = Number(
    targetAmount.replace(/,/g, '')
  );

  const numericContribution = Number(
    contributionAmount.replace(/,/g, '')
  );

  const formatAmount = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  const handleCreateGoal = () => {
    if (!name.trim()) {
      Alert.alert(
        'Goal name required',
        'Please enter what you are saving for.'
      );
      return;
    }

    if (!numericTarget || numericTarget <= 0) {
      Alert.alert(
        'Invalid target',
        'Please enter a valid target amount.'
      );
      return;
    }

    addSavingsGoal({
      name: name.trim(),
      targetAmount: numericTarget,
      icon: selectedIcon,
    });

    router.back();
  };

  const handleAddContribution = () => {
    if (
      !numericContribution ||
      numericContribution <= 0
    ) {
      Alert.alert(
        'Invalid amount',
        'Please enter a valid amount to save.'
      );
      return;
    }

    if (!existingGoal) {
      return;
    }

    const remaining =
      existingGoal.targetAmount -
      existingGoal.savedAmount;

    if (numericContribution > remaining) {
      Alert.alert(
        'Amount too high',
        `You only need ${formatAmount(
          remaining
        )} to complete this goal.`
      );
      return;
    }

    addToSavingsGoal(
      existingGoal.id,
      numericContribution
    );

    const newSavedAmount =
      existingGoal.savedAmount +
      numericContribution;

    if (
      newSavedAmount >=
      existingGoal.targetAmount
    ) {
      Alert.alert(
        'Goal completed 🎉',
        `Congratulations! You've reached your ${existingGoal.name} goal.`,
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      Alert.alert(
        'Savings added',
        `${formatAmount(
          numericContribution
        )} has been added to your ${existingGoal.name} goal.`,
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const progress = existingGoal
    ? Math.min(
        (existingGoal.savedAmount /
          existingGoal.targetAmount) *
          100,
        100
      )
    : 0;

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
              {isAddingToExistingGoal
                ? 'Add Savings'
                : 'New Savings Goal'}
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          {isAddingToExistingGoal ? (
            <>
              {/* Existing goal */}
              <View style={styles.goalCard}>
                <View style={styles.goalIconLarge}>
                  <Ionicons
                    name={
                      (goalIcons.find(
                        (item) =>
                          item.name ===
                          existingGoal?.icon
                      )?.icon ||
                        'flag-outline') as any
                    }
                    size={32}
                    color="#7C3AED"
                  />
                </View>

                <Text style={styles.goalName}>
                  {existingGoal?.name}
                </Text>

                <Text style={styles.goalSaved}>
                  {formatAmount(
                    existingGoal?.savedAmount ?? 0
                  )}
                </Text>

                <Text style={styles.goalTarget}>
                  of{' '}
                  {formatAmount(
                    existingGoal?.targetAmount ?? 0
                  )}
                </Text>

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

                <Text style={styles.progressText}>
                  {Math.round(progress)}% complete
                </Text>
              </View>

              {/* Contribution */}
              <Text style={styles.label}>
                Amount to save
              </Text>

              <View style={styles.amountContainer}>
                <Text style={styles.currency}>
                  UGX
                </Text>

                <TextInput
                  style={styles.amountInput}
                  value={contributionAmount}
                  onChangeText={setContributionAmount}
                  placeholder="0"
                  placeholderTextColor="#CBD5E1"
                  keyboardType="numeric"
                  autoFocus
                />
              </View>

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
                        setContributionAmount(
                          value.toString()
                        )
                      }
                    >
                      <Text style={styles.quickText}>
                        {value / 1000}K
                      </Text>
                    </Pressable>
                  )
                )}
              </View>

              {/* New balance */}
              <View style={styles.previewCard}>
                <Text style={styles.previewTitle}>
                  After saving
                </Text>

                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>
                    Current savings
                  </Text>

                  <Text style={styles.previewValue}>
                    {formatAmount(
                      existingGoal?.savedAmount ?? 0
                    )}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>
                    Adding
                  </Text>

                  <Text style={styles.addValue}>
                    +{' '}
                    {formatAmount(
                      numericContribution || 0
                    )}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.previewRow}>
                  <Text style={styles.totalLabel}>
                    New savings
                  </Text>

                  <Text style={styles.totalValue}>
                    {formatAmount(
                      Math.min(
                        (existingGoal?.savedAmount ??
                          0) +
                          (numericContribution || 0),
                        existingGoal?.targetAmount ?? 0
                      )
                    )}
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.actionButton}
                onPress={handleAddContribution}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={21}
                  color="#FFFFFF"
                />

                <Text style={styles.actionText}>
                  Add Savings
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* Intro */}
              <View style={styles.intro}>
                <View style={styles.introIcon}>
                  <Ionicons
                    name="trophy-outline"
                    size={30}
                    color="#7C3AED"
                  />
                </View>

                <Text style={styles.title}>
                  What are you saving for?
                </Text>

                <Text style={styles.description}>
                  Create a target and track your progress
                  until you reach it.
                </Text>
              </View>

              {/* Goal name */}
              <Text style={styles.label}>
                Goal name
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="text-outline"
                  size={20}
                  color="#94A3B8"
                />

                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Laptop"
                  placeholderTextColor="#CBD5E1"
                />
              </View>

              {/* Icon */}
              <Text style={styles.label}>
                Choose an icon
              </Text>

              <View style={styles.iconGrid}>
                {goalIcons.map((item) => {
                  const selected =
                    selectedIcon === item.name;

                  return (
                    <Pressable
                      key={item.name}
                      style={[
                        styles.iconOption,
                        selected &&
                          styles.selectedIconOption,
                      ]}
                      onPress={() =>
                        setSelectedIcon(item.name)
                      }
                    >
                      <View
                        style={[
                          styles.goalIcon,
                          selected &&
                            styles.selectedGoalIcon,
                        ]}
                      >
                        <Ionicons
                          name={item.icon as any}
                          size={21}
                          color={
                            selected
                              ? '#FFFFFF'
                              : '#64748B'
                          }
                        />
                      </View>

                      <Text
                        style={[
                          styles.iconText,
                          selected &&
                            styles.selectedIconText,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Target */}
              <Text style={styles.label}>
                Target amount
              </Text>

              <View style={styles.amountContainer}>
                <Text style={styles.currency}>
                  UGX
                </Text>

                <TextInput
                  style={styles.amountInput}
                  value={targetAmount}
                  onChangeText={setTargetAmount}
                  placeholder="0"
                  placeholderTextColor="#CBD5E1"
                  keyboardType="numeric"
                />
              </View>

              <Text style={styles.helperText}>
                Example: 2500000 for a UGX 2,500,000
                laptop goal.
              </Text>

              {/* Preview */}
              <View style={styles.previewCard}>
                <Text style={styles.previewTitle}>
                  Goal preview
                </Text>

                <View style={styles.goalPreview}>
                  <View style={styles.goalPreviewIcon}>
                    <Ionicons
                      name={
                        (goalIcons.find(
                          (item) =>
                            item.name ===
                            selectedIcon
                        )?.icon ||
                          'flag-outline') as any
                      }
                      size={22}
                      color="#7C3AED"
                    />
                  </View>

                  <View style={styles.goalPreviewInfo}>
                    <Text style={styles.previewGoalName}>
                      {name.trim() || 'Your goal'}
                    </Text>

                    <Text style={styles.previewGoalText}>
                      Target:{' '}
                      {formatAmount(
                        numericTarget || 0
                      )}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Create */}
              <Pressable
                style={styles.actionButton}
                onPress={handleCreateGoal}
              >
                <Ionicons
                  name="flag-outline"
                  size={21}
                  color="#FFFFFF"
                />

                <Text style={styles.actionText}>
                  Create Savings Goal
                </Text>
              </Pressable>
            </>
          )}
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

  intro: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },

  introIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#F3E8FF',
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
    marginBottom: 10,
  },

  inputContainer: {
    height: 56,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 11,
    marginBottom: 25,
  },

  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },

  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 25,
  },

  iconOption: {
    width: '23%',
    minHeight: 72,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedIconOption: {
    borderColor: '#7C3AED',
    backgroundColor: '#FAF5FF',
  },

  goalIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedGoalIcon: {
    backgroundColor: '#7C3AED',
  },

  iconText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },

  selectedIconText: {
    color: '#7C3AED',
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

  goalCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 27,
  },

  goalIconLarge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  goalName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },

  goalSaved: {
    fontSize: 25,
    fontWeight: '800',
    color: '#7C3AED',
    marginTop: 10,
  },

  goalTarget: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    marginBottom: 17,
  },

  progressBackground: {
    width: '100%',
    height: 9,
    backgroundColor: '#DDD6FE',
    borderRadius: 5,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 5,
  },

  progressText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
    marginTop: 7,
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

  goalPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  goalPreviewIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  goalPreviewInfo: {
    flex: 1,
  },

  previewGoalName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },

  previewGoalText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 3,
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

  divider: {
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
    color: '#7C3AED',
  },

  actionButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  actionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});