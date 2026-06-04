import { create } from 'zustand';
import type { AutoCheck, Service, ServiceFormValues } from '../../types';
import { serviceApi } from './ServiceApi';

interface ServiceState {
  services:    Service[];
  loading:     boolean;
  error:       string | null;
  checkingIds: Set<number>;

  fetchAll:        ()                                   => Promise<void>;
  create:          (values: ServiceFormValues)          => Promise<Service>;
  update:          (id: number, values: ServiceFormValues) => Promise<Service>;
  remove:          (id: number)                         => Promise<void>;
  updateAutoCheck: (id: number, dto: AutoCheck)      => Promise<void>;
  triggerCheck:    (id: number)                         => Promise<void>;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services:    [],
  loading:     false,
  error:       null,
  checkingIds: new Set(),

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const services = await serviceApi.getAll();
      set({ services, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  create: async (values) => {
    const created = await serviceApi.create(values);
    set((s) => ({ services: [...s.services, created] }));
    return created;
  },

  update: async (id, values) => {
    const updated = await serviceApi.update(id, values);
    set((s) => ({
      services: s.services.map((svc) => (svc.id === id ? { ...svc, ...updated } : svc)),
    }));
    return updated;
  },

  remove: async (id) => {
    await serviceApi.delete(id);
    set((s) => ({ services: s.services.filter((svc) => svc.id !== id) }));
  },

  updateAutoCheck: async (id, dto) => {
    await serviceApi.updateAutoCheck(id, dto);
    // refetch to get updated state
    await get().fetchAll();
  },

  triggerCheck: async (id) => {
    set((s) => ({ checkingIds: new Set(s.checkingIds).add(id) }));
    try {
      const log = await serviceApi.triggerCheck(id);
      set((s) => {
        const ids = new Set(s.checkingIds);
        ids.delete(id);
        return {
          checkingIds: ids,
          services: s.services.map((svc) =>
            svc.id === id
              ? { ...svc, status: log.status, lastCheckedAt: log.checkedAt }
              : svc
          ),
        };
      });
    } catch (e) {
      set((s) => {
        const ids = new Set(s.checkingIds);
        ids.delete(id);
        return { checkingIds: ids };
      });
      throw e;
    }
  },
}));

