import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { categories, formatPrice, products } from '@/features/shop/data/mockData';
import { Search, ShoppingCart, Star } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categories)[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [searchQuery, selectedCategory],
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[480px] self-center px-4 pt-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text variant="headline">Shop</Text>
              <Text variant="muted" className="mt-1">
                Find something for your everyday.
              </Text>
            </View>
            <View className="relative">
              <Button
                variant="outline"
                size="icon"
                accessibilityLabel="Cart tab, 2 items"
              >
                <Icon as={ShoppingCart} size={20} />
              </Button>
              <View className="absolute -right-1 -top-1 min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1">
                <Text className="text-[11px] font-medium text-primary-foreground">
                  2
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-6 flex-row items-center gap-2">
            <Icon as={Search} size={18} className="absolute left-3 z-10 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search products"
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="Search products"
              returnKeyType="search"
            />
          </View>

          <ScrollView
            horizontal
            className="mt-4"
            contentContainerClassName="gap-2 pr-4"
            showsHorizontalScrollIndicator={false}
          >
            {categories.map((category) => {
              const selected = category === selectedCategory;
              return (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  className={`h-11 min-w-11 items-center justify-center rounded-md border px-4 ${
                    selected
                      ? 'border-primary bg-primary'
                      : 'border-border bg-background active:bg-accent'
                  }`}
                >
                  <Text
                    className={
                      selected
                        ? 'text-label font-medium text-primary-foreground'
                        : 'text-label font-medium text-foreground'
                    }
                  >
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View className="mb-3 mt-6 flex-row items-center justify-between">
            <Text variant="title">Available products</Text>
            <Text variant="muted">{visibleProducts.length} items</Text>
          </View>

          <View className="gap-3">
            {visibleProducts.map((product) => (
              <View
                key={product.id}
                className="min-h-[124px] flex-row items-center gap-4 rounded-md border border-border bg-card p-3 shadow-sm shadow-black/5"
              >
                <View className="h-24 w-24 shrink-0 items-center justify-center rounded-md bg-surface">
                  <Icon as={product.icon} size={34} className="text-surface-foreground" />
                </View>
                <View className="min-w-0 flex-1 justify-between self-stretch py-1">
                  <View>
                    <Text variant="muted">{product.category}</Text>
                    <Text
                      numberOfLines={2}
                      className="mt-1 text-body font-medium text-foreground"
                    >
                      {product.name}
                    </Text>
                  </View>
                  <View className="mt-2 flex-row items-center justify-between gap-2">
                    <View>
                      <Text className="text-body font-semibold text-foreground">
                        {formatPrice(product.price)}
                      </Text>
                      <View className="mt-1 flex-row items-center gap-1">
                        <Icon as={Star} size={13} className="text-foreground" />
                        <Text variant="muted">{product.rating}</Text>
                      </View>
                    </View>
                    <Button
                      variant="outline"
                      size="sm"
                      accessibilityLabel={`Add ${product.name} to cart`}
                    >
                      <Icon as={ShoppingCart} size={16} />
                      <Text>Add</Text>
                    </Button>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {visibleProducts.length === 0 ? (
            <View className="items-center py-12">
              <Icon as={Search} size={28} className="text-muted-foreground" />
              <Text variant="title" className="mt-4 text-center">
                No products found
              </Text>
              <Text variant="muted" className="mt-2 text-center">
                Try another search or category.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Shop;
