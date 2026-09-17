import { Platform } from 'react-native';

// On a physical device, set this to the backend computer's LAN address.
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000')
).replace(/\/+$/, '');

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort);
  if (signal?.aborted) controller.abort();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 15000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    let body: ApiResponse<T>;
    try {
      body = await response.json();
    } catch {
      throw new Error(`Máy chủ trả về dữ liệu không hợp lệ (HTTP ${response.status}).`);
    }
    if (!response.ok || !body || body.success !== true) {
      throw new Error(body?.message || `Không thể tải dữ liệu (HTTP ${response.status}).`);
    }
    return body.data;
  } catch (error) {
    if (timedOut) throw new Error('Máy chủ phản hồi quá lâu. Vui lòng thử lại.');
    if (signal?.aborted) throw error;
    if (error instanceof TypeError) {
      throw new Error('Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}

export function getImageUrl(path: string | null): string | null {
  const value = path?.trim().replace(/\\/g, '/');
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_BASE_URL}/${value.replace(/^\/+/, '')}`;
}
