import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BUBBLES = [
  { icon: 'bar-chart' as const, color: '#16A34A', top: 0, left: 6 },
  { icon: 'cart' as const, color: '#DC2626', top: 44, right: 6 },
  { icon: 'restaurant' as const, color: '#EA580C', top: 96, left: -2 },
];

export function SplashScreen({
  onMounted,
}: {
  onMounted?: () => void;
}) {
  const fade = useMemo(() => new Animated.Value(1), []);
  const wallet = useMemo(() => new Animated.Value(0), []);
  const scale = useMemo(() => new Animated.Value(1), []);
  const progress = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    onMounted?.();
    Animated.timing(wallet, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.back(1.4)),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [wallet, scale, progress, onMounted]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['18%', '72%'],
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <SafeAreaView style={styles.container}>
        {/* Top blob */}
        <Animated.View
          style={[
            styles.blobTop,
            {
              opacity: fade,
            },
          ]}
        />

        {/* Bottom blob */}
        <Animated.View style={styles.blobBottom} />

        {/* Illustration */}
        <View style={styles.illustration}>
          {BUBBLES.map((bubble, index) => (
            <Animated.View
              key={bubble.icon}
              style={[
                styles.bubble,
                bubble.top != null && { top: bubble.top },
                bubble.left != null && { left: bubble.left + 18 },
                bubble.right != null && { right: bubble.right + 18 },
                {
                  opacity: wallet,
                  transform: [
                    {
                      translateY: wallet.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                    {
                      scale: index === 1 ? scale : 1,
                    },
                  ],
                },
              ]}
            >
              <Ionicons
                name={bubble.icon}
                size={20}
                color={bubble.color}
              />
            </Animated.View>
          ))}

          <Animated.View
            style={[
              styles.wallet,
              {
                opacity: wallet,
                transform: [
                  {
                    translateY: wallet.interpolate({
                      inputRange: [0, 1],
                      outputRange: [24, 0],
                    }),
                  },
                  { scale: wallet.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
                ],
              },
            ]}
          >
            <View style={styles.cardBack} />
            <View style={styles.receipt}>
              <View style={styles.receiptLine} />
              <View style={[styles.receiptLine, { width: '60%' }]} />
              <View style={[styles.receiptLine, { width: '75%' }]} />
            </View>
            <View style={styles.walletBody}>
              <View style={styles.walletClasp}>
                <View style={styles.claspDot} />
              </View>
            </View>
            <View style={styles.sparkA} />
            <View style={styles.sparkB} />
          </Animated.View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Track<Text style={styles.titleAccent}>ly</Text>
        </Text>

        <Text style={styles.tagline}>
          Take control of your money.{'\n'}A simpler way to track your
          expenses.
        </Text>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: progressWidth }]}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF2',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  blobTop: {
    position: 'absolute',
    top: -90,
    left: -70,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#D9EFDD',
  },

  blobBottom: {
    position: 'absolute',
    bottom: -120,
    right: -110,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: '#D9EFDD',
    transform: [{ rotate: '20deg' }],
  },

  illustration: {
    width: 260,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  bubble: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EFE9',
    elevation: 3,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  wallet: {
    width: 150,
    height: 120,
    justifyContent: 'flex-end',
  },

  cardBack: {
    position: 'absolute',
    top: 0,
    left: 34,
    width: 84,
    height: 58,
    borderRadius: 10,
    backgroundColor: '#15803D',
    transform: [{ rotate: '-14deg' }],
  },

  receipt: {
    position: 'absolute',
    top: 2,
    left: 56,
    width: 70,
    height: 84,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    transform: [{ rotate: '10deg' }],
    paddingTop: 12,
    paddingHorizontal: 9,
    gap: 8,
  },

  receiptLine: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },

  walletBody: {
    width: 150,
    height: 104,
    borderRadius: 18,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },

  walletClasp: {
    position: 'absolute',
    right: 22,
    top: 30,
    width: 34,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  claspDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FDE68A',
  },

  sparkA: {
    position: 'absolute',
    top: 2,
    right: 30,
    width: 5,
    height: 16,
    borderRadius: 3,
    backgroundColor: '#FDBA74',
    transform: [{ rotate: '35deg' }],
  },

  sparkB: {
    position: 'absolute',
    top: -2,
    right: 12,
    width: 5,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#FDBA74',
    transform: [{ rotate: '-25deg' }],
  },

  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -1,
  },

  titleAccent: {
    color: '#16A34A',
  },

  tagline: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
  },

  progressTrack: {
    marginTop: 28,
    width: 220,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },

  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
});
