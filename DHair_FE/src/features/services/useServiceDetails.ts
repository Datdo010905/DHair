import { useCallback, useEffect, useState } from 'react';
import { getServiceById } from './api';
import type { Service } from './types';

export function useServiceDetails(id: string) {
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadService() {
      setIsLoading(true);
      setService(null);
      setError(null);
      try {
        if (!id) throw new Error('Thiếu mã dịch vụ.');
        const result = await getServiceById(id, controller.signal);
        if (!controller.signal.aborted) setService(result);
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error instanceof Error ? error.message : 'Không thể tải chi tiết dịch vụ.');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadService();
    return () => controller.abort();
  }, [id, reloadCount]);

  return { service, isLoading, error, reload };
}
