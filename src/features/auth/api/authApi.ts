const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const getApiUrl = () => {
  if (!apiUrl) throw new Error('EXPO_PUBLIC_API_URL is not configured.');
  return apiUrl.replace(/\/$/, '');
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const res = await fetch(`${getApiUrl()}/api/${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export const authApi = {
  signup: (name: string, email: string, password: string, confirmPassword: string) =>
    request<AuthResponse>('auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword }),
    }),

  signin: (email: string, password: string) =>
    request<AuthResponse>('auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  verifyEmail: (token: string) =>
    request<{ user: User }>('auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    request<{ message: string }>('auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string, confirmPassword: string) =>
    request<AuthResponse>('auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password, confirmPassword }),
    }),

  me: (accessToken: string) =>
    request<{ user: User }>('auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};