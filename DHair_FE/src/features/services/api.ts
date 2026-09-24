import { apiGet } from '@/services/apiClient';
import { endpoints } from '@/services/endpoints';
import type { Service, ServiceCategory } from './types';

export async function getServices(
  category: ServiceCategory,
  signal?: AbortSignal,
): Promise<Service[]> {
  // Mỗi nhóm dùng endpoint riêng: dịch vụ tóc hoặc chăm sóc da.
  const endpoint = endpoints.services[category];
  const services = await apiGet<Service[]>(endpoint, signal);

  if (!Array.isArray(services)) {
    throw new Error('Danh sách dịch vụ không hợp lệ.');
  }

  return services;
}
