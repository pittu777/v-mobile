import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { authApi } from '@/features/auth/api/authApi';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Alert } from 'react-native';

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { setAuth, hydrate } = useAuth();

  // If token comes from deep link, verify immediately
  useEffect(() => {
    if (token) {
      verifyToken(token as string);
    }
  }, [token]);

  const verifyToken = async (t: string) => {
    setVerifying(true);
    setError('');
    try {
      const { user } = await authApi.verifyEmail(t);
      await hydrate();
      setAuth(user, ''); // token will be refreshed on next signin
      router.replace('/(tabs)/todos');
    } catch (e: any) {
      setError(e.message || 'Verification failed. The link may have expired.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError('Enter your email to resend the link.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await authApi.resendVerification(email.trim());
      setMessage('If that account needs verification, a new link has been sent.');
    } catch (e: any) {
      setError(e.message || 'Could not resend.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text variant="muted">Verifying your email…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView
          contentContainerClassName="flex-1 px-4 py-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[480px] self-center">
            <Text variant="headline" className="text-center">Verify your email</Text>
            <Text variant="muted" className="mt-2 text-center">
              {token
                ? 'Verifying your link…'
                : 'Enter the verification code sent to your email, or request a new link.'}
            </Text>

            {error ? (
              <View className="mt-6 gap-3 rounded-md bg-destructive/10 p-4">
                <Text className="text-body text-foreground">{error}</Text>
              </View>
            ) : null}
            {message ? (
              <View className="mt-6 gap-3 rounded-md bg-primary/10 p-4">
                <Text className="text-body text-foreground">{message}</Text>
              </View>
            ) : null}

            {!token && (
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
                <Button
                  className="mt-4 w-full"
                  size="lg"
                  disabled={loading || !email.trim()}
                  onPress={handleResend}
                >
                  <Text>{loading ? 'Sending…' : 'Resend verification link'}</Text>
                </Button>
              </View>
            )}

            {!token && (
              <View className="mt-6 flex-row items-center justify-center gap-2">
                <Text variant="muted">Already verified?</Text>
                <Text onPress={() => router.replace('/(auth)/signin')} className="text-primary">
                  <Text variant="label">Sign in</Text>
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}