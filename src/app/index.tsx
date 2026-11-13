import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function Index() {
  const { isHydrated, accessToken, hydrate } = useAuth();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return null;
  }

  return <Redirect href={accessToken ? '/(tabs)/todos' : '/(auth)/signin'} />;
}