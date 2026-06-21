import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../AuthStore';
import { formatAuthError, validateLogin, type FormErrors, type LoginFields } from '../validation';
import { toastError, toastSuccess } from '../../../utils/widgets/toast/Toaststore';
import { getCorrelationId } from '../../../utils/errors';



export function useLogin() {
  const navigate           = useNavigate();
  const { login, loading } = useAuthStore();

  const [values, setValues] = useState<LoginFields>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors<LoginFields>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (field: keyof LoginFields, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setServerError(null);
  };

  const submit = async () => {
    const errs = validateLogin(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      await login(values);
      toastSuccess('done');
      navigate('/', { replace: true });
    } catch (err) {
      const msg = (err as Error).message;
      setServerError(formatAuthError(msg));
      toastError(msg, getCorrelationId(err));
    }
  };

  return { values, errors, serverError, loading, set, submit };
}