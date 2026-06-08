import { Pagination } from "../components/common/Pagination";
import { AuditActionBadge } from "../features/auditLog/components/Auditactionbadge";
import { AuditDetailModal } from "../features/auditLog/components/Auditdetailmodal";
import { FILTERS, formatDateShort } from "../features/auditLog/helper";
import { useAuditList } from "../features/auditLog/hook/useAuditList";

export function AuditPage() {
  const {
    paged, filtered, loading, error,
    filter, setFilter,
    page, goTo, goNext, goPrev,
    fetchAll, selected, setSelected,
  } = useAuditList();
 
  return (
    <div className="flex flex-col h-full overflow-hidden">
 
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-[#16191f] border-b border-white/[0.07] flex-shrink-0">
        <div>
          <h1 className="text-sm font-medium text-[#e8eaf0]">Audit Logs</h1>
          <p className="text-[11px] text-[#6b7280]">
            {paged ? `${paged.totalElements} total actions recorded` : 'Track all actions performed in the system'}
          </p>
        </div>
        <button type="button" onClick={fetchAll} disabled={loading}
          className="flex items-center gap-1.5 text-[11px] text-[#6b7280] bg-[#1e222a] border border-white/[0.07] px-3 py-2 rounded-md hover:text-[#e8eaf0] transition-colors disabled:opacity-40">
          <i className={`ti ti-refresh text-[13px] ${loading ? 'animate-spin' : ''}`} aria-hidden />
          Refresh
        </button>
      </header>
 
      {/* Filters */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-white/[0.07] bg-[#0e1014] flex-shrink-0">
        {FILTERS.map((f) => (
          <button key={f.value} type="button" onClick={() => setFilter(f.value)}
            className={`text-[10px] px-3 py-1.5 rounded border transition-all ${
              filter === f.value
                ? 'bg-[#1e222a] text-[#e8eaf0] border-white/[0.15]'
                : 'text-[#6b7280] border-white/[0.07] hover:bg-[#1e222a] hover:text-[#e8eaf0]'
            }`}>
            {f.label}
          </button>
        ))}
      </div>
 
      {/* Table */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
 
        {/* Column headers */}
        {filtered.length > 0 && (
          <div className="grid px-4 mb-2 gap-4" style={{ gridTemplateColumns: '1fr 160px 1fr 110px 40px' }}>
            {['User / Action', 'Badge', 'Description', 'Date', ''].map((h) => (
              <span key={h} className="text-[9px] uppercase tracking-[0.1em] text-[#6b7280]">{h}</span>
            ))}
          </div>
        )}
 
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-2 text-[#6b7280]">
            <i className="ti ti-loader animate-spin text-lg" aria-hidden />
            <span className="text-[13px]">Loading logs…</span>
          </div>
        )}
 
        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <i className="ti ti-wifi-off text-3xl text-red-400 mb-3" aria-hidden />
            <p className="text-[#e8eaf0] font-medium text-sm">Failed to load audit logs</p>
            <p className="text-[12px] text-[#6b7280] mt-1">{error}</p>
            <button type="button" onClick={fetchAll}
              className="mt-4 text-[11px] text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded hover:bg-blue-500/10 transition-colors">
              Try again
            </button>
          </div>
        )}
 
        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <i className="ti ti-clipboard-list text-4xl text-[#6b7280] mb-3" aria-hidden />
            <p className="text-[#e8eaf0] font-medium">No audit logs found</p>
            <p className="text-[13px] text-[#6b7280] mt-1">
              {filter !== 'ALL' ? 'Try selecting a different filter' : 'Actions will appear here once recorded'}
            </p>
          </div>
        )}
 
        {/* Rows */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-1.5">
            {filtered.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelected(log)}
                className="bg-[#16191f] border border-white/[0.07] rounded-lg px-4 py-3 grid items-center gap-4 hover:border-white/[0.14] transition-colors cursor-pointer"
                style={{ gridTemplateColumns: '1fr 160px 1fr 110px 40px' }}
              >
                {/* User + action */}
                <div className="min-w-0">
                  {log.user ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-medium text-blue-400 uppercase">
                          {log.user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-[#e8eaf0] truncate">{log.user.name}</p>
                        <p className="text-[10px] text-[#6b7280] truncate">{log.user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#6b7280]">System</span>
                  )}
                </div>
 
                {/* Badge */}
                <div><AuditActionBadge action={log.action} /></div>
 
                {/* Description */}
                <p className="text-[11px] text-[#6b7280] truncate">{log.description}</p>
 
                {/* Date */}
                <span className="text-[10px] text-[#6b7280] font-mono whitespace-nowrap">
                  {formatDateShort(log.createdAt)}
                </span>
 
                {/* Arrow */}
                <div className="flex justify-end">
                  <i className="ti ti-chevron-right text-[#6b7280] text-sm" aria-hidden />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
 
      {/* Pagination */}
      {paged && paged.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={paged.totalPages}
          totalElements={paged.totalElements}
          pageSize={paged.size}
          first={paged.first}
          last={paged.last}
          onPrev={goPrev}
          onNext={goNext}
          onGoTo={goTo}
        />
      )}
 
      {/* Detail modal */}
      <AuditDetailModal log={selected} onClose={() => setSelected(null)} />
    </div>
  );
}