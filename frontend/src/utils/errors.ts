// Axios attaches correlationId to Error objects in the response interceptor.
// Use this helper in all hooks to forward it to toastError.

export function getCorrelationId(err: unknown): string | undefined {
  return (err as Error & { correlationId?: string })?.correlationId;
}