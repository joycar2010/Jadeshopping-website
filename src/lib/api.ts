// 轻量 API 客户端占位：统一基础地址与请求封装
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export type FetchOptions = RequestInit & { skipAuth?: boolean };

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}

export async function pingHealth() {
  return apiFetch<{ status: string; time: string }>('/health');
}