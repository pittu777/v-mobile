import type { LucideIcon } from 'lucide-react-native';
import { Backpack, Coffee, Headphones, Watch } from 'lucide-react-native';

export type ShopCategory = 'Electronics' | 'Fashion' | 'Home' | 'Fitness';

export type Product = {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  rating: string;
  icon: LucideIcon;
};

export const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Fitness'] as const;

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Wireless noise-cancelling headphones',
    category: 'Electronics',
    price: 4999,
    rating: '4.8',
    icon: Headphones,
  },
  {
    id: 'prod_2',
    name: 'Minimalist everyday backpack',
    category: 'Fashion',
    price: 2499,
    rating: '4.6',
    icon: Backpack,
  },
  {
    id: 'prod_3',
    name: 'Smart fitness tracker band',
    category: 'Fitness',
    price: 3299,
    rating: '4.7',
    icon: Watch,
  },
  {
    id: 'prod_4',
    name: 'Ceramic pour-over coffee maker',
    category: 'Home',
    price: 1899,
    rating: '4.9',
    icon: Coffee,
  },
];

export const cartItems = [
  { productId: 'prod_1', quantity: 1 },
  { productId: 'prod_2', quantity: 1 },
].map(({ productId, quantity }) => ({
  ...products.find((product) => product.id === productId)!,
  quantity,
}));

export type MockOrder = {
  id: string;
  date: string;
  status: 'Delivered' | 'In transit';
  items: { name: string; quantity: number }[];
  total: number;
};

export const orders: MockOrder[] = [
  {
    id: 'ORD-2026-1048',
    date: '18 Jul 2026',
    status: 'In transit',
    items: [
      { name: 'Wireless noise-cancelling headphones', quantity: 1 },
      { name: 'Minimalist everyday backpack', quantity: 1 },
    ],
    total: 7498,
  },
  {
    id: 'ORD-2026-1032',
    date: '04 Jul 2026',
    status: 'Delivered',
    items: [{ name: 'Ceramic pour-over coffee maker', quantity: 1 }],
    total: 1899,
  },
];

export const formatPrice = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`;
