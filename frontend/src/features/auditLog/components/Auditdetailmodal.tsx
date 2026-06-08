import React, { useEffect } from 'react';
import type { AuditLog } from '../../../types/auditLog';
import { formatDate } from '../helper';
import { AuditActionBadge } from './Auditactionbadge';


interface AuditDetailModalProps {
  log:     AuditLog | null;
  onClose: () => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] uppercase tracking-[0.1em] text-[#6b7280]">{label}</span>
      <div className="text-[12px] text-[#e8eaf0] font-mono">{children}</div>
    </div>
  );
}

export function AuditDetailModal({ log, onClose }: AuditDetailModalProps) {
  const isOpen = log !== null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4 bg-[#16191f] border border-white/[0.1] rounded-xl shadow-2xl">

        <div className="flex items-start justify-between px-5 py-4 border-b border-white/[0.07]">
          <div>
            <h2 className="text-sm font-medium text-[#e8eaf0]">Audit log detail</h2>
            <p className="text-[11px] text-[#6b7280] mt-0.5 font-mono">#{log.id}</p>
          </div>
          <button onClick={onClose} className="text-[#6b7280] hover:text-[#e8eaf0] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <Row label="Action">
            <AuditActionBadge action={log.action} />
          </Row>

          {log.user && (
            <Row label="User">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-medium text-blue-400 uppercase">
                    {log.user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-[12px] text-[#e8eaf0]">{log.user.name}</p>
                  <p className="text-[10px] text-[#6b7280]">{log.user.email}</p>
                </div>
              </div>
            </Row>
          )}

          <Row label="Description">
            <p className="text-[12px] text-[#e8eaf0] font-sans leading-relaxed">{log.description}</p>
          </Row>

          {(log.entityType || log.entityId) && (
            <div className="grid grid-cols-2 gap-4">
              {log.entityType && <Row label="Entity type"><span className="text-[#6b7280]">{log.entityType}</span></Row>}
              {log.entityId   && <Row label="Entity ID"><span className="text-[#6b7280]">#{log.entityId}</span></Row>}
            </div>
          )}

          <Row label="Timestamp">
            <span className="text-[#6b7280]">{formatDate(log.createdAt)}</span>
          </Row>
        </div>

        <div className="flex justify-end px-5 py-4 border-t border-white/[0.07]">
          <button type="button" onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-[#6b7280] bg-[#1e222a] border border-white/[0.07] rounded-md hover:text-[#e8eaf0] hover:border-white/[0.15] transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}