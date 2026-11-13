import { Redirect } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function Index() {
  const { isHydrated, accessToken } = useAuth();

  if (!isHydrated) {
    return null;
  }

  return <Redirect href={accessToken ? '/(tabs)/todos' : '/(auth)/signin'} />;
}
