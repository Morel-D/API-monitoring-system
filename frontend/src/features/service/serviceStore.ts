import { create } from 'zustand';
import type { PagedResponse } from '../../types/pagination';
import type { AutoCheck, Service, ServiceFormValues } from '../../types';
import { serviceApi } from './ServiceApi';


const PAGE_SIZE = 10;

interface ServiceState {
  paged:       PagedResponse<Service> | null;
  currentPage: number;
  loading:     boolean;
  error:       string | null;
  checkingIds: Set<number>;

  // pagination
  fetchPage:   (page: number)  => Promise<void>;
  refresh:     ()              => Promise<void>;   // re-fetch currentPage
  goTo:        (page: number)  => void;
  goNext:      ()              => void;
  goPrev:      ()              => void;

  // mutations — all auto-refresh after completion
  create:          (values: ServiceFormValues)             => Promise<Service>;
  update:          (id: number, values: ServiceFormValues) => Promise<Service>;
  remove:          (id: number)                            => Promise<void>;
  updateAutoCheck: (id: number, dto: AutoCheck)         => Promise<void>;
  triggerCheck:    (id: number)                            => Promise<void>;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  paged:       null,
  currentPage: 0,
  loading:     false,
  error:       null,
  checkingIds: new Set(),

  // ── Fetch ─────────────────────────────────────────────────
  fetchPage: async (page) => {
    set({ loading: true, error: null });
    try {
      const paged = await serviceApi.getAll(page, PAGE_SIZE);
      set({ paged, currentPage: page, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
      throw e;
    }
  },

  refresh: () => get().fetchPage(get().currentPage),

  goTo: (page) => get().fetchPage(page),

  goNext: () => {
    const { paged, currentPage } = get();
    if (paged && !paged.last) get().fetchPage(currentPage + 1);
  },

  goPrev: () => {
    const { paged, currentPage } = get();
    if (paged && !paged.first) get().fetchPage(currentPage - 1);
  },

  // ── Mutations — each calls refresh() after ────────────────
  create: async (values) => {
    const created = await serviceApi.create(values);
    await get().refresh();
    return created;
  },

  update: async (id, values) => {
    const updated = await serviceApi.update(id, values);
    await get().refresh();
    return updated;
  },

  remove: async (id) => {
    await serviceApi.delete(id);
    // If last item on page > 0, go back one page
    const { paged, currentPage } = get();
    const isLastOnPage = paged?.numberOfElements === 1 && currentPage > 0;
    await get().fetchPage(isLastOnPage ? currentPage - 1 : currentPage);
  },

  updateAutoCheck: async (id, dto) => {
    await serviceApi.updateAutoCheck(id, dto);
    await get().refresh();
  },

  triggerCheck: async (id) => {
    set((s) => ({ checkingIds: new Set(s.checkingIds).add(id) }));
    try {
      await serviceApi.triggerCheck(id);
      await get().refresh();
    } finally {
      set((s) => {
        const ids = new Set(s.checkingIds);
        ids.delete(id);
        return { checkingIds: ids };
      });
    }
  },
}));