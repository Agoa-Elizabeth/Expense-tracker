import { useTransactions } from '@/context/TransactionContext';
import { computeStreak, STREAK_MILESTONES } from '@/utils/insights';
import { buildNotifications } from '@/utils/notifications';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showStreak?: boolean;
  showBell?: boolean;
};

export function AppHeader({
  title,
  subtitle,
  showBack = false,
  showStreak = true,
  showBell = true,
}: AppHeaderProps) {
  const {
    transactions,
    budgets,
    savingsGoals,
    seenNotificationIds,
  } = useTransactions();

  const streak = useMemo(
    () => computeStreak(transactions),
    [transactions]
  );

  const notifications = useMemo(
    () =>
      buildNotifications(
        transactions,
        budgets,
        savingsGoals
      ),
    [transactions, budgets, savingsGoals]
  );

  const unreadCount = notifications.filter(
    (item) => !seenNotificationIds.includes(item.id)
  ).length;

  const celebratedMilestone = useRef<number | null>(null);

  useEffect(() => {
    const hitMilestone =
      streak.loggedToday &&
      STREAK_MILESTONES.includes(streak.current);

    if (
      hitMilestone &&
      celebratedMilestone.current !== streak.current
    ) {
      celebratedMilestone.current = streak.current;

      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    }
  }, [streak]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const isMilestone =
    streak.loggedToday &&
    STREAK_MILESTONES.includes(streak.current);

  return (
    <View style={styles.header}>
      {showBack ? (
        <View style={styles.leftRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color="#111827"
            />
          </Pressable>

          <View style={styles.leftText}>
            <Text style={styles.title}>{title}</Text>

            {subtitle ? (
              <Text style={styles.subtitle}>{subtitle}</Text>
            ) : null}
          </View>
        </View>
      ) : title ? (
        <View style={styles.leftText}>
          <Text style={styles.title}>{title}</Text>

          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.leftText}>
          <Text style={styles.greeting}>{greeting} 👋</Text>
          <Text style={styles.name}>Elizabeth</Text>
        </View>
      )}

      {(showStreak || showBell) && (
        <View style={styles.right}>
          {showStreak && streak.current > 0 && (
            <View
              style={[
                styles.streakChip,
                isMilestone && styles.streakChipMilestone,
              ]}
            >
              <Ionicons
                name="flame"
                size={15}
                color="#EA580C"
              />

              <Text style={styles.streakChipText}>
                {streak.current}
              </Text>
            </View>
          )}

          {showBell && (
            <Pressable
              style={styles.notificationButton}
              onPress={() => router.push('/notifications')}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#111827"
              />

              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  leftText: {
    flexShrink: 1,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },

  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
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

  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  streakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#FFEDD5',
  },

  streakChipMilestone: {
    backgroundColor: '#EA580C',
  },

  streakChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EA580C',
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },

  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
