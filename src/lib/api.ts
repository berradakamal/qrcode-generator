import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const getImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

interface ApiOptions extends RequestInit {
  skipAuth?: boolean;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const session = await getSession();
  if (!session?.accessToken) {
    return {};
  }
  return { Authorization: `Bearer ${session.accessToken}` };
}

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const authHeader = await getAuthHeader();
    Object.assign(headers, authHeader);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: ApiOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: ApiOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: ApiOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: ApiOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  upload: async (file: File): Promise<{ url: string }> => {
    const authHeader = await getAuthHeader();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/uploads`, {
      method: 'POST',
      headers: authHeader,
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },
};

export interface QRCodeResponse {
  qrCodes: Array<{
    _id: string;
    userId: string;
    type: string;
    name: string;
    shortCode: string;
    status: 'active' | 'paused' | 'archived';
    content: Record<string, unknown>;
    styling: Record<string, unknown>;
    analytics: {
      totalScans: number;
      uniqueScans: number;
      lastScanAt: string | null;
    };
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface SingleQRCodeResponse {
  qrCode: QRCodeResponse['qrCodes'][0];
}

export interface TemplateResponse {
  template: Record<string, unknown> | null;
}

export const qrcodesApi = {
  list: () => api.get<QRCodeResponse>('/api/qrcodes'),
  get: (id: string) => api.get<SingleQRCodeResponse>(`/api/qrcodes/${id}`),
  create: (data: { type: string; name: string; content: unknown; styling?: unknown }) =>
    api.post<SingleQRCodeResponse>('/api/qrcodes', data),
  update: (id: string, data: { name?: string; content?: unknown; styling?: unknown; status?: string }) =>
    api.patch<{ success: boolean }>(`/api/qrcodes/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean }>(`/api/qrcodes/${id}`),
  getAnalytics: (id: string) =>
    api.get<{ analytics: { totalScans: number; uniqueScans: number; lastScanAt: string | null } }>(
      `/api/qrcodes/${id}/analytics`
    ),
  getScans: (id: string, limit = 100) =>
    api.get<{ scans: Array<Record<string, unknown>> }>(`/api/qrcodes/${id}/scans?limit=${limit}`),
};

export const templatesApi = {
  get: () => api.get<TemplateResponse>('/api/templates'),
  save: (template: unknown) => api.post<{ success: boolean }>('/api/templates', { template }),
};

export interface AnalyticsByTypeResponse {
  byType: Record<string, { totalScans: number; uniqueScans: number; count: number }>;
}

export interface OSBreakdownResponse {
  osBreakdown: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  totalScans: number;
}

export const analyticsApi = {
  getByType: () => api.get<AnalyticsByTypeResponse>('/api/analytics/by-type'),
  getOSBreakdown: () => api.get<OSBreakdownResponse>('/api/analytics/os-breakdown'),
};

export interface Post {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: {
    name: string;
    email: string;
  };
  status: 'draft' | 'published';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  posts: Post[];
}

export interface SinglePostResponse {
  post: Post;
}

export const postsApi = {
  list: () => api.get<PostsResponse>('/api/posts', { skipAuth: true }),
  get: (slug: string) => api.get<SinglePostResponse>(`/api/posts/${slug}`, { skipAuth: true }),
  listAll: () => api.get<PostsResponse>('/api/posts/admin/all'),
  getById: (id: string) => api.get<SinglePostResponse>(`/api/posts/admin/${id}`),
  create: (data: { title: string; subtitle?: string; content: string; excerpt: string; coverImage?: string; status?: string }) =>
    api.post<SinglePostResponse>('/api/posts', data),
  update: (id: string, data: { title?: string; subtitle?: string; content?: string; excerpt?: string; coverImage?: string; status?: string }) =>
    api.patch<SinglePostResponse>(`/api/posts/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean }>(`/api/posts/${id}`),
};
