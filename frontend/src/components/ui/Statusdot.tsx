

const colors: Record<string, string> = {
  'true':      'bg-emerald-400',
  'false':    'bg-red-400',
  // SLOW:    'bg-amber-400',
  // UNKNOWN: 'bg-zinc-500',
};

export function StatusDot({ status, pulse = false }: { status: string; pulse?: boolean }) {
  return (
    <span className="relative inline-flex items-center justify-center w-2.5 h-2.5">
      {pulse && status === 'UP' && (
        <span className={`absolute w-full h-full rounded-full ${colors[status]} opacity-40 animate-ping`} />
      )}
      <span className={`relative w-2 h-2 rounded-full ${colors[status]}`} />
    </span>
  );
}