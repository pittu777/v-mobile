import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChevronRight, CircleHelp, LockKeyhole, LogOut, Bell, Package, UserRound } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_USER = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  initials: 'AS',
  role: 'Pro Member',
  stats: [
    { label: 'Orders', value: '12' },
    { label: 'Tasks done', value: '48' },
    { label: 'Saved', value: '9' },
  ],
};

const MENU_ITEMS = [
  { id: 'account', title: 'Personal information', icon: UserRound },
  { id: 'orders', title: 'Order history', icon: Package },
  { id: 'notifications', title: 'Notifications', icon: Bell },
  { id: 'security', title: 'Privacy & security', icon: LockKeyhole },
  { id: 'help', title: 'Help & support', icon: CircleHelp },
];

const Profile = () => (
  <SafeAreaView className="flex-1 bg-background" edges={['top']}>
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[480px] self-center px-4 pt-6">
        <Text variant="headline">Profile</Text>

        <View className="mt-6 flex-row items-center gap-4 border-b border-border pb-6">
          <View className="h-16 w-16 items-center justify-center rounded-md bg-primary">
            <Text className="text-title font-semibold text-primary-foreground">
              {MOCK_USER.initials}
            </Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text variant="title">{MOCK_USER.name}</Text>
            <Text variant="muted" className="mt-1">
              {MOCK_USER.email}
            </Text>
            <Text variant="label" className="mt-2 text-muted-foreground">
              {MOCK_USER.role}
            </Text>
          </View>
        </View>

        <View className="flex-row border-b border-border py-5">
          {MOCK_USER.stats.map((stat, index) => (
            <View
              key={stat.label}
              className={`flex-1 ${index < MOCK_USER.stats.length - 1 ? 'border-r border-border' : ''} items-center`}
            >
              <Text className="text-title font-semibold">{stat.value}</Text>
              <Text variant="muted" className="mt-1 text-center">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

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
        >
          <Icon as={LogOut} size={18} />
          <Text>Sign out</Text>
        </Button>
      </View>
    </ScrollView>
  </SafeAreaView>
);

export default Profile;
