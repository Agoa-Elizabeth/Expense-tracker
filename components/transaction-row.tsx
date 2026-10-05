import {
  Transaction,
  useTransactions,
} from '@/context/TransactionContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

type TransactionRowProps = {
  transaction: Transaction;
  showDate?: boolean;
  showChevron?: boolean;
  isLast?: boolean;
};

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

export function TransactionRow({
  transaction,
  showDate = false,
  showChevron = false,
  isLast = false,
}: TransactionRowProps) {
  const { deleteTransaction } = useTransactions();

  const isIncome = transaction.type === 'income';
  const label = transaction.note || transaction.category;

  const openEditor = () => {
    router.push({
      pathname: '/modal',
      params: { id: transaction.id },
    });
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete transaction?',
      `${label} will be removed permanently.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(transaction.id),
        },
      ]
    );
  };

  const handleLongPress = () => {
    Alert.alert(
      label,
      `${formatAmount(transaction.amount)} • ${
        transaction.category
      } • ${transaction.paymentMethod}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Edit',
          onPress: openEditor,
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  return (
    <Pressable
      style={[styles.transaction, isLast && styles.lastTransaction]}
      onPress={openEditor}
      onLongPress={handleLongPress}
    >
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            isIncome && styles.incomeTransactionIcon,
          ]}
        >
          <Ionicons
            name={
              isIncome ? 'arrow-down-outline' : 'arrow-up-outline'
            }
            size={21}
            color={isIncome ? '#16A34A' : '#DC2626'}
          />
        </View>

        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{label}</Text>

          <Text style={styles.transactionCategory}>
            {transaction.category} • {transaction.paymentMethod}
          </Text>

          {showDate && (
            <Text style={styles.transactionDate}>
              {formatDate(transaction.date)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            isIncome && styles.incomeAmount,
          ]}
        >
          {isIncome ? '+' : '-'} {formatAmount(transaction.amount)}
        </Text>

        {showChevron && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color="#CBD5E1"
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 3,
  },

  transactionCategory: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  transactionDate: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 3,
  },

  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },

  transactionAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },

  incomeAmount: {
    color: '#16A34A',
  },
});
