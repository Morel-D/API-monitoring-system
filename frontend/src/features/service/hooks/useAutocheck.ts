import { useEffect, useState } from 'react';
import { useServiceStore } from '../serviceStore';
import type { Service } from '../../../types';
import { validateAutoCheck } from '../validation';
import { toastError, toastSuccess } from '../../../utils/widgets/toast/Toaststore';

export function useAutoCheck(service: Service | null, onDone: () => void) {
  const { updateAutoCheck } = useServiceStore();

  const [enabled, setEnabled]   = useState(false);
  const [interval, setInterval] = useState(5);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (service) {
      setEnabled(service.autoCheckEnable);
      setInterval(service.checkInterval ?? 5);
      setError(null);
    }
  }, [service]);

  const submit = async () => {
    const err = validateAutoCheck(enabled, interval);
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      await updateAutoCheck(service!.id, { enabled, intervalMinutes: interval });
      toastSuccess('done');
      onDone();
    } catch (e) {
      toastError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { enabled, setEnabled, interval, setInterval, error, loading, submit };
}