import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router, type Href } from 'expo-router';
import { authApi } from '@/features/auth/api/authApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();

  const handleSubmit = async () => {
    setError('');
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required.');
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

    setLoading(true);
    try {
      const { user, accessToken } = await authApi.signup(name.trim(), email.trim(), password, confirmPassword);
      await setAuth(user, accessToken);
      router.replace('/(tabs)/todos');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed.');
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
            <Text variant="headline" className="text-center">Create account</Text>
            <Text variant="muted" className="mt-2 text-center">
              Enter your details to get started
            </Text>

            {error ? (
              <View className="mt-6 gap-3 rounded-md bg-destructive/10 p-4">
                <Text className="text-body text-foreground">{error}</Text>
              </View>
            ) : null}

            <View className="mt-8 gap-4">
              <Input
                placeholder="Full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
                accessibilityLabel="Full name"
              />
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
                placeholder="Password (min 8 chars)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
                accessibilityLabel="Password"
              />
              <Input
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="new-password"
                accessibilityLabel="Confirm password"
              />
            </View>

            <Button
              className="mt-6 w-full"
              size="lg"
              disabled={loading}
              onPress={handleSubmit}
            >
              <Text>{loading ? 'Creating account…' : 'Create account'}</Text>
            </Button>

            <View className="mt-6 flex-row items-center justify-center gap-2">
              <Text variant="muted">Already have an account?</Text>
              <Link href={'/(auth)/signin' as Href} className="text-primary">
                <Text variant="label">Sign in</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
