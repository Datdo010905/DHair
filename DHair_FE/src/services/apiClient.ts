import { Platform } from 'react-native';

// Khi dùng điện thoại thật, EXPO_PUBLIC_API_URL là địa chỉ LAN của máy chạy backend.
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  // (Platform.OS === 'android' ? 'http://192.168.43.241:5000' : 'http://localhost:5000')
  (Platform.OS === 'android' ? 'http://192.168.137.1:5000' : 'http://localhost:5000')
).replace(/\/+$/, '');

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const REQUEST_TIMEOUT_MS = 15000;

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const cancelRequest = () => controller.abort();

  // Cho phép hook hủy fetch; controller riêng còn dùng để giới hạn thời gian chờ.
  signal?.addEventListener('abort', cancelRequest);
  if (signal?.aborted) {
    cancelRequest();
  }

  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    // Backend trả về { success, data, message }; màn hình chỉ cần phần data.
    let body: ApiResponse<T>;
    try {
      body = await response.json();
    } catch (error) {
      if (controller.signal.aborted) {
        throw error;
      }
      throw new Error(`Máy chủ trả về dữ liệu không hợp lệ (HTTP ${response.status}).`);
    }

    if (!response.ok || !body || body.success !== true) {
      throw new Error(body?.message || `Không thể tải dữ liệu (HTTP ${response.status}).`);
    }
    return body.data;
  } catch (error) {
    if (timedOut) {
      throw new Error('Máy chủ phản hồi quá lâu. Vui lòng thử lại.');
    }
    if (signal?.aborted) {
      throw error;
    }
    if (error instanceof TypeError) {
      throw new Error('Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.');
    }
    throw error;
  } finally {
    // Dọn bộ đếm và listener dù yêu cầu thành công, thất bại hay bị hủy.
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', cancelRequest);
  }
}

export function getImageUrl(path: string | null): string | null {
  const imagePath = path?.trim().replace(/\\/g, '/');
  if (!imagePath) {
    return null;
  }
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }
  return `${API_BASE_URL}/${imagePath.replace(/^\/+/, '')}`;
}
