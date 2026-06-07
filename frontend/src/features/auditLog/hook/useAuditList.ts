import { useCallback, useEffect, useState } from 'react';
import type { AuditLog } from '../../../types/auditLog';
import { ACTION_META, type AuditFilter } from '../helper';
import { auditApi } from '../AudtApi';
import { toastError } from '../../../utils/widgets/toast/Toaststore';
import { getCorrelationId } from '../../../utils/errors';


export function useAuditList() {
  const [logs, setLogs]       = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [filter, setFilter]   = useState<AuditFilter>('ALL');
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditApi.getAll();
      setLogs(data);
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      toastError(msg, getCorrelationId(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = filter === 'ALL'
    ? logs
    : logs.filter((l) => ACTION_META[l.action]?.category === filter);

  const count = (v: AuditFilter) =>
    v === 'ALL'
      ? logs.length
      : logs.filter((l) => ACTION_META[l.action]?.category === v).length;

  return {
    logs,
    filtered,
    loading,
    error,
    filter,
    setFilter,
    count,
    fetchAll,
    selected,
    setSelected,
  };
}