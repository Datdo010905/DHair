import { useCallback, useEffect, useState } from 'react';
import { getServices } from './api';
import type { Service, ServiceCategory } from './types';

export function useServices(category: ServiceCategory) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  // Thay đổi bộ đếm để useEffect gọi lại API của nhóm dịch vụ hiện tại.
  const reload = useCallback(() => {
    setReloadCount((count) => count + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      setIsLoading(true);
      setError(null);
      setServices([]);

      try {
        const serviceList = await getServices(category, controller.signal);

        if (!controller.signal.aborted) {
          setServices(serviceList);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          const message = error instanceof Error ? error.message : 'Không thể tải dịch vụ.';
          setError(message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadServices();

    // Hủy yêu cầu cũ khi đổi nhóm, tải lại hoặc khi component bị gỡ khỏi màn hình.
    return () => {
      controller.abort();
    };
  }, [category, reloadCount]);

  return { services, isLoading, error, reload };
}
