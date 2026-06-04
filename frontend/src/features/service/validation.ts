import type { ServiceFormValues } from "../../types";


export type ServiceFormErrors = Partial<Record<keyof ServiceFormValues, string>>;

export function validateServiceForm(values: ServiceFormValues): ServiceFormErrors {
  const errors: ServiceFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Service name is required.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!values.url.trim()) {
    errors.url = 'URL is required.';
  } else {
    try {
      new URL(values.url);
    } catch {
      errors.url = 'Must be a valid URL (e.g. https://api.example.com/health).';
    }
  }

  if (values.autoCheckEnable && (!values.checkInterval || values.checkInterval < 1)) {
    errors.checkInterval = 'Interval must be at least 1 minute.';
  }

  return errors;
}

export function validateAutoCheck(
  enabled: boolean,
  intervalMinutes: number
): string | null {
  if (enabled && intervalMinutes < 1) {
    return 'Interval must be at least 1 minute.';
  }
  return null;
}

// Parse "PT4.336S" → "4336ms"
export function parseResponseTime(pt: string): string {
  const match = pt.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?/);
  if (!match) return pt;
  const h = parseInt(match[1] ?? '0');
  const m = parseInt(match[2] ?? '0');
  const s = parseFloat(match[3] ?? '0');
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s.toFixed(0)}s`;
  return `${(s * 1000).toFixed(0)}ms`;
}

export function resolveStatus(status: string | null) {
  if (status === 'true')  return 'UP'   as const;
  if (status === 'false') return 'DOWN' as const;
  return 'UNKNOWN' as const;
}

export function formatCheckedAt(iso: string | null): string {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatLogDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
}