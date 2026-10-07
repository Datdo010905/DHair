import { API_BASE_URL } from '@/services/apiClient';
import { endpoints } from '@/services/endpoints';

export interface CustomerProfile {
  fullName: string;
  phone: string;
  email: string;
}

async function profileRequest(
  token: string,
  signal?: AbortSignal,
  input?: Pick<CustomerProfile, 'fullName' | 'email'>,
): Promise<CustomerProfile> {
  if (!token) throw new Error('Vui lòng đăng xuất và đăng nhập lại để cập nhật thông tin.');
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort);
  if (signal?.aborted) abort();
  const timeout = setTimeout(abort, 15000);
  try {
    const response = await fetch(`${API_BASE_URL}${endpoints.profile}`, {
      method: input ? 'PUT' : 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: input ? JSON.stringify(input) : undefined,
      signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok || !result?.success)
      throw new Error(result?.message || 'Không thể xử lý thông tin cá nhân.');
    const profile = result.data;
    if (
      !profile ||
      typeof profile.fullName !== 'string' ||
      typeof profile.phone !== 'string' ||
      typeof profile.email !== 'string'
    ) {
      throw new Error('Máy chủ trả thông tin không hợp lệ. Vui lòng tải lại để kiểm tra.');
    }
    return profile;
  } catch (error) {
    if (signal?.aborted) throw error;
    if (controller.signal.aborted || error instanceof TypeError || error instanceof SyntaxError) {
      throw new Error(
        input
          ? 'Chưa xác nhận được kết quả lưu. Vui lòng đóng form và tải lại thông tin để kiểm tra.'
          : 'Không thể tải thông tin. Vui lòng kiểm tra kết nối và thử lại.',
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}

export function getProfile(token: string, signal?: AbortSignal) {
  return profileRequest(token, signal);
}

export function updateProfile(token: string, fullName: string, email: string) {
  return profileRequest(token, undefined, { fullName, email });
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  if (!token) {
    throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoints.auth.changePassword}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
      signal: controller.signal,
    });

    let result;

    try {
      result = await response.json();
    } catch {
      throw new Error('Máy chủ trả về dữ liệu không hợp lệ.');
    }

    if (!response.ok || result?.success !== true) {
      throw new Error(result?.message || 'Không thể đổi mật khẩu.');
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('Máy chủ phản hồi quá lâu. Vui lòng thử lại.');
    }

    if (error instanceof TypeError) {
      throw new Error('Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
