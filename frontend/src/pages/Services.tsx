import { useState } from 'react';
import { DUMMY_SERVICES } from '../data/services';
import type { ServiceStatus } from '../types';
import { StatusDot } from '../components/ui/Statusdot';
import StatusBadge from '../components/ui/status-badge';

type Filter = 'ALL' | ServiceStatus;

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All',     value: 'ALL'     },
  { label: 'Up',      value: 'UP'      },
  { label: 'Down',    value: 'DOWN'    },
  { label: 'Slow',    value: 'SLOW'    },
  { label: 'Unknown', value: 'UNKNOWN' },
];

const COLS = '20px 1fr 90px 110px 80px 100px 110px';

export function ServicesPage() {
  const [filter, setFilter] = useState<Filter>('ALL');

  const filtered = filter === 'ALL'
    ? DUMMY_SERVICES
    : DUMMY_SERVICES.filter((s) => s.status === filter);

  const count = (v: Filter) =>
    v === 'ALL' ? DUMMY_SERVICES.length : DUMMY_SERVICES.filter((s) => s.status === v).length;

  const latencyColor = (status: ServiceStatus) =>
    status === 'DOWN' ? 'text-red-400' : status === 'SLOW' ? 'text-amber-400' : 'text-emerald-400';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-[#16191f] border-b border-white/[0.07] flex-shrink-0">
        <div>
          <h1 className="text-sm font-medium text-[#e8eaf0]">Services</h1>
          <p className="text-[11px] text-[#6b7280]">Manage and monitor your API endpoints</p>
        </div>
        <button className="flex items-center gap-1.5 bg-blue-500 text-white text-[11px] font-medium px-3.5 py-2 rounded-md hover:bg-blue-400 transition-colors">
          <i className="ti ti-plus text-[13px]" aria-hidden /> Add Service
        </button>
      </header>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-white/[0.07] bg-[#0e1014] flex-shrink-0">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={
              'text-[10px] px-3 py-1.5 rounded border transition-all ' +
              (filter === f.value
                ? 'bg-[#1e222a] text-[#e8eaf0] border-white/[0.15]'
                : 'text-[#6b7280] border-white/[0.07] hover:bg-[#1e222a] hover:text-[#e8eaf0]')
            }
          >
            {f.label} ({count(f.value)})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Header */}
        <div className="grid px-4 mb-2 gap-3" style={{ gridTemplateColumns: COLS }}>
          {['', 'Service', 'Status', 'Last check', 'Latency', 'Uptime 7d', 'Actions'].map((h) => (
            <span key={h} className="text-[9px] uppercase tracking-[0.1em] text-[#6b7280]">{h}</span>
          ))}
        </div>

        <div className="space-y-1.5">
          {filtered.map((svc) => (
            <div
              key={svc.id}
              className="bg-[#16191f] border border-white/[0.07] rounded-lg px-4 py-3.5 grid items-center gap-3 hover:border-white/[0.14] transition-colors"
              style={{ gridTemplateColumns: COLS }}
            >
              <StatusDot status={svc.status} pulse />

              <div className="min-w-0">
                <p className="text-[12px] font-medium text-[#e8eaf0] truncate">{svc.name}</p>
                <p className="text-[10px] text-[#6b7280] truncate">{svc.url}</p>
              </div>

              <StatusBadge status={svc.status} />

              <span className="text-[11px] text-[#6b7280] font-mono">{svc.lastCheck}</span>

              <span className={`text-[11px] font-mono tabular-nums ${latencyColor(svc.status)}`}>
                {svc.latency}
              </span>

              <div>
                {svc.uptime > 0 ? (
                  <>
                    <p className="text-[10px] text-[#6b7280] mb-1">{svc.uptime.toFixed(1)}%</p>
                    <div className="h-1 bg-[#1e222a] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${svc.uptime}%` }} />
                    </div>
                  </>
                ) : (
                  <span className="text-[10px] text-[#6b7280]">—</span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button className="flex items-center gap-1 text-[10px] text-[#6b7280] bg-[#1e222a] border border-white/[0.07] px-2.5 py-1 rounded hover:text-blue-400 hover:border-blue-500/30 transition-all">
                  <i className="ti ti-player-play text-[10px]" aria-hidden /> Check
                </button>
                <button className="text-[10px] text-[#6b7280] bg-[#1e222a] border border-white/[0.07] px-2 py-1 rounded hover:text-[#e8eaf0] transition-all" aria-label="Edit">
                  <i className="ti ti-edit text-[11px]" aria-hidden />
                </button>
                <button className="text-[10px] text-[#6b7280] bg-[#1e222a] border border-white/[0.07] px-2 py-1 rounded hover:text-red-400 hover:border-red-500/30 transition-all" aria-label="Delete">
                  <i className="ti ti-trash text-[11px]" aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}