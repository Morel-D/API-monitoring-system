import { Link } from 'react-router-dom';
import { StatusDot } from '../components/ui/Statusdot';
import StatusBadge from '../components/ui/status-badge';
import { DUMMY_SERVICES } from '../data/services';

const stats = [
  { label: 'Total Services',    value: '8',    sub: '2 environments',     valueColor: '' },
  { label: 'Operational',       value: '6',    sub: '↑ 75% uptime rate',  valueColor: 'text-emerald-400' },
  { label: 'Down / Degraded',   value: '2',    sub: '1 down · 1 slow',    valueColor: 'text-red-400' },
  { label: 'Avg Response',      value: '142ms', sub: '↓ 12ms from avg',   valueColor: '' },
];

const recent = DUMMY_SERVICES.slice(0, 5);

export function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-[#16191f] border-b border-white/[0.07] flex-shrink-0">
        <div>
          <h1 className="text-sm font-medium text-[#e8eaf0]">Dashboard</h1>
          <p className="text-[11px] text-[#6b7280]">Overview of all monitored services</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400">Live</span>
          <button className="flex items-center gap-1.5 text-[11px] text-[#6b7280] bg-[#1e222a] border border-white/[0.07] px-3 py-1.5 rounded-md hover:text-[#e8eaf0] transition-colors">
            <i className="ti ti-refresh text-[13px]" aria-hidden /> Refresh
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#16191f] border border-white/[0.07] rounded-lg px-4 py-3.5">
              <p className="text-[10px] uppercase tracking-[0.1em] text-[#6b7280] mb-2">{s.label}</p>
              <p className={`text-[22px] font-medium leading-none ${s.valueColor || 'text-[#e8eaf0]'}`}>{s.value}</p>
              <p className="text-[10px] mt-1 text-[#6b7280]">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Recent services */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-[0.1em] text-[#6b7280]">Recent services</span>
            <Link to="/services" className="text-[10px] text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors">
              View all <i className="ti ti-arrow-right text-[11px]" aria-hidden />
            </Link>
          </div>

          <div className="space-y-1.5">
            {recent.map((svc) => (
              <div
                key={svc.id}
                className="bg-[#16191f] border border-white/[0.07] rounded-lg px-4 py-3 grid items-center gap-3 hover:border-white/[0.14] transition-colors"
                style={{ gridTemplateColumns: '20px 1fr auto auto auto' }}
              >
                <StatusDot status={svc.status} pulse />
                <div>
                  <p className="text-[12px] font-medium text-[#e8eaf0]">{svc.name}</p>
                  <p className="text-[10px] text-[#6b7280] truncate">{svc.url}</p>
                </div>
                <span className="text-[12px] text-[#6b7280] font-mono tabular-nums">{svc.latency}</span>
                <StatusBadge status={svc.status} />
                <button className="flex items-center gap-1.5 text-[10px] text-[#6b7280] bg-[#1e222a] border border-white/[0.07] px-2.5 py-1 rounded hover:text-blue-400 hover:border-blue-500/30 transition-all">
                  <i className="ti ti-player-play text-[10px]" aria-hidden /> Check
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 24h bar chart */}
        <div className="bg-[#16191f] border border-white/[0.07] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-[0.1em] text-[#6b7280]">Health checks — last 24h</span>
            <span className="text-[10px] text-[#6b7280]">Interval: 5 min</span>
          </div>
          <div className="flex items-end gap-[3px] h-[72px]">
            {[40,45,38,42,50,32,10,48,44,55,50,44,42,40,45,38,42,50,55,10,48,44,42,50,55,60,50,45,38,42,50,55,60,50,45,38,42,50,55,60,50,10,38,42,50,55,60,50].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm ${h < 20 ? 'bg-red-400' : h > 52 ? 'bg-amber-400/80' : 'bg-emerald-400/70'}`}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {['0h','6h','12h','18h','24h'].map((l) => (
              <span key={l} className="text-[9px] text-[#6b7280]">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}