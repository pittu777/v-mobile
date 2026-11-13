import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { router, type Href } from 'expo-router';
import { ChevronRight, CircleHelp, LockKeyhole, LogOut, Bell, Package, UserRound } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MENU_ITEMS = [
  { id: 'account', title: 'Personal information', icon: UserRound },
  { id: 'orders', title: 'Order history', icon: Package },
  { id: 'notifications', title: 'Notifications', icon: Bell },
  { id: 'security', title: 'Privacy & security', icon: LockKeyhole },
  { id: 'help', title: 'Help & support', icon: CircleHelp },
];

const Profile = () => {
  const { user, clearAuth } = useAuth();
  const initials = user?.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const handleSignOut = async () => {
    await clearAuth();
    router.replace('/(auth)/signin' as Href);
  };

  return (
  <SafeAreaView className="flex-1 bg-background" edges={['top']}>
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[480px] self-center px-4 pt-6">
        <Text variant="headline">Profile</Text>

        {user ? <View className="mt-6 flex-row items-center gap-4 border-b border-border pb-6">
          <View className="h-16 w-16 items-center justify-center rounded-md bg-primary">
            <Text className="text-title font-semibold text-primary-foreground">
              {initials}
            </Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text variant="title">{user.name}</Text>
            <Text variant="muted" className="mt-1">
              {user.email}
            </Text>
            <Text variant="label" className="mt-2 text-muted-foreground">
              {user.role === 'member' ? 'Member' : user.role}
            </Text>
          </View>
        </View> : null}

        <Text className="mb-2 mt-6 text-body font-semibold">Account settings</Text>
        <View>
          {MENU_ITEMS.map((item) => (
            <View
              key={item.id}
              className="min-h-14 flex-row items-center gap-3 border-b border-border"
            >
              <Icon as={item.icon} size={19} className="text-muted-foreground" />
              <Text className="flex-1 text-body">{item.title}</Text>
              <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
            </View>
          ))}
        </View>

        <Button
          variant="destructive"
          size="lg"
          className="mt-6 w-full"
          accessibilityLabel="Sign out"
          onPress={handleSignOut}
        >
          <Icon as={LogOut} size={18} />
          <Text>Sign out</Text>
        </Button>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};

export default Profile;
