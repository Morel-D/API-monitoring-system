import { useState } from "react";
import type { ServiceFormValues } from "../../types";

type Errors = Partial<Record<keyof ServiceFormValues, string>>;

const DEFAULTS: ServiceFormValues = {
    name: "",
    url: "",
};

function validate(values: ServiceFormValues): Errors {
  const errors: Errors = {};
 
  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }
 
  if (!values.url.trim()) {
    errors.url = "URL is required.";
  } else {
    try {
      new URL(values.url);
    } catch {
      errors.url = "Must be a valid URL (e.g. https://api.example.com/health).";
    }
  }
 
  return errors;
} 

export function useServiceForm(initial?: Partial<ServiceFormValues>) {
  const [values, setValues] = useState<ServiceFormValues>({
    ...DEFAULTS,
    ...initial,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ServiceFormValues, boolean>>>({});
 
  const set = (field: keyof ServiceFormValues, value: string | number) => {
    setValues((v) => ({ ...v, [field]: value }));
    // Clear error on change
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };
 
  const touch = (field: keyof ServiceFormValues) =>
    setTouched((t) => ({ ...t, [field]: true }));
 
  const isValid = (): boolean => {
    const errs = validate(values);
    setErrors(errs);
    setTouched(Object.fromEntries(Object.keys(DEFAULTS).map((k) => [k, true])));
    return Object.keys(errs).length === 0;
  };
 
  const reset = () => {
    setValues({ ...DEFAULTS, ...initial });
    setErrors({});
    setTouched({});
  };
 
  // Show error only if the field has been touched
  const fieldError = (field: keyof ServiceFormValues) =>
    touched[field] ? errors[field] : undefined;
 
  return { values, set, touch, isValid, reset, fieldError };
}