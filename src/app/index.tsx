import { Redirect, type Href } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function Index() {
  const { isHydrated, accessToken } = useAuth();

  if (!isHydrated) {
    return null;
  }

  const destination = accessToken ? '/(tabs)/todos' : '/(auth)/signin';
  return <Redirect href={destination as Href} />;
}
