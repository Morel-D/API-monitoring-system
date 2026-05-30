import React, { useState } from 'react';
import type { Service, ServiceFormValues } from '../../../types';
import { Input } from '../../../components/ui/input';

interface ServiceFormProps {
  initial?: Service;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  onCancel: () => void;
}

function validate(v: ServiceFormValues): Partial<Record<keyof ServiceFormValues, string>> {
  const errors: Partial<Record<keyof ServiceFormValues, string>> = {};
  if (!v.name.trim()) errors.name = 'Name is required.';
  if (!v.url.trim()) {
    errors.url = 'URL is required.';
  } else {
    try { new URL(v.url); } catch { errors.url = 'Must be a valid URL.'; }
  }
  if (v.autoCheckEnable && (!v.checkInterval || v.checkInterval < 1)) {
    errors.checkInterval = 'Interval must be at least 1 minute.';
  }
  return errors;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ initial, onSubmit, onCancel }) => {
  const [values, setValues] = useState<ServiceFormValues>({
    name:             initial?.name             ?? '',
    url:              initial?.url              ?? '',
    autoCheckEnable:  initial?.autoCheckEnable  ?? false,
    checkInterval:    initial?.checkInterval    ?? 5,
  });
  const [errors, setErrors]       = useState<Partial<Record<keyof ServiceFormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = <K extends keyof ServiceFormValues>(key: K, value: ServiceFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (e) {
      setServerError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pb-2 pt-1">

      {/* Name */}
      <Field label="Service name" error={errors.name}>
        <Input
          placeholder="Auth API"
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
          hasError={!!errors.name}
        />
      </Field>

      {/* URL */}
      <Field label="Endpoint URL" error={errors.url}>
        <Input
          type="url"
          placeholder="https://api.example.com/health"
          value={values.url}
          onChange={(e) => set('url', e.target.value)}
          hasError={!!errors.url}
        />
      </Field>

      {/* Auto-check toggle */}
      <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-[#0e1014] border border-white/[0.07]">
        <div>
          <p className="text-[12px] font-medium text-[#e8eaf0]">Auto monitoring</p>
          <p className="text-[11px] text-[#6b7280] mt-0.5">
            Automatically check this service on a schedule
          </p>
        </div>
        <Toggle
          checked={values.autoCheckEnable}
          onChange={(v) => set('autoCheckEnable', v)}
        />
      </div>

      {/* Interval — only shown when auto-check is on */}
      {values.autoCheckEnable && (
        <Field label="Check interval (minutes)" error={errors.checkInterval}>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={1}
              value={values.checkInterval}
              onChange={(e) => set('checkInterval', Number(e.target.value))}
              hasError={!!errors.checkInterval}
              className="w-28"
            />
            <span className="text-[11px] text-[#6b7280]">
              Check every {values.checkInterval} minute{values.checkInterval !== 1 ? 's' : ''}
            </span>
          </div>
        </Field>
      )}

      {/* Server error */}
      {serverError && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
          {serverError}
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-[#6b7280] hover:text-[#e8eaf0] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving…' : initial ? 'Save changes' : 'Add service'}
        </button>
      </div>
    </div>
  );
};

// ── Toggle ────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-blue-500' : 'bg-[#2a2f3a]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ── Field ─────────────────────────────────────────────────────
function Field({
  label, error, children,
}: {
  label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] uppercase tracking-[0.08em] text-[#6b7280]">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}