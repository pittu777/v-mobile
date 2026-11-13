import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_access_token';
const USER_KEY = 'auth_user';

export const authStorage = {
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),
  setToken: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  deleteToken: () => SecureStore.deleteItemAsync(TOKEN_KEY),

  getUser: async () => {
    const data = await SecureStore.getItemAsync(USER_KEY);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      await SecureStore.deleteItemAsync(USER_KEY);
      return null;
    }
  },
  setUser: (user: object) => SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
  deleteUser: () => SecureStore.deleteItemAsync(USER_KEY),

  clear: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  },
};
