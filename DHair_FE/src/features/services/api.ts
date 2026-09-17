import { apiGet } from '@/services/apiClient';
import { endpoints } from '@/services/endpoints';
import type { Service, ServiceCategory } from './types';

export async function getServices(category: ServiceCategory, signal?: AbortSignal): Promise<Service[]> {
  const data = await apiGet<Service[]>(endpoints.services[category], signal);
  if (!Array.isArray(data)) throw new Error('Danh sách dịch vụ không hợp lệ.');
  return data;
}
