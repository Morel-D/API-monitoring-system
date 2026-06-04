import { useCallback, useEffect, useState } from 'react';
import type { DashboardMetrics } from '../../../types/dashbaord';
import { dashboardApi } from '../DashbaordApi';
import { toastError } from '../../../utils/widgets/toast/Toaststore';


export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getMetrics();
      setMetrics(data);
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  return { metrics, loading, error, fetchMetrics };
}