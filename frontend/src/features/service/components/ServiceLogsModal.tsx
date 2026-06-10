import { useEffect } from 'react';
import type { Service } from '../../../types';
import { useHealthLogs } from '../hooks/useHealthlogs';
import { formatLogDate, parseResponseTime } from '../validation';

interface ServiceLogsModalProps {
  service: Service | null;
  onClose: () => void;
}

export function ServiceLogsModal({ service, onClose }: ServiceLogsModalProps) {
  const { logs, loading, error, checking, fetchLogs, triggerCheck, bottomRef } =
    useHealthLogs(service);

  const isOpen = service !== null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else        document.body.style.overflow = '';
    return ()  => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Shared inner content ────────────────────────────────────
  const content = (
    <>
      {/* Table header — desktop only */}
      <div className="hidden lg:grid px-6 py-2 border-b border-white/[0.07] flex-shrink-0 bg-[#0e1014]"
        style={{ gridTemplateColumns: '1fr 80px 90px 100px 1fr' }}>
        {['Checked at', 'Status', 'Code', 'Response', 'Message'].map((h) => (
          <span key={h} className="text-[9px] uppercase tracking-[0.1em] text-[#6b7280]">{h}</span>
        ))}
      </div>

      {/* Log rows */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-3 space-y-2">

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
            <button type="button" onClick={fetchLogs}
              className="mt-3 text-[11px] text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded hover:bg-blue-500/10 transition-colors">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[#e8eaf0] text-sm font-medium">No logs yet</p>
            <p className="text-[13px] text-[#6b7280] mt-1">
              Hit <span className="text-blue-400">Check now</span> to run the first check.
            </p>
          </div>
        )}

        {!loading && !error && logs.map((log) => (
          <div key={log.id}>
            {/* Desktop row */}
            <div
              className={`hidden lg:grid items-center gap-4 px-3 py-2.5 rounded-lg border text-[11px] font-mono ${
                log.sucess ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-red-500/5 border-red-500/15'
              }`}
              style={{ gridTemplateColumns: '1fr 80px 90px 100px 1fr' }}
            >
              <span className="text-[#6b7280]">{formatLogDate(log.checkedAt)}</span>
              <span className={`font-medium ${log.sucess ? 'text-emerald-400' : 'text-red-400'}`}>
                {log.sucess ? '● UP' : '● DOWN'}
              </span>
              <span className={log.sucess ? 'text-emerald-400' : 'text-red-400'}>{log.statusCode}</span>
              <span className="text-[#6b7280]">{parseResponseTime(log.responseTime)}</span>
              <span className="text-[#6b7280] truncate">{log.message.replace(/_/g, ' ')}</span>
            </div>

            {/* Mobile card */}
            <div className={`lg:hidden rounded-lg border px-4 py-3 space-y-2 ${
              log.sucess ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-red-500/5 border-red-500/15'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-mono font-medium ${log.sucess ? 'text-emerald-400' : 'text-red-400'}`}>
                  {log.sucess ? '● UP' : '● DOWN'}
                </span>
                <span className="text-[10px] text-[#6b7280] font-mono">{formatLogDate(log.checkedAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-mono ${log.sucess ? 'text-emerald-400' : 'text-red-400'}`}>
                  {log.statusCode} · {parseResponseTime(log.responseTime)}
                </span>
                <span className="text-[10px] text-[#6b7280] truncate max-w-[160px]">
                  {log.message.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-t border-white/[0.07] flex-shrink-0">
        <span className="text-[11px] text-[#6b7280]">
          {logs.length} log{logs.length !== 1 ? 's' : ''}
        </span>
        <button
          type="button"
          onClick={triggerCheck}
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
    </>
  );

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ── Desktop — centered modal ──────────────────────── */}
      <div className="hidden lg:flex items-center justify-center h-full">
        <div className="relative z-10 w-full max-w-3xl mx-4 bg-[#16191f] border border-white/[0.1] rounded-xl shadow-2xl flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-white/[0.07] flex-shrink-0">
            <div>
              <h2 className="text-sm font-medium text-[#e8eaf0]">{service.name}</h2>
              <p className="text-[11px] text-[#6b7280] mt-0.5 font-mono">{service.url}</p>
            </div>
            <button type="button" onClick={onClose} className="text-[#6b7280] hover:text-[#e8eaf0] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {content}
        </div>
      </div>

      {/* ── Mobile — bottom sheet ─────────────────────────── */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 z-10 bg-[#16191f] border-t border-white/[0.1] rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-white/[0.07] flex-shrink-0">
          <div>
            <h2 className="text-sm font-medium text-[#e8eaf0]">{service.name}</h2>
            <p className="text-[10px] text-[#6b7280] mt-0.5 font-mono truncate max-w-[260px]">{service.url}</p>
          </div>
          <button type="button" onClick={onClose} className="text-[#6b7280] hover:text-[#e8eaf0] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {content}
      </div>
    </div>
  );
}