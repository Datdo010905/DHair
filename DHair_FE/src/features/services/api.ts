import { apiGet } from '@/services/apiClient';
import { endpoints } from '@/services/endpoints';
import type { Service, ServiceCategory } from './types';

export async function getServiceById(id: string, signal?: AbortSignal): Promise<Service> {
  const service = await apiGet<Service | null>(endpoints.services.detail(id), signal);
  if (!service || !service.MADV) {
    throw new Error('Không tìm thấy dịch vụ.');
  }
  return service;
}

export async function getServices(
  category: ServiceCategory,
  signal?: AbortSignal,
): Promise<Service[]> {
  // Chọn endpoint lấy tất cả dịch vụ đang cung cấp hoặc từng nhóm riêng.
  const endpoint = endpoints.services[category];
  const services = await apiGet<Service[]>(endpoint, signal);

  if (!Array.isArray(services)) {
    throw new Error('Danh sách dịch vụ không hợp lệ.');
  }

  return services;
}
