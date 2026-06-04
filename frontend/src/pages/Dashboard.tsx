import { Link } from 'react-router-dom';
import { RecentServicesList } from '../features/dashbaord/components/Recentservicelist';
import { StatCard } from '../features/dashbaord/components/StatCard';
import { calcUptimePercent, formatAvgResponse } from '../features/dashbaord/helpers';
import { useDashboard } from '../features/dashbaord/hooks/useDashbaord';


export function DashboardPage() {
  const { metrics, loading, error, fetchMetrics } = useDashboard();

  const uptime = metrics
    ? calcUptimePercent(metrics.onlineServices, metrics.totalServices)
    : null;

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-[#16191f] border-b border-white/[0.07] flex-shrink-0">
        <div>
          <h1 className="text-sm font-medium text-[#e8eaf0]">Dashboard</h1>
          <p className="text-[11px] text-[#6b7280]">Overview of all monitored services</p>
        </div>
        <div className="flex items-center gap-3">
          {!loading && (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400">Live</span>
            </>
          )}
          <button
            type="button"
            onClick={fetchMetrics}
            disabled={loading}
            className="flex items-center gap-1.5 text-[11px] text-[#6b7280] bg-[#1e222a] border border-white/[0.07] px-3 py-1.5 rounded-md hover:text-[#e8eaf0] transition-colors disabled:opacity-40"
          >
            <i className={`ti ti-refresh text-[13px] ${loading ? 'animate-spin' : ''}`} aria-hidden />
            Refresh
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            <i className="ti ti-wifi-off text-red-400 text-base" aria-hidden />
            <p className="text-[12px] text-red-400 flex-1">{error}</p>
            <button type="button" onClick={fetchMetrics}
              className="text-[11px] text-red-400 border border-red-500/30 px-3 py-1 rounded hover:bg-red-500/10 transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            label="Total Services"
            value={loading ? '—' : String(metrics?.totalServices ?? 0)}
            sub="monitored endpoints"
            icon="ti-server"
          />
          <StatCard
            label="Online"
            value={loading ? '—' : String(metrics?.onlineServices ?? 0)}
            sub={uptime !== null ? `${uptime}% uptime rate` : '—'}
            icon="ti-circle-check"
            valueColor="text-emerald-400"
            iconColor="text-emerald-400"
          />
          <StatCard
            label="Offline"
            value={loading ? '—' : String(metrics?.offlineServices ?? 0)}
            sub={metrics?.offlineServices ? 'needs attention' : 'all good'}
            icon="ti-circle-x"
            valueColor={metrics?.offlineServices ? 'text-red-400' : 'text-[#e8eaf0]'}
            iconColor={metrics?.offlineServices ? 'text-red-400' : 'text-[#6b7280]'}
          />
          <StatCard
            label="Avg Response"
            value={loading ? '—' : metrics ? formatAvgResponse(metrics.averageResponseTime) : '—'}
            sub="across all services"
            icon="ti-clock"
            valueColor={metrics && metrics.averageResponseTime > 1000 ? 'text-amber-400' : undefined}
          />
        </div>

        {/* Recent services */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-[0.1em] text-[#6b7280]">Recent services</span>
            <Link to="/services" className="text-[10px] text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors">
              View all <i className="ti ti-arrow-right text-[11px]" aria-hidden />
            </Link>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16 gap-2 text-[#6b7280]">
              <i className="ti ti-loader animate-spin text-lg" aria-hidden />
              <span className="text-[13px]">Loading…</span>
            </div>
          )}

          {!loading && metrics && (
            <RecentServicesList services={metrics.recentService} />
          )}
        </div>
      </div>
    </div>
  );
}