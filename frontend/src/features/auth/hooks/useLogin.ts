import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../AuthStore';
import { formatAuthError, validateLogin, type FormErrors, type LoginFields } from '../validation';



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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLogin(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      await login(values);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(formatAuthError((err as Error).message));
    }
  };

  return { values, errors, serverError, loading, set, submit };
}