import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  Stack,
} from 'expo-router';
import * as SplashScreenModule from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { Animated } from 'react-native';
import 'react-native-reanimated';

import { SplashScreen } from '@/components/splash-screen';
import { TransactionProvider } from '@/context/TransactionContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreenModule.preventAutoHideAsync().catch(() => {});

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashUnmounted, setSplashUnmounted] = useState(false);
  const [splashReady, setSplashReady] = useState(false);
  const splashFade = useMemo(() => new Animated.Value(1), []);
  const [nativeSplashHidden, setNativeSplashHidden] =
    useState(false);

  useEffect(() => {
    let cancelled = false;
    SplashScreenModule.hideAsync()
      .then(() => {
        if (!cancelled) setNativeSplashHidden(true);
      })
      .catch(() => {
        if (!cancelled) setNativeSplashHidden(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!splashReady || !nativeSplashHidden) return;
    const timer = setTimeout(() => {
      Animated.timing(splashFade, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => setSplashUnmounted(true));
    }, 2500);

    return () => clearTimeout(timer);
  }, [splashReady, nativeSplashHidden, splashFade]);

  return (
    <TransactionProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Add Transaction',
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="notifications"
            options={{
              title: 'Notifications',
              headerShown: false,
            }}
          />
        </Stack>

        <StatusBar style="auto" />

        {nativeSplashHidden && !splashUnmounted && (
          <Animated.View
            style={{
              flex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: splashFade,
              zIndex: 999,
            }}
          >
            <SplashScreen onMounted={() => setSplashReady(true)} />
          </Animated.View>
        )}
      </ThemeProvider>
    </TransactionProvider>
  );
}