import { getProductIcon } from './data/mockData';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const getApiUrl = () => {
  if (!apiUrl) {
    throw new Error('The API URL is not configured.');
  }

  return apiUrl.replace(/\/$/, '');
};

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${getApiUrl()}/api/${path}`);

  if (!response.ok) {
    throw new Error(`Could not load ${path} (${response.status}).`);
  }

  return response.json() as Promise<T>;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: string;
  icon: ReturnType<typeof getProductIcon>;
};

export type CartItem = Product & { quantity: number };

export type Order = {
  id: string;
  date: string;
  status: 'Delivered' | 'In transit';
  items: { name: string; quantity: number }[];
  total: number;
};

export type Profile = {
  name: string;
  email: string;
  initials: string;
  role: string;
  stats: { label: string; value: string }[];
};

type ApiProduct = Omit<Product, 'icon'>;

export const getProducts = async (): Promise<Product[]> => {
  const products = await request<ApiProduct[]>('products');
  return products.map((product) => ({
    ...product,
    icon: getProductIcon(product.id),
  }));
};

export const getCart = async (): Promise<CartItem[]> => {
  const items = await request<(ApiProduct & { quantity: number })[]>('cart');
  return items.map((item) => ({
    ...item,
    icon: getProductIcon(item.id),
  }));
};

export const getOrders = (): Promise<Order[]> => request('orders');

export const getProfile = (): Promise<Profile> => request('profile');
