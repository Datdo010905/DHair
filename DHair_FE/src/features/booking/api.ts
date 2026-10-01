import { API_BASE_URL, apiGet } from '@/services/apiClient';
import { endpoints } from '@/services/endpoints';

export interface BookingOptions {
  branches: { MACHINHANH: string; TENCHINHANH: string | null; DIACHI: string | null }[];
  stylists: { MANV: string; HOTEN: string }[];
  today: string;
  lastDay: string;
}

export interface AvailabilityInput {
  branchId: string;
  staffId: string;
  serviceId: string;
  date: string;
}

export interface Availability {
  duration: number;
  price: number;
  slots: { time: string; endTime: string }[];
}

export function getBookingOptions(branchId: string, signal?: AbortSignal) {
  return apiGet<BookingOptions>(
    `${endpoints.booking.options}?branchId=${encodeURIComponent(branchId)}`, signal,
  );
}

export function getAvailability(input: AvailabilityInput, signal?: AbortSignal) {
  const query = Object.entries(input)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  return apiGet<Availability>(`${endpoints.booking.availability}?${query}`, signal);
}

export async function createBooking(input: AvailabilityInput & {
  accountId: string;
  time: string;
  note: string;
}): Promise<{ MALICH: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${API_BASE_URL}${endpoints.booking.create}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error('Chưa xác nhận được kết quả đặt lịch. Vui lòng kiểm tra với salon trước khi đặt lại.');
    }
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Không thể đặt lịch. Vui lòng thử lại.');
    }
    if (typeof result.data?.MALICH !== 'string') {
      throw new Error('Máy chủ chưa trả mã lịch hẹn. Vui lòng kiểm tra với salon trước khi đặt lại.');
    }
    return result.data;
  } catch (error) {
    if (controller.signal.aborted || error instanceof TypeError) {
      throw new Error('Chưa xác nhận được kết quả đặt lịch. Vui lòng kiểm tra với salon trước khi đặt lại.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
