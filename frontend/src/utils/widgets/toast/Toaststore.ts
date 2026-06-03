import { create } from 'zustand';

export interface ToastPayload {
  id:        string;
  success:   boolean;
  message:   string;
  timestamp: string; 
  duration?: number; 
}

interface ToastState {
  toasts: ToastPayload[];
  show:   (payload: Omit<ToastPayload, 'id'>) => void;
  hide:   (id: string) => void;
  clear:  () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  show: (payload) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { ...payload, id }] }));
  },

  hide: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  clear: () => set({ toasts: [] }),
}));

// ── Convenience helpers ───────────────────────────────────────
// Call these anywhere after an API response

export function toastFromResponse(response: {
  success: boolean;
  message: string;
  timestamp: string;
}) {
  useToastStore.getState().show({
    success:   response.success,
    message:   response.message,
    timestamp: response.timestamp,
  });
}

export function toastError(message: string) {
  useToastStore.getState().show({
    success:   false,
    message,
    timestamp: new Date().toISOString(),
  });
}

export function toastSuccess(message: string) {
  useToastStore.getState().show({
    success:   true,
    message,
    timestamp: new Date().toISOString(),
  });
}