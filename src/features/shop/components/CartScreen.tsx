import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cartItems, formatPrice } from '@/features/shop/data/mockData';
import { ArrowRight, ShoppingBag } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const subtotal = cartItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0,
);

const CartScreen = () => (
  <SafeAreaView className="flex-1 bg-background" edges={['top']}>
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[480px] self-center px-4 pt-6">
        <View className="flex-row items-end justify-between">
          <View>
            <Text variant="headline">Your cart</Text>
            <Text variant="muted" className="mt-1">
              {cartItems.length} items saved for checkout
            </Text>
          </View>
          <Icon as={ShoppingBag} size={22} className="mb-1 text-muted-foreground" />
        </View>

        <View className="mt-6 gap-3">
          {cartItems.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center gap-4 rounded-md border border-border bg-card p-3 shadow-sm shadow-black/5"
            >
              <View className="h-20 w-20 shrink-0 items-center justify-center rounded-md bg-surface">
                <Icon as={item.icon} size={30} className="text-surface-foreground" />
              </View>
              <View className="min-w-0 flex-1">
                <Text variant="muted">{item.category}</Text>
                <Text numberOfLines={2} className="mt-1 text-body font-medium">
                  {item.name}
                </Text>
                <View className="mt-3 flex-row items-center justify-between">
                  <Text className="text-body font-semibold">
                    {formatPrice(item.price)}
                  </Text>
                  <Text variant="label" className="text-muted-foreground">
                    Qty {item.quantity}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-6 rounded-md border border-border bg-card p-4">
          <Text variant="title">Order summary</Text>
          <View className="mt-4 gap-3">
            <View className="flex-row justify-between">
              <Text variant="body" className="text-muted-foreground">Subtotal</Text>
              <Text variant="body">{formatPrice(subtotal)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text variant="body" className="text-muted-foreground">Delivery</Text>
              <Text variant="body">Free</Text>
            </View>
            <View className="my-1 h-px bg-border" />
            <View className="flex-row justify-between">
              <Text className="text-body font-semibold">Total</Text>
              <Text className="text-body font-semibold">{formatPrice(subtotal)}</Text>
            </View>
          </View>
        </View>

        <Button className="mt-5 w-full" size="lg" accessibilityLabel="Continue to checkout">
          <Text>Continue to checkout</Text>
          <Icon as={ArrowRight} size={18} />
        </Button>
      </View>
    </ScrollView>
  </SafeAreaView>
);

export default CartScreen;
