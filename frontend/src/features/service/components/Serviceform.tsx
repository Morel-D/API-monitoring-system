import React from 'react';
import type { Service } from '../../../types';
import { useServiceForm } from '../hooks/useServiceform';
import { Input } from '../../../components/ui/input';

interface ServiceFormProps {
  initial?: Service;
  onDone:   () => void;
  onCancel: () => void;
  onRefresh?: () => void;  
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
        checked ? 'bg-blue-500' : 'bg-[#2a2f3a]'
      }`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] uppercase tracking-[0.08em] text-[#6b7280]">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

export function ServiceForm({ initial, onDone, onCancel }: ServiceFormProps) {
  const { values, errors, loading, set, submit } = useServiceForm(initial, onDone);

  return (
    <div className="space-y-5 pb-2 pt-1">

      <Field label="Service name" error={errors.name}>
        <Input
          placeholder="Auth API"
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
          hasError={!!errors.name}
        />
      </Field>

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
      {/* <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-[#0e1014] border border-white/[0.07]">
        <div>
          <p className="text-[12px] font-medium text-[#e8eaf0]">Auto monitoring</p>
          <p className="text-[11px] text-[#6b7280] mt-0.5">Automatically check on a schedule</p>
        </div>
        <Toggle checked={values.autoCheckEnabled} onChange={(v) => set('autoCheckEnabled', v)} />
      </div> */}

        {/* {values.autoCheckEnabled && (
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.1em] text-[#6b7280]">
              Check interval (minutes)
            </label>
            {errors.checkInterval && (
              <p className="text-[11px] text-red-400">{errors.checkInterval}</p>
            )}
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={values.checkInterval}
                onChange={(e) => set('checkInterval', Number(e.target.value))}
                className="w-24 h-9 bg-[#0e1014] border border-white/[0.07] rounded-md px-3 text-sm text-[#e8eaf0] font-mono focus:outline-none focus:border-blue-500/50 transition-colors"
              />
              <div className="flex gap-1.5">
                {[1, 5, 15, 30].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => set('checkInterval', p)}
                    className={`text-[10px] px-2.5 py-1.5 rounded border transition-all font-mono ${
                      values.checkInterval === p
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'text-[#6b7280] border-white/[0.07] hover:bg-[#1e222a] hover:text-[#e8eaf0]'
                    }`}
                  >
                    {p}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        )} */}

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
          onClick={submit}
          disabled={loading}
          className="px-5 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving…' : initial ? 'Save changes' : 'Add service'}
        </button>
      </div>
    </div>
  );
}