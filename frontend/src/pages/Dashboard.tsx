import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { DashboardMetrics } from '../types/dashbaord';
import { dashboardApi } from '../features/dashbaord/DashbaordApi';
import StatusBadge from '../components/ui/status-badge';

function resolveStatus(s: string) {
  return s === 'true' ? 'UP' : 'DOWN';
}

function formatChecked(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatAvgResponse(ms: number) {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
}

export function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getMetrics();
      setMetrics(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  const uptime = metrics
    ? metrics.totalServices > 0
      ? Math.round((metrics.onlineServices / metrics.totalServices) * 100)
      : 0
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

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            <i className="ti ti-wifi-off text-red-400 text-base" aria-hidden />
            <p className="text-[12px] text-red-400 flex-1">{error}</p>
            <button
              onClick={fetchMetrics}
              className="text-[11px] text-red-400 border border-red-500/30 px-3 py-1 rounded hover:bg-red-500/10 transition-colors"
            >
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
            valueColor={
              metrics && metrics.averageResponseTime > 1000 ? 'text-amber-400' : 'text-[#e8eaf0]'
            }
          />
        </div>

        {/* Recent services */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-[0.1em] text-[#6b7280]">
              Recent services
            </span>
            <Link
              to="/services"
              className="text-[10px] text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors"
            >
              View all <i className="ti ti-arrow-right text-[11px]" aria-hidden />
            </Link>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16 gap-2 text-[#6b7280]">
              <i className="ti ti-loader animate-spin text-lg" aria-hidden />
              <span className="text-[13px]">Loading…</span>
            </div>
          )}

          {!loading && !error && metrics?.recentService.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <i className="ti ti-server text-3xl text-[#6b7280] mb-3" aria-hidden />
              <p className="text-[#e8eaf0] text-sm font-medium">No services yet</p>
              <Link
                to="/services"
                className="mt-3 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                Add your first service →
              </Link>
            </div>
          )}

          {!loading && metrics && metrics.recentService.length > 0 && (
            <div className="space-y-1.5">
              {/* Header */}
              <div
                className="grid px-4 mb-1 gap-4"
                style={{ gridTemplateColumns: '10px 1fr 90px 110px 100px' }}
              >
                {['', 'Service', 'Status', 'Last response', 'Checked at'].map((h) => (
                  <span key={h} className="text-[9px] uppercase tracking-[0.1em] text-[#6b7280]">
                    {h}
                  </span>
                ))}
              </div>

              {metrics.recentService.map((svc) => {
                const status = resolveStatus(svc.status);
                const isUp   = status === 'UP';
                return (
                  <div
                    key={svc.id}
                    className="bg-[#16191f] border border-white/[0.07] rounded-lg px-4 py-3 grid items-center gap-4 hover:border-white/[0.14] transition-colors"
                    style={{ gridTemplateColumns: '10px 1fr 90px 110px 100px' }}
                  >
                    {/* Status dot */}
                    <span className="relative flex items-center justify-center w-2 h-2">
                      {isUp && (
                        <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-40 animate-ping" />
                      )}
                      <span className={`relative w-2 h-2 rounded-full ${isUp ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    </span>

                    {/* Name + URL */}
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-[#e8eaf0] truncate">{svc.name}</p>
                      <p className="text-[10px] text-[#6b7280] truncate">{svc.url}</p>
                    </div>

                    {/* Badge */}
                    <div className='mr-4'>
                      <StatusBadge status={status} />
                    </div>

                    {/* Last response */}
                    <span className={`text-[11px] font-mono tabular-nums ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                      {svc.lastResponse}
                    </span>

                    {/* Checked at */}
                    <span className="text-[11px] text-[#6b7280] font-mono">
                      {formatChecked(svc.lastChecked)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: string;
  valueColor?: string;
  iconColor?: string;
}

function StatCard({ label, value, sub, icon, valueColor, iconColor }: StatCardProps) {
  return (
    <div className="bg-[#16191f] border border-white/[0.07] rounded-lg px-4 py-4">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.1em] text-[#6b7280]">{label}</p>
        <i className={`ti ${icon} text-[16px] ${iconColor ?? 'text-[#6b7280]'}`} aria-hidden />
      </div>
      <p className={`text-[26px] font-medium leading-none ${valueColor ?? 'text-[#e8eaf0]'}`}>
        {value}
      </p>
      <p className="text-[10px] text-[#6b7280] mt-2">{sub}</p>
    </div>
  );
}