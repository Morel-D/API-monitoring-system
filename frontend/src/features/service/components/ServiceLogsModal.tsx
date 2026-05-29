import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Service } from '../../../types';
import { parseResponseTime, type HealthLog } from '../../../types/healthLog';
import { healthApi } from '../HealthAPi';

interface ServiceLogsModalProps {
  service: Service | null;    // null = closed
  onClose: () => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export const ServiceLogsModal: React.FC<ServiceLogsModalProps> = ({ service, onClose }) => {
  const [logs, setLogs]         = useState<HealthLog[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const isOpen                  = service !== null;

  // ── Fetch logs ────────────────────────────────────────────────
  const fetchLogs = useCallback(async () => {
    if (!service) return;
    setLoading(true);
    setError(null);
    try {
      const data = await healthApi.getLogs(service.id);
      setLogs(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    if (isOpen) {
      setLogs([]);
      fetchLogs();
    }
  }, [isOpen, fetchLogs]);

  // Scroll to bottom when new logs arrive
  useEffect(() => {
    if (logs.length) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // ── Trigger check ─────────────────────────────────────────────
  const handleCheck = async () => {
    if (!service || checking) return;
    setChecking(true);
    try {
      const newLog = await healthApi.triggerCheck(service.id);
      setLogs((prev) => [...prev, newLog]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setChecking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-3xl mx-4 bg-[#16191f] border border-white/[0.1] rounded-xl shadow-2xl flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-white/[0.07] flex-shrink-0">
          <div>
            <h2 className="text-sm font-medium text-[#e8eaf0]">{service.name}</h2>
            <p className="text-[11px] text-[#6b7280] mt-0.5 font-mono">{service.url}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#6b7280] hover:text-[#e8eaf0] transition-colors mt-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Log table header */}
        <div
          className="grid px-6 py-2 border-b border-white/[0.07] flex-shrink-0 bg-[#0e1014]"
          style={{ gridTemplateColumns: '1fr 80px 90px 100px 1fr' }}
        >
          {['Checked at', 'Status', 'Code', 'Response', 'Message'].map((h) => (
            <span key={h} className="text-[9px] uppercase tracking-[0.1em] text-[#6b7280]">{h}</span>
          ))}
        </div>

        {/* Log rows */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-1.5">

          {loading && (
            <div className="flex items-center justify-center py-16 gap-2 text-[#6b7280]">
              <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-[13px]">Loading logs…</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-red-400 text-sm font-medium">Failed to load logs</p>
              <p className="text-[12px] text-[#6b7280] mt-1">{error}</p>
              <button
                onClick={fetchLogs}
                className="mt-3 text-[11px] text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded hover:bg-blue-500/10 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && logs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[#e8eaf0] text-sm font-medium">No logs yet</p>
              <p className="text-[13px] text-[#6b7280] mt-1">
                Hit <span className="text-blue-400">Check now</span> below to run the first check.
              </p>
            </div>
          )}

          {!loading && !error && logs.map((log) => {
            const ok = log.sucess;
            return (
              <div
                key={log.id}
                className={`grid items-center gap-4 px-3 py-2.5 rounded-lg border text-[11px] font-mono
                  ${ok
                    ? 'bg-emerald-500/5 border-emerald-500/15'
                    : 'bg-red-500/5 border-red-500/15'
                  }`}
                style={{ gridTemplateColumns: '1fr 80px 90px 100px 1fr' }}
              >
                <span className="text-[#6b7280]">{formatDate(log.checkedAt)}</span>

                <span className={`font-medium ${ok ? 'text-emerald-400' : 'text-red-400'}`}>
                  {ok ? '● UP' : '● DOWN'}
                </span>

                <span className={ok ? 'text-emerald-400' : 'text-red-400'}>
                  {log.statusCode}
                </span>

                <span className="text-[#6b7280]">
                  {parseResponseTime(log.responseTime)}
                </span>

                <span className="text-[#6b7280] truncate">
                  {log.message.replace(/_/g, ' ')}
                </span>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* Footer — Check button */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.07] flex-shrink-0">
          <span className="text-[11px] text-[#6b7280]">
            {logs.length} log{logs.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={handleCheck}
            disabled={checking}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[12px] font-medium px-5 py-2 rounded-md transition-colors"
          >
            {checking ? (
              <>
                <svg className="animate-spin size-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Checking…
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
                Check now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};