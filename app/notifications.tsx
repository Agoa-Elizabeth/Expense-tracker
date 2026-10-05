import { AppHeader } from '@/components/app-header';
import { useTransactions } from '@/context/TransactionContext';
import {
  buildNotifications,
  formatRelativeTime,
} from '@/utils/notifications';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const {
    transactions,
    budgets,
    savingsGoals,
    seenNotificationIds,
    markNotificationsSeen,
  } = useTransactions();

  const notifications = useMemo(
    () =>
      buildNotifications(
        transactions,
        budgets,
        savingsGoals
      ),
    [transactions, budgets, savingsGoals]
  );

  useEffect(() => {
    if (notifications.length > 0) {
      markNotificationsSeen(
        notifications.map((item) => item.id)
      );
    }
  }, [notifications, markNotificationsSeen]);

  const handleOpen = (route: string) => {
    router.replace(route as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <AppHeader
          title="Notifications"
          showBack
          showBell={false}
        />

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="notifications-off-outline"
                size={30}
                color="#9CA3AF"
              />
            </View>

            <Text style={styles.emptyTitle}>
              You&apos;re all caught up
            </Text>

            <Text style={styles.emptyText}>
              Budget alerts, savings milestones and streak
              reminders will show up here.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {notifications.map((item) => {
              const unread = !seenNotificationIds.includes(
                item.id
              );

              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.card,
                    unread && styles.unreadCard,
                  ]}
                  onPress={() => handleOpen(item.route)}
                >
                  <View style={styles.cardLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor:
                            item.iconBackground,
                        },
                      ]}
                    >
                      <Ionicons
                        name={item.icon as never}
                        size={22}
                        color={item.iconColor}
                      />
                    </View>

                    {unread && (
                      <View style={styles.unreadDot} />
                    )}
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardTitle}>
                        {item.title}
                      </Text>

                      <Text style={styles.cardTime}>
                        {formatRelativeTime(item.date)}
                      </Text>
                    </View>

                    <Text style={styles.cardMessage}>
                      {item.message}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#9CA3AF"
                  />
                </Pressable>
              );
            })}
          </View>
        )}
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
    paddingTop: 10,
    paddingBottom: 40,
  },

  list: {
    gap: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },

  unreadCard: {
    borderColor: '#BFDBFE',
    backgroundColor: '#F8FAFF',
  },

  cardLeft: {
    alignItems: 'center',
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  cardBody: {
    flex: 1,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },

  cardTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  cardMessage: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
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
    fontSize: 17,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
