import { useMemo, useState } from 'react';
import type { Service, ServiceCategory } from './types';
import { useServices } from './useServices';

function normalizeSearchText(value: string) {
  // Bỏ dấu tiếng Việt để "cat toc" vẫn tìm được "Cắt tóc".
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim()
    .replace(/\s+/g, ' ');
}

export function filterServices(services: Service[], query: string, category: ServiceCategory) {
  const searchText = normalizeSearchText(query);

  return services.filter((service) => {
    if (category === 'hair' && service.LOAI !== 'CT') return false;
    if (category === 'skinCare' && service.LOAI !== 'CSD') return false;

    return normalizeSearchText(service.TENDV).includes(searchText);
  });
}

export function useServiceSearch() {
  const { services, isLoading, error, reload } = useServices('all');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('all');

  // Lọc dữ liệu đã lấy từ API, không gửi yêu cầu mới theo từng ký tự.
  const results = useMemo(
    () => filterServices(services, query, category),
    [services, query, category],
  );

  function resetFilters() {
    setQuery('');
    setCategory('all');
  }

  return {
    results,
    isLoading,
    error,
    reload,
    query,
    setQuery,
    category,
    setCategory,
    resetFilters,
  };
}
