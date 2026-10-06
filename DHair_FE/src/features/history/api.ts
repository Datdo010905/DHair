import { API_BASE_URL } from '@/services/apiClient';
import { endpoints } from '@/services/endpoints';

export const appointmentStatuses = ['Đã đặt', 'Đang chờ', 'Đang thực hiện', 'Hoàn thành', 'Đã huỷ', 'Đã đến'] as const;
export type AppointmentStatus = typeof appointmentStatuses[number];

export interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  salon: string;
  address: string;
  service: string;
  duration: number;
  price: number;
  details: {
    id: string;
    service: string;
    stylist: string;
    quantity: number;
    duration: number;
    price: number;
    note: string;
  }[];
}

interface HistoryResponse {
  appointments: Appointment[];
  cancellationReasons: string[];
}

async function historyRequest<T>(path: string, token: string, signal?: AbortSignal, body?: object): Promise<T> {
  if (!token) throw new Error('Vui lòng đăng xuất và đăng nhập lại để xem lịch hẹn.');
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort);
  if (signal?.aborted) abort();
  const timer = setTimeout(abort, 15000);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok || !result?.success) throw new Error(result?.message || 'Không thể xử lý lịch hẹn.');
    return result.data;
  } catch (error) {
    if (signal?.aborted) throw error;
    if (controller.signal.aborted || error instanceof TypeError || error instanceof SyntaxError) {
      throw new Error(body
        ? 'Chưa xác nhận được kết quả hủy. Vui lòng tải lại danh sách để kiểm tra.'
        : 'Không thể tải lịch hẹn. Vui lòng kiểm tra kết nối và thử lại.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}

export function getHistory(token: string, signal?: AbortSignal) {
  return historyRequest<HistoryResponse>(endpoints.booking.history, token, signal);
}

export function cancelAppointment(token: string, id: string, reason: string, otherReason: string) {
  return historyRequest<Appointment>(endpoints.booking.cancel(id), token, undefined, { reason, otherReason });
}
