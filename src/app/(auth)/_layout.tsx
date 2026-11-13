import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function AuthLayout() {
  const { isHydrated, accessToken } = useAuth();

  if (!isHydrated) return null;
  if (accessToken) return <Redirect href="/(tabs)/todos" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
