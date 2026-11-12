import type { LucideIcon } from 'lucide-react-native';
import { Backpack, Coffee, Headphones, PackageOpen, Watch } from 'lucide-react-native';

export type ShopCategory = 'Electronics' | 'Fashion' | 'Home' | 'Fitness';

export const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Fitness'] as const;

const productIcons: Record<string, LucideIcon> = {
  prod_1: Headphones,
  prod_2: Backpack,
  prod_3: Watch,
  prod_4: Coffee,
};

export const getProductIcon = (productId: string): LucideIcon =>
  productIcons[productId] ?? PackageOpen;

export const formatPrice = (amount: number) =>
  `\u20B9${amount.toLocaleString('en-IN')}`;
