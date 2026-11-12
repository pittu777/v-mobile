import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { formatPrice } from '@/features/shop/data/mockData';
import { getOrders } from '@/features/shop/shopApi';
import { useRemoteData } from '@/features/shop/hooks/useRemoteData';
import { Check, ChevronRight, PackageCheck, Truck } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrdersScreen = () => {
  const { data, loading, error, retry } = useRemoteData(getOrders);
  const orders = data ?? [];

  return (
  <SafeAreaView className="flex-1 bg-background" edges={['top']}>
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[480px] self-center px-4 pt-6">
        <Text variant="headline">Orders</Text>
        <Text variant="muted" className="mt-1">
          Your recent purchases
        </Text>

        {loading ? <Text variant="muted" className="mt-6">Loading orders...</Text> : null}
        {error ? (
          <View className="mt-6 gap-3 rounded-md bg-destructive/10 p-4">
            <Text className="text-body text-foreground">{error}</Text>
            <Button variant="outline" onPress={retry} accessibilityLabel="Retry loading orders">
              <Text>Retry</Text>
            </Button>
          </View>
        ) : null}
        {!loading && !error && orders.length === 0 ? (
          <Text variant="muted" className="mt-6">No orders yet.</Text>
        ) : null}

        <View className="mt-6 gap-4">
          {orders.map((order) => {
            const delivered = order.status === 'Delivered';
            const StatusIcon = delivered ? PackageCheck : Truck;

            return (
              <View
                key={order.id}
                className="rounded-md border border-border bg-card p-4 shadow-sm shadow-black/5"
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <Text variant="label" className="text-muted-foreground">
                      ORDER {order.id}
                    </Text>
                    <Text variant="muted" className="mt-2">
                      Placed {order.date}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2 rounded-md bg-secondary px-3 py-2">
                    <Icon as={StatusIcon} size={15} />
                    <Text variant="label">{order.status}</Text>
                  </View>
                </View>

                <View className="my-4 h-px bg-border" />

                <View className="gap-3">
                  {order.items.map((item) => (
                    <View key={item.name} className="flex-row items-center gap-3">
                      <View className="h-10 w-10 items-center justify-center rounded-md bg-surface">
                        <Icon as={Check} size={17} className="text-muted-foreground" />
                      </View>
                      <Text numberOfLines={2} className="min-w-0 flex-1 text-body">
                        {item.name}
                      </Text>
                      <Text variant="muted">×{item.quantity}</Text>
                    </View>
                  ))}
                </View>

                <View className="mt-4 flex-row items-center justify-between">
                  <View>
                    <Text variant="muted">Order total</Text>
                    <Text className="mt-1 text-body font-semibold">
                      {formatPrice(order.total)}
                    </Text>
                  </View>
                  <Button
                    variant="outline"
                    size="sm"
                    accessibilityLabel={`View order ${order.id}`}
                  >
                    <Text>Details</Text>
                    <Icon as={ChevronRight} size={16} />
                  </Button>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};

export default OrdersScreen;
