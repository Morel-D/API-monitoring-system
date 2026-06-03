import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../AuthStore';
import { formatAuthError, validateRegister, type FormErrors, type RegisterFields } from '../validation';


export function useRegister() {
  const navigate              = useNavigate();
  const { register, loading } = useAuthStore();

  const [values, setValues] = useState<RegisterFields>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors<RegisterFields>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (field: keyof RegisterFields, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setServerError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateRegister(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      await register(values);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(formatAuthError((err as Error).message));
    }
  };

  return { values, errors, serverError, loading, set, submit };
}