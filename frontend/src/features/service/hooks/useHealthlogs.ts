import { useCallback, useEffect, useRef, useState } from 'react';
import type { Service } from '../../../types';
import type { HealthLog } from '../../../types/healthLog';
import { toastSuccess, toastError } from '../../../utils/widgets/toast/Toaststore';
import { serviceApi } from '../ServiceApi';
import { getCorrelationId } from '../../../utils/errors';
import type { PagedResponse } from '../../../types/pagination';
import { useServiceStore } from '../serviceStore';

const PAGE_SIZE = 10;
 
export function useHealthLogs(service: Service | null) {
  const [paged, setPaged]         = useState<PagedResponse<HealthLog> | null>(null);
  const [page, setPage]           = useState(0);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [checking, setChecking]   = useState(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);
 
  const fetchPage = useCallback(async (p: number) => {
    if (!service) return;
    setLoading(true);
    setError(null);
    try {
      const data = await serviceApi.getHealthLogs(service.id, p, PAGE_SIZE);
      setPaged(data);
    } catch (e) {
      setError((e as Error).message);
      toastError((e as Error).message, getCorrelationId(e));
    } finally {
      setLoading(false);
    }
  }, [service]);
 
  useEffect(() => {
    if (service) { setPaged(null); setPage(0); fetchPage(0); }
  }, [service, fetchPage]);
 
  useEffect(() => {
    if (page > 0) fetchPage(page);
  }, [page, fetchPage]);
 
  const goTo   = (p: number) => setPage(p);
  const goNext = () => { if (paged && !paged.last)  setPage((p) => p + 1); };
  const goPrev = () => { if (paged && !paged.first) setPage((p) => p - 1); };
 
  const triggerCheck = async () => {
    if (!service || checking) return;
    setChecking(true);
    try {
      await serviceApi.triggerCheck(service.id);
      toastSuccess('done');
      // Refresh first page to see latest log
      setPage(0);
      fetchPage(0);

      useServiceStore.getState().refresh();
    } catch (e) {
      toastError((e as Error).message, getCorrelationId(e));
    } finally {
      setChecking(false);
    }
  };
 
  return {
    paged,
    logs: paged?.content ?? [],
    loading,
    error,
    checking,
    page,
    goTo,
    goNext,
    goPrev,
    fetchLogs: () => fetchPage(page),
    triggerCheck,
    bottomRef,
  };
}