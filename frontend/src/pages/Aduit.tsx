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
      <header className="flex items-center justify-between px-4 lg:px-6 py-3.5 bg-[#16191f] border-b border-white/[0.07] flex-shrink-0">
        <div>
          <h1 className="text-sm font-medium text-[#e8eaf0]">Audit Logs</h1>
          <p className="text-[11px] text-[#6b7280] hidden sm:block">
            {paged ? `${paged.totalElements} total actions recorded` : 'Track all actions performed in the system'}
          </p>
        </div>
        <button type="button" onClick={fetchAll} disabled={loading}
          className="flex items-center gap-1.5 text-[11px] text-[#6b7280] bg-[#1e222a] border border-white/[0.07] px-3 py-2 rounded-md hover:text-[#e8eaf0] transition-colors disabled:opacity-40">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-4 ${loading ? 'animate-spin' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-1.5 px-4 lg:px-6 py-3 border-b border-white/[0.07] bg-[#0e1014] flex-shrink-0 overflow-x-auto">
        {FILTERS.map((f) => (
          <button key={f.value} type="button" onClick={() => setFilter(f.value)}
            className={`text-[10px] px-2.5 sm:px-3 py-1.5 rounded border transition-all whitespace-nowrap flex-shrink-0 ${
              filter === f.value
                ? 'bg-[#1e222a] text-[#e8eaf0] border-white/[0.15]'
                : 'text-[#6b7280] border-white/[0.07] hover:bg-[#1e222a] hover:text-[#e8eaf0]'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">

        {/* Desktop column headers */}
        {filtered.length > 0 && (
          <div className="hidden lg:grid px-4 mb-2 gap-4" style={{ gridTemplateColumns: '1fr 160px 1fr 110px 40px' }}>
            {['User', 'Badge', 'Description', 'Date', ''].map((h) => (
              <span key={h} className="text-[9px] uppercase tracking-[0.1em] text-[#6b7280]">{h}</span>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-2 text-[#6b7280]">
            {/* <svg className="animate-spin size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg> */}
            <span className="text-[13px]">Loading logs…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-red-400 mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-[#6b7280] mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
            </svg>
            <p className="text-[#e8eaf0] font-medium">No audit logs found</p>
            <p className="text-[13px] text-[#6b7280] mt-1">
              {filter !== 'ALL' ? 'Try selecting a different filter' : 'Actions will appear here once recorded'}
            </p>
          </div>
        )}

        {/* Rows */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-2">
            {filtered.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelected(log)}
                className="bg-[#16191f] border border-white/[0.07] rounded-lg hover:border-white/[0.14] transition-colors cursor-pointer"
              >
                {/* ── Desktop row ──────────────────────────── */}
                <div
                  className="hidden lg:grid items-center px-4 py-3 gap-4"
                  style={{ gridTemplateColumns: '1fr 160px 1fr 110px 40px' }}
                >
                  {/* User */}
                  <div className="min-w-0">
                    {log.user ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-[9px] font-medium text-blue-400 uppercase">{log.user.name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-medium text-[#e8eaf0] truncate">{log.user.name}</p>
                          <p className="text-[10px] text-[#6b7280] truncate">{log.user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#6b7280]">...</span>
                    )}
                  </div>
                  <div><AuditActionBadge action={log.action} /></div>
                  <p className="text-[11px] text-[#6b7280] truncate">{log.description}</p>
                  <span className="text-[10px] text-[#6b7280] font-mono whitespace-nowrap">{formatDateShort(log.createdAt)}</span>
                  <div className="flex justify-end">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-[#6b7280]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>

                {/* ── Mobile card ──────────────────────────── */}
                <div className="lg:hidden px-4 py-3.5 space-y-2.5">
                  {/* Top: user + date */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {log.user ? (
                        <>
                          <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-medium text-blue-400 uppercase">{log.user.name.charAt(0)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium text-[#e8eaf0] truncate">{log.user.name}</p>
                            <p className="text-[10px] text-[#6b7280] truncate">{log.user.email}</p>
                          </div>
                        </>
                      ) : (
                        <span className="text-[11px] text-[#6b7280]">...</span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#6b7280] font-mono whitespace-nowrap flex-shrink-0">
                      {formatDateShort(log.createdAt)}
                    </span>
                  </div>

                  {/* Middle: badge + description */}
                  <div className="flex items-start gap-2.5">
                    <AuditActionBadge action={log.action} />
                    <p className="text-[11px] text-[#6b7280] leading-relaxed line-clamp-2 flex-1">
                      {log.description}
                    </p>
                  </div>

                  {/* Bottom: tap hint */}
                  <div className="flex justify-end">
                    <span className="text-[10px] text-[#6b7280] flex items-center gap-1">
                      View details
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </span>
                  </div>
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