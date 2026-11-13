import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { authApi } from '@/features/auth/api/authApi';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setMessage('If that account exists, a reset link has been sent.');
    } catch (e: any) {
      setError(e.message || 'Could not send reset link.');
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
            <Text variant="headline" className="text-center">Reset password</Text>
            <Text variant="muted" className="mt-2 text-center">
              Enter your email and we'll send a link to choose a new password
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
                onPress={handleSubmit}
              >
                <Text>{loading ? 'Sending…' : 'Send reset link'}</Text>
              </Button>
            </View>

            <View className="mt-6 flex-row items-center justify-center gap-2">
              <Text variant="muted">Remember your password?</Text>
              <Text onPress={() => router.replace('/(auth)/signin')} className="text-primary">
                <Text variant="label">Sign in</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}