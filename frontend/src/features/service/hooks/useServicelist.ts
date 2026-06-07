import { useCallback, useEffect, useState } from 'react';
import { resolveStatus, type ServiceStatus } from '../../../types';
import { useServiceStore } from '../serviceStore';
import { toastError, toastSuccess } from '../../../utils/widgets/toast/Toaststore';
import { getCorrelationId } from '../../../utils/errors';


export type ServiceFilter = 'ALL' | ServiceStatus;

export function useServiceList() {
  const {
    services, loading, error,
    fetchAll, remove, triggerCheck, checkingIds,
  } = useServiceStore();

  const [filter, setFilter] = useState<ServiceFilter>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = filter === 'ALL'
    ? services
    : services.filter((s) => resolveStatus(s.status) === filter);

  const count = (v: ServiceFilter) =>
    v === 'ALL'
      ? services.length
      : services.filter((s) => resolveStatus(s.status) === v).length;

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

  const handleCheck = useCallback(async (id: number) => {
    try {
      await triggerCheck(id);
      toastSuccess('done');
    } catch (e) {
      toastError((e as Error).message, getCorrelationId(e));
    }
  }, [triggerCheck]);

  return {
    services,
    filtered,
    loading,
    error,
    filter,
    setFilter,
    count,
    fetchAll,
    checkingIds,
    handleCheck,
    deleteTarget,
    setDeleteTarget,
    deleting,
    handleDelete,
  };
}