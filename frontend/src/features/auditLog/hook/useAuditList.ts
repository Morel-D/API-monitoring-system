import { useCallback, useEffect, useState } from 'react';
import type { AuditLog } from '../../../types/auditLog';
import { ACTION_META, type AuditFilter } from '../helper';
import { auditApi } from '../AudtApi';
import { toastError } from '../../../utils/widgets/toast/Toaststore';
import { getCorrelationId } from '../../../utils/errors';
import type { PagedResponse } from '../../../types/pagination';


const PAGE_SIZE = 10;
 
export function useAuditList() {
  const [page, setPage]         = useState(0);
  const [paged, setPaged]       = useState<PagedResponse<AuditLog> | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [filter, setFilter]     = useState<AuditFilter>('ALL');
  const [selected, setSelected] = useState<AuditLog | null>(null);
 
  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditApi.getAll(p, PAGE_SIZE);
      setPaged(data);
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      toastError(msg, getCorrelationId(e));
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => { fetchPage(page); }, [fetchPage, page]);
 
  const goTo    = (p: number) => setPage(p);
  const goNext  = () => { if (paged && !paged.last)  setPage((p) => p + 1); };
  const goPrev  = () => { if (paged && !paged.first) setPage((p) => p - 1); };
 
  // Client-side category filter on current page content
  const filtered = (paged?.content ?? []).filter((l) =>
    filter === 'ALL' ? true : ACTION_META[l.action]?.category === filter
  );
 
  const handleFilterChange = (f: AuditFilter) => {
    setFilter(f);
    // Reset to first page when filter changes
    if (page !== 0) setPage(0); else fetchPage(0);
  };
 
  return {
    paged,
    filtered,
    loading,
    error,
    filter,
    setFilter: handleFilterChange,
    page,
    goTo,
    goNext,
    goPrev,
    fetchAll: () => fetchPage(page),
    selected,
    setSelected,
  };
}
 