import { useCallback, useEffect, useState } from 'react';
import { getServices } from './api';
import type { Service, ServiceCategory } from './types';

export function useServices(category: ServiceCategory) {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt(value => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    getServices(category, controller.signal)
      .then(services => {
        if (!controller.signal.aborted) setData(services);
      })
      .catch(reason => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : 'Không thể tải dịch vụ.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [category, attempt]);

  return { data, loading, error, retry };
}
