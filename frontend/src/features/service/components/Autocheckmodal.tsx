import React, { useEffect, useState } from 'react';
import type { Service } from '../../../types';
import { servicesApi } from '../ServiceApi';

interface AutoCheckModalProps {
  service: Service | null;   // null = closed
  onClose: () => void;
   onSaved: () => void;
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
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export const AutoCheckModal: React.FC<AutoCheckModalProps> = ({ service, onClose, onSaved }) => {
  const [enabled, setEnabled]     = useState(false);
  const [interval, setInterval]   = useState(5);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const isOpen = service !== null;

  // Sync state when service changes
  useEffect(() => {
    if (service) {
      setEnabled(service.autoCheckEnable);
      setInterval(service.checkInterval ?? 5);
      setError(null);
    }
  }, [service]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (interval < 1) { setError('Interval must be at least 1 minute.'); return; }
    setSaving(true);
    setError(null);
    try {
      await servicesApi.updateAutoCheck(service.id, {
        enabled,
        intervalMinutes: interval,
      });
      onClose();
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm mx-4 bg-[#16191f] border border-white/[0.1] rounded-xl shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-white/[0.07]">
          <div>
            <h2 className="text-sm font-medium text-[#e8eaf0]">Auto monitoring</h2>
            <p className="text-[11px] text-[#6b7280] mt-0.5 font-mono truncate max-w-[200px]">
              {service.name}
            </p>
          </div>
          <button onClick={onClose} className="text-[#6b7280] hover:text-[#e8eaf0] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5">

          {/* Toggle row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-[#e8eaf0]">
                {enabled ? 'Monitoring enabled' : 'Monitoring disabled'}
              </p>
              <p className="text-[11px] text-[#6b7280] mt-0.5">
                {enabled
                  ? `Checking every ${interval} minute${interval !== 1 ? 's' : ''}`
                  : 'No automatic checks scheduled'}
              </p>
            </div>
            <Toggle checked={enabled} onChange={setEnabled} />
          </div>

          {/* Status indicator */}
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border ${
            enabled
              ? 'bg-emerald-500/5 border-emerald-500/15'
              : 'bg-[#0e1014] border-white/[0.07]'
          }`}>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
              enabled ? 'bg-emerald-400 animate-pulse' : 'bg-[#2a2f3a]'
            }`} />
            <span className="text-[11px] text-[#6b7280]">
              {enabled ? 'Auto-check is active' : 'Auto-check is paused'}
            </span>
          </div>

          {/* Interval — only when enabled */}
          {enabled && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.1em] text-[#6b7280]">
                Check interval (minutes)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={interval}
                  onChange={(e) => {
                    setInterval(Number(e.target.value));
                    setError(null);
                  }}
                  className="w-24 h-9 bg-[#0e1014] border border-white/[0.07] rounded-md px-3 text-sm text-[#e8eaf0] font-mono focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                {/* Quick presets */}
                <div className="flex gap-1.5">
                  {[1, 5, 15, 30].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setInterval(preset)}
                      className={`text-[10px] px-2.5 py-1.5 rounded border transition-all font-mono ${
                        interval === preset
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'text-[#6b7280] border-white/[0.07] hover:bg-[#1e222a] hover:text-[#e8eaf0]'
                      }`}
                    >
                      {preset}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-white/[0.07]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#6b7280] hover:text-[#e8eaf0] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};