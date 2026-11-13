import { NativeTabs } from "expo-router/native-tabs";
import { Redirect, type Href } from "expo-router";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function TabLayout() {
  const { isHydrated, accessToken } = useAuth();

  if (!isHydrated) return null;
  if (!accessToken) return <Redirect href={'/(auth)/signin' as Href} />;

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="shop">
        <NativeTabs.Trigger.Icon sf="storefront" md="storefront" />
        <NativeTabs.Trigger.Label>Shop</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="cart" accessibilityLabel="Shopping cart">
        <NativeTabs.Trigger.Icon sf="cart" md="shopping_cart" />
        <NativeTabs.Trigger.Label>Cart</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="todos">
        <NativeTabs.Trigger.Icon sf="checkmark.square" md="check_box" />
        <NativeTabs.Trigger.Label>Todos</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="orders">
        <NativeTabs.Trigger.Icon sf="shippingbox" md="receipt_long" />
        <NativeTabs.Trigger.Label>Orders</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf="person.crop.circle" md="person" />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
