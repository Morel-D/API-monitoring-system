import { useCallback, useEffect, useRef, useState } from 'react';
import type { Service } from '../../../types';
import type { HealthLog } from '../../../types/healthLog';
import { toastSuccess, toastError } from '../../../utils/widgets/toast/Toaststore';
import { serviceApi } from '../ServiceApi';
import { getCorrelationId } from '../../../utils/errors';

export function useHealthLogs(service: Service | null) {
  const [logs, setLogs]         = useState<HealthLog[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);

  const fetchLogs = useCallback(async () => {
    if (!service) return;
    setLoading(true);
    setError(null);
    try {
      const data = await serviceApi.getHealthLogs(service.id);
      setLogs(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    if (service) { setLogs([]); fetchLogs(); }
  }, [service, fetchLogs]);

  // Scroll to latest log
  useEffect(() => {
    if (logs.length) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  const triggerCheck = async () => {
    if (!service || checking) return;
    setChecking(true);
    try {
      const newLog = await serviceApi.triggerCheck(service.id);
      setLogs((prev) => [...prev, newLog]);
      toastSuccess('done');
    } catch (e) {
      toastError((e as Error).message, getCorrelationId(e));
    } finally {
      setChecking(false);
    }
  };

  return { logs, loading, error, checking, fetchLogs, triggerCheck, bottomRef };
}