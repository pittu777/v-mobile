import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import './../global.css';

export default function RootLayout() {
  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      const parsed = Linking.parse(url);
      const token = parsed.queryParams?.token;
      if (!token) return;

      if (parsed.path === '/verify-email') {
        router.replace('/(auth)/verify-email?token=' + token);
      } else if (parsed.path === '/reset-password') {
        router.replace('/(auth)/reset-password?token=' + token);
      }
    };

    Linking.addEventListener('url', handleUrl);
    Linking.getInitialURL().then((url) => url && handleUrl({ url }));

    return () => Linking.removeAllListeners('url');
  }, []);

  return (
    <>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </>
  );
}