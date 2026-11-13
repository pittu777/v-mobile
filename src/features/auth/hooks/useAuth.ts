import { create } from 'zustand';
import { authStorage } from '../authStorage';
import type { User } from '../api/authApi';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;
  setAuth: (user: User, accessToken: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isHydrated: false,

  setAuth: async (user, accessToken) => {
    await authStorage.setToken(accessToken);
    await authStorage.setUser(user);
    set({ user, accessToken });
  },

  clearAuth: async () => {
    try {
      await authStorage.clear();
    } finally {
      set({ user: null, accessToken: null });
    }
  },

  hydrate: async () => {
    try {
      const [token, user] = await Promise.all([
        authStorage.getToken(),
        authStorage.getUser(),
      ]);
      if (!token || !user) {
        set({ accessToken: null, user: null, isHydrated: true });
        return;
      }
      set({ accessToken: token, user, isHydrated: true });
    } catch {
      set({ accessToken: null, user: null, isHydrated: true });
    }
  },
}));

export const useAuth = () => {
  const { user, accessToken, isHydrated, setAuth, clearAuth, hydrate } = useAuthStore();
  return { user, accessToken, isHydrated, setAuth, clearAuth, hydrate };
};
