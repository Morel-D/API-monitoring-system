const colors: Record<string, string> = {
  UP:      'bg-emerald-400',
  DOWN:    'bg-red-400',
  SLOW:    'bg-amber-400',
  UNKNOWN: 'bg-zinc-500',
};

export function StatusDot({ status, pulse = false }: { status: string; pulse?: boolean }) {
  const color = colors[status] ?? colors.UNKNOWN;

  return (
    <span className="relative inline-flex items-center justify-center w-2.5 h-2.5">
      {pulse && status === 'UP' && (
        <span className={`absolute w-full h-full rounded-full ${color} opacity-40 animate-ping`} />
      )}
      <span className={`relative w-2 h-2 rounded-full ${color}`} />
    </span>
  );
}