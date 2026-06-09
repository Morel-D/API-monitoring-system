import { Link } from 'react-router-dom';
import StatusBadge from '../../../components/ui/status-badge';
import type { RecentService } from '../../../types/dashbaord';
import { formatCheckedAt, resolveStatus } from '../helpers';
import { StatusDot } from '../../../components/ui/Statusdot';

interface RecentServicesListProps {
  services: RecentService[];
}

export function RecentServicesList({ services }: RecentServicesListProps) {
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <i className="ti ti-server text-3xl text-[#6b7280] mb-3" aria-hidden />
        <p className="text-[#e8eaf0] text-sm font-medium">No services yet</p>
        <Link to="/services" className="mt-3 text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
          Add your first service →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <div className="grid px-4 mb-1 gap-4" style={{ gridTemplateColumns: '10px 1fr 90px 110px 100px' }}>
        {['', 'Service', 'Status', 'Last response', 'Checked at'].map((h) => (
          <span key={h} className="text-[9px] uppercase tracking-[0.1em] text-[#6b7280]">{h}</span>
        ))}
      </div>

      {services.map((svc) => {
        const status = resolveStatus(svc);
        const isUp = status === 'UP';
        return (
          <div
            key={svc.id}
            className="bg-[#16191f] border border-white/[0.07] rounded-lg px-4 py-3 grid items-center gap-4 hover:border-white/[0.14] transition-colors"
            style={{ gridTemplateColumns: '10px 1fr 90px 110px 100px' }}
          >
            {/* Dot */}
            <StatusDot status={status} pulse />

            {/* Name + URL */}
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-[#e8eaf0] truncate">{svc.name}</p>
              <p className="text-[10px] text-[#6b7280] truncate">{svc.url}</p>
            </div>

            <div className='px-0'>
              <StatusBadge status={status} />
            </div>

            <span className={`text-[11px] font-mono tabular-nums ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {svc.lastResponse}
            </span>

            <span className="text-[11px] text-[#6b7280] font-mono">
              {svc.lastChecked == null || svc.lastChecked == "Never" ? "--" : formatCheckedAt(svc.lastChecked)}
            </span>
          </div>
        );
      })}
    </div>
  );
}