import { Link } from 'react-router-dom';
import StatusBadge from '../../../components/ui/status-badge';
import type { RecentService } from '../../../types/dashbaord';
import { formatCheckedAt, resolveStatus } from '../helpers';
import { StatusDot } from '../../../components/ui/Statusdot';

interface RecentServicesListProps {
  services: RecentService[];
}

export function RecentServicesList({ services }: RecentServicesListProps) {
  if (services.length === 0) { /* empty state unchanged */ }

  return (
    <div className="space-y-1.5">
      {/* Wrap table in horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Header */}
          <div className="grid px-4 mb-1 gap-4" style={{ gridTemplateColumns: '10px 1fr 90px 110px 100px' }}>
            {['', 'Service', 'Status', 'Last response', 'Checked at'].map((h) => (
              <span key={h} className="text-[9px] uppercase tracking-[0.1em] text-[#6b7280]">{h}</span>
            ))}
          </div>

          {services.map((svc) => {
            const status = resolveStatus(svc);
            const isUp   = status === 'UP';
            return (
              <div
                key={svc.id}
                className="bg-[#16191f] border border-white/[0.07] rounded-lg px-4 py-3 grid items-center gap-4 hover:border-white/[0.14] transition-colors mb-1.5"
                style={{ gridTemplateColumns: '10px 1fr 90px 110px 100px' }}
              >
                <span className="relative flex items-center justify-center w-2 h-2">
                  {isUp && <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-40 animate-ping" />}
                  <span className={`relative w-2 h-2 rounded-full ${isUp ? 'bg-emerald-400' : 'bg-red-400'}`} />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-[#e8eaf0] truncate">{svc.name}</p>
                  <p className="text-[10px] text-[#6b7280] truncate">{svc.url}</p>
                </div>
                <div className='wx-1'>
                  <StatusBadge status={status} />
                </div>
                <span className={`text-[11px] font-mono tabular-nums ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {svc.lastResponse}
                </span>
                <span className="text-[11px] text-[#6b7280] font-mono">
                  {formatCheckedAt(svc.lastChecked)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}