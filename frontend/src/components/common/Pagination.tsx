interface PaginationProps {
  page:         number;     // 0-based
  totalPages:   number;
  totalElements: number;
  pageSize:     number;
  first:        boolean;
  last:         boolean;
  onPrev:       () => void;
  onNext:       () => void;
  onGoTo:       (p: number) => void;
}

export function Pagination({
  page, totalPages, totalElements, pageSize,
  first, last, onPrev, onNext, onGoTo,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const from  = page * pageSize + 1;
  const to    = Math.min((page + 1) * pageSize, totalElements);

  // Generate page buttons — show max 5 around current
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i++) pages.push(i);
  } else {
    pages.push(0);
    if (page > 2)             pages.push('...');
    for (let i = Math.max(1, page - 1); i <= Math.min(totalPages - 2, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 3) pages.push('...');
    pages.push(totalPages - 1);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.07] flex-shrink-0">
      {/* Count */}
      <span className="text-[11px] text-[#6b7280] font-mono">
        {from}–{to} of {totalElements}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          type="button"
          onClick={onPrev}
          disabled={first}
          className="flex items-center justify-center w-7 h-7 rounded border border-white/[0.07] text-[#6b7280] hover:text-[#e8eaf0] hover:border-white/[0.15] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="w-7 h-7 flex items-center justify-center text-[11px] text-[#6b7280]">
              ···
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onGoTo(p as number)}
              className={`w-7 h-7 flex items-center justify-center rounded border text-[11px] font-mono transition-all ${
                page === p
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'text-[#6b7280] border-white/[0.07] hover:text-[#e8eaf0] hover:border-white/[0.15]'
              }`}
            >
              {(p as number) + 1}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          onClick={onNext}
          disabled={last}
          className="flex items-center justify-center w-7 h-7 rounded border border-white/[0.07] text-[#6b7280] hover:text-[#e8eaf0] hover:border-white/[0.15] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}