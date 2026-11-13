import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { authApi } from '@/features/auth/api/authApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();

  // If no token in URL, redirect to forgot-password
  useEffect(() => {
    if (!token) {
      router.replace('/(auth)/forgot-password');
    }
  }, [token]);

  const handleSubmit = async () => {
    setError('');
    if (!password || !confirmPassword) {
      setError('Both fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setLoading(true);
    try {
      const { user, accessToken } = await authApi.resetPassword(token as string, password, confirmPassword);
      setAuth(user, accessToken);
      router.replace('/(tabs)/todos');
    } catch (e: any) {
      setError(e.message || 'Reset failed. The link may have expired.');
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
            <Text variant="headline" className="text-center">Choose new password</Text>
            <Text variant="muted" className="mt-2 text-center">
              Your new password must be at least 8 characters
            </Text>

            {error ? (
              <View className="mt-6 gap-3 rounded-md bg-destructive/10 p-4">
                <Text className="text-body text-foreground">{error}</Text>
              </View>
            ) : null}

            <View className="mt-8 gap-4">
              <Input
                placeholder="New password (min 8 chars)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
                accessibilityLabel="New password"
              />
              <Input
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="new-password"
                accessibilityLabel="Confirm new password"
              />
              <Button
                className="mt-4 w-full"
                size="lg"
                disabled={loading}
                onPress={handleSubmit}
              >
                <Text>{loading ? 'Resetting…' : 'Reset password'}</Text>
              </Button>
            </View>

            <View className="mt-6 flex-row items-center justify-center gap-2">
              <Text variant="muted">Cancel?</Text>
              <Text onPress={() => router.replace('/(auth)/signin')} className="text-primary">
                <Text variant="label">Back to sign in</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}