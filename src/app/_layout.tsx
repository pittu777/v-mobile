import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function RootLayout() {
  const { isHydrated, hydrate } = useAuth();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {isHydrated ? <Stack screenOptions={{ headerShown: false }} /> : null}
    </SafeAreaProvider>
  );
}
