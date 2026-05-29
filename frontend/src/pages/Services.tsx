import { useCallback, useEffect, useState } from 'react';
import type { Service, ServiceFormValues, ServiceStatus } from '../types';
import { resolveStatus, formatCheckedAt } from '../types';
import { StatusDot } from '../components/ui/Statusdot';
import StatusBadge from '../components/ui/status-badge';
import Modal from '../components/common/modal';
import { ServiceForm } from '../features/service/components/Serviceform';
import { servicesApi } from '../features/service/ServiceApi';
import { ServiceLogsModal } from '../features/service/components/ServiceLogsModal';

type Filter = 'ALL' | ServiceStatus;

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All',     value: 'ALL'     },
  { label: 'Up',      value: 'UP'      },
  { label: 'Down',    value: 'DOWN'    },
  { label: 'Unknown', value: 'UNKNOWN' },
];

const COLS = '20px 1fr 90px 140px 100px';

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [filter, setFilter]     = useState<Filter>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]   = useState<Service | null>(null);
  const [logsTarget, setLogsTarget] = useState<Service | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Derived ───────────────────────────────────────────────────
  const filtered = filter === 'ALL'
    ? services
    : services.filter((s) => resolveStatus(s.status) === filter);

  const count = (v: Filter) =>
    v === 'ALL'
      ? services.length
      : services.filter((s) => resolveStatus(s.status) === v).length;

  // ── Modal helpers ─────────────────────────────────────────────
  const openAdd  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (svc: Service) => { setEditing(svc); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  // ── Handlers ──────────────────────────────────────────────────
  const handleSubmit = async (values: ServiceFormValues) => {
    if (editing) {
      const updated = await servicesApi.update(editing.id, values);
      setServices((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...updated } : s)));
    } else {
      const created = await servicesApi.create(values);
      setServices((prev) => [...prev, created]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (!confirm('Remove this service?')) return;
    servicesApi.delete(id).then(() =>
      setServices((prev) => prev.filter((s) => s.id !== id))
    );
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-[#16191f] border-b border-white/[0.07] flex-shrink-0">
        <div>
          <h1 className="text-sm font-medium text-[#e8eaf0]">Services</h1>
          <p className="text-[11px] text-[#6b7280]">Manage and monitor your API endpoints</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-1.5 text-[11px] text-[#6b7280] bg-[#1e222a] border border-white/[0.07] px-3 py-2 rounded-md hover:text-[#e8eaf0] transition-colors disabled:opacity-40"
          >
            <i className={`ti ti-refresh text-[13px] ${loading ? 'animate-spin' : ''}`} aria-hidden />
            Refresh
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-blue-500 text-white text-[11px] font-medium px-3.5 py-2 rounded-md hover:bg-blue-400 transition-colors"
          >
            <i className="ti ti-plus text-[13px]" aria-hidden /> Add Service
          </button>
        </div>
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

        {/* Column headers */}
        {services.length > 0 && (
          <div className="grid px-4 mb-2 gap-3" style={{ gridTemplateColumns: COLS }}>
            {['', 'Service', 'Status', 'Last checked', 'Actions'].map((h) => (
              <span key={h} className="text-[9px] uppercase tracking-[0.1em] text-[#6b7280]">{h}</span>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-2 text-[#6b7280]">
            <i className="ti ti-loader animate-spin text-lg" aria-hidden />
            <span className="text-[13px]">Loading services…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <i className="ti ti-wifi-off text-3xl text-red-400 mb-3" aria-hidden />
            <p className="text-[#e8eaf0] font-medium text-sm">Failed to load services</p>
            <p className="text-[12px] text-[#6b7280] mt-1">{error}</p>
            <button
              onClick={fetchAll}
              className="mt-4 text-[11px] text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded hover:bg-blue-500/10 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <i className="ti ti-server text-4xl text-[#6b7280] mb-3" aria-hidden />
            <p className="text-[#e8eaf0] font-medium">
              {services.length === 0 ? 'No services yet' : 'No services match this filter'}
            </p>
            <p className="text-[13px] text-[#6b7280] mt-1 max-w-xs">
              {services.length === 0
                ? 'Add your first service to start monitoring'
                : 'Try selecting a different filter above'}
            </p>
            {services.length === 0 && (
              <button
                onClick={openAdd}
                className="mt-6 flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white text-sm px-5 py-2.5 rounded-lg transition-colors"
              >
                <i className="ti ti-plus" aria-hidden /> Add Your First Service
              </button>
            )}
          </div>
        )}

        {/* Rows */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-1.5">
            {filtered.map((svc) => {
              const status = resolveStatus(svc.status);
              return (
                <div
                  key={svc.id}
                  className="bg-[#16191f] border border-white/[0.07] rounded-lg px-4 py-3.5 grid items-center gap-3 hover:border-white/[0.14] transition-colors"
                  style={{ gridTemplateColumns: COLS }}
                >
                  <StatusDot status={svc.status.toString()} pulse />

                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[#e8eaf0] truncate">{svc.name}</p>
                    <p className="text-[10px] text-[#6b7280] truncate">{svc.url}</p>
                  </div>

                  <div className='pr-8'>
                    <StatusBadge status={status} />
                  </div>
                  

                  <span className="text-[11px] text-[#6b7280] font-mono">
                    {formatCheckedAt(svc.lastCheckedAt)}
                  </span>

                  <div className="flex items-center gap-0">

                      <button
                        onClick={() => setLogsTarget(svc)}
                        className="text-[10px] text-[#6b7280] border border-none px-2 py-1 rounded hover:text-blue-400 transition-all"
                        aria-label="View logs"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                        </svg>
                      </button>

                    <button
                      onClick={() => openEdit(svc)}
                      className="text-[10px] text-[#6b7280]  border border-none px-2 py-1 rounded hover:text-[#e8eaf0] transition-all"
                      aria-label="Edit"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(svc.id)}
                      className="text-[10px] text-[#6b7280] border border-none px-2 py-1 rounded hover:text-red-400 hover:border-red-500/30 transition-all"
                      aria-label="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ServiceLogsModal
        service={logsTarget}
        onClose={() => setLogsTarget(null)}
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit service' : 'Add service'}
        widthClass="sm:w-[480px] w-[90%] max-w-[95%] rounded-xl"
      >
        <ServiceForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}