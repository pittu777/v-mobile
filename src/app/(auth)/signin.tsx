import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { authApi } from '@/features/auth/api/authApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function SigninScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const { user, accessToken } = await authApi.signin(email.trim(), password);
      setAuth(user, accessToken);
      if (!user.emailVerified) {
        router.replace('/(auth)/verify-email');
      } else {
        router.replace('/(tabs)/todos');
      }
    } catch (e: any) {
      setError(e.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView
          contentContainerClassName="flex-1 px-4 py-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[480px] self-center">
            <Text variant="headline" className="text-center">Welcome back</Text>
            <Text variant="muted" className="mt-2 text-center">
              Sign in to continue
            </Text>

            {error ? (
              <View className="mt-6 gap-3 rounded-md bg-destructive/10 p-4">
                <Text className="text-body text-foreground">{error}</Text>
              </View>
            ) : null}

            <View className="mt-8 gap-4">
              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                accessibilityLabel="Email"
              />
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="current-password"
                accessibilityLabel="Password"
              />
            </View>

            <Button
              className="mt-6 w-full"
              size="lg"
              disabled={loading}
              onPress={handleSubmit}
            >
              <Text>{loading ? 'Signing in…' : 'Sign in'}</Text>
            </Button>

            <View className="mt-4 flex-row items-center justify-center gap-2">
              <Text variant="muted">Don't have an account?</Text>
              <Link href="/(auth)/signup" className="text-primary">
                <Text variant="label">Sign up</Text>
              </Link>
            </View>

            <Link href="/(auth)/forgot-password" className="mt-4 block text-center">
              <Text variant="label" className="text-primary">Forgot password?</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}