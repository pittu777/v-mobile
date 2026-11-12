import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="storefront-outline"
              color={color as string}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="todos"
        options={{
          title: "Todos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="checkbox-outline"
              color={color as string}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="receipt-outline"
              color={color as string}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
