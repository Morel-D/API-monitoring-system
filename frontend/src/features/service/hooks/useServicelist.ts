import { useEffect, useState } from 'react';
import { resolveStatus, type Service, type ServiceStatus } from '../../../types';
import { useServiceStore } from '../serviceStore';
import { toastError, toastSuccess } from '../../../utils/widgets/toast/Toaststore';
import { getCorrelationId } from '../../../utils/errors';


export type ServiceFilter = 'ALL' | ServiceStatus;
 
export function useServiceList() {
  const {
    paged, currentPage, loading, error,
    fetchPage, refresh, goTo, goNext, goPrev,
    remove, triggerCheck, checkingIds,
  } = useServiceStore();
 
  const [filter, setFilter]             = useState<ServiceFilter>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleting, setDeleting]         = useState(false);
 
  // Initial fetch
  useEffect(() => { fetchPage(0); }, [fetchPage]);
 
  const services = paged?.content ?? [];
 
  const filtered = filter === 'ALL'
    ? services
    : services.filter((s) => resolveStatus(s.status) === filter);
 
  const count = (v: ServiceFilter) =>
    v === 'ALL'
      ? (paged?.totalElements ?? 0)
      : services.filter((s) => resolveStatus(s.status) === v).length;
 
  const handleDelete = async () => {
    if (deleteTarget === null) return;
    setDeleting(true);
    try {
      await remove(deleteTarget);   // store auto-refreshes
      toastSuccess('done');
      setDeleteTarget(null);
    } catch (e) {
      toastError((e as Error).message, getCorrelationId(e));
    } finally {
      setDeleting(false);
    }
  };
 
  const handleCheck = async (id: number) => {
    try {
      await triggerCheck(id);       // store auto-refreshes
      toastSuccess('done');
    } catch (e) {
      toastError((e as Error).message, getCorrelationId(e));
    }
  };
 
  return {
    paged,
    services,
    filtered,
    loading,
    error,
    filter,
    setFilter,
    count,
    page: currentPage,
    goTo,
    goNext,
    goPrev,
    fetchAll: refresh,
    checkingIds,
    handleCheck,
    deleteTarget,
    setDeleteTarget,
    deleting,
    handleDelete,
  };
}
 