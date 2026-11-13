const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const getApiUrl = () => {
  if (!apiUrl) throw new Error('EXPO_PUBLIC_API_URL is not configured.');
  return apiUrl.replace(/\/$/, '');
};

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const { headers, ...requestOptions } = options;
  const res = await fetch(`${getApiUrl()}/api/${path}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  const envelope = (await res.json().catch(() => ({}))) as Partial<ApiEnvelope<T>>;

  if (!res.ok || envelope.success === false) {
    throw new Error(envelope.message || `Request failed (${res.status})`);
  }

  if (envelope.success !== true || !('data' in envelope)) {
    throw new Error('The server returned an unexpected response.');
  }

  return envelope.data as T;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
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

  me: (accessToken: string) =>
    request<{ user: User }>('auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};
