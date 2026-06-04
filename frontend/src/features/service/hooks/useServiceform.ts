import { useState } from 'react';
import type { Service, ServiceFormValues } from '../../../types';
import { useServiceStore } from '../serviceStore';
import { toastError, toastSuccess } from '../../../utils/widgets/toast/Toaststore';
import { validateServiceForm, type ServiceFormErrors } from '../validation';

const DEFAULTS: ServiceFormValues = {
  name:            '',
  url:             '',
  autoCheckEnable: false,
  checkInterval:   5,
};

export function useServiceForm(initial?: Service, onDone?: () => void) {
  const { create, update } = useServiceStore();

  const [values, setValues] = useState<ServiceFormValues>({
    name:            initial?.name            ?? DEFAULTS.name,
    url:             initial?.url             ?? DEFAULTS.url,
    autoCheckEnable: initial?.autoCheckEnable ?? DEFAULTS.autoCheckEnable,
    checkInterval:   initial?.checkInterval   ?? DEFAULTS.checkInterval,
  });
  const [errors, setErrors]   = useState<ServiceFormErrors>({});
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof ServiceFormValues>(key: K, value: ServiceFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e: any) => ({ ...e, [key]: undefined }));
  };

  const submit = async () => {
    const errs = validateServiceForm(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (initial) {
        await update(initial.id, values);
        toastSuccess('done');
      } else {
        await create(values);
        toastSuccess('done');
      }
      onDone?.();
    } catch (e) {
      toastError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setValues(DEFAULTS);
    setErrors({});
  };

  return { values, errors, loading, set, submit, reset };
}