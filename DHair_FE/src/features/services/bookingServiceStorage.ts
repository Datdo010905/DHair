import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Service } from './types';

const BOOKING_SERVICE_KEY = 'dhair:booking-service';
export type BookingService = Pick<Service, 'MADV' | 'TENDV' | 'GIADV' | 'THOIGIAN'>;

export async function saveBookingService(service: BookingService): Promise<void> {
  // Chỉ lưu các thông tin cần để tự điền dịch vụ vào form đặt lịch.
  const selection: BookingService = {
    MADV: service.MADV,
    TENDV: service.TENDV,
    GIADV: Number(service.GIADV),
    THOIGIAN: Number(service.THOIGIAN),
  };
  await AsyncStorage.setItem(BOOKING_SERVICE_KEY, JSON.stringify(selection));
}

export async function getBookingService(): Promise<BookingService | null> {
  const storedValue = await AsyncStorage.getItem(BOOKING_SERVICE_KEY);
  if (!storedValue) return null;

  // Dữ liệu local có thể cũ hoặc không hợp lệ; không để lỗi JSON làm hỏng form.
  try {
    const service = JSON.parse(storedValue);
    if (
      !service ||
      typeof service.MADV !== 'string' || !service.MADV ||
      typeof service.TENDV !== 'string' ||
      typeof service.GIADV !== 'number' || !Number.isFinite(service.GIADV) ||
      typeof service.THOIGIAN !== 'number' || !Number.isFinite(service.THOIGIAN)
    ) {
      return null;
    }
    return service;
  } catch {
    return null;
  }
}
