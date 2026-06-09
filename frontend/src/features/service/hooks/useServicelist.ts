import { useEffect, useState } from 'react';
import {  type ServiceStatus } from '../../../types';
import { useServiceStore } from '../serviceStore';
import { toastError, toastSuccess } from '../../../utils/widgets/toast/Toaststore';
import { getCorrelationId } from '../../../utils/errors';
import { resolveStatus } from '../validation';


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
 
  useEffect(() => { fetchPage(0); }, [fetchPage]);
 
  const services = paged?.content ?? [];
 
  // Filter uses resolveStatus(svc) — reads latestSuccess, not svc.status
  const filtered = filter === 'ALL'
    ? services
    : services.filter((s) => resolveStatus(s) === filter);
 
  const count = (v: ServiceFilter) =>
    v === 'ALL'
      ? (paged?.totalElements ?? 0)
      : services.filter((s) => resolveStatus(s) === v).length;
 
  const handleDelete = async () => {
    if (deleteTarget === null) return;
    setDeleting(true);
    try {
      await remove(deleteTarget);
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
      await triggerCheck(id);
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
 