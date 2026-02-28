/**
 * Server-based pagination control.
 * Shows a smart sliding window of page buttons:
 *   - Always shows first and last page
 *   - Shows up to 5 pages around the current page
 *   - Adds ellipsis gaps where needed
 */
const getPageWindow = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = new Set([1, total]);
    for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) {
        pages.add(i);
    }

    const sorted = [...pages].sort((a, b) => a - b);

    // Insert ellipsis markers
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...');
        result.push(sorted[i]);
    }
    return result;
};

const Pagination = ({ pagination, onPageChange }) => {
    const { page, limit, total, totalPages } = pagination;

    if (totalPages <= 0) return null;

    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    const pageWindow = getPageWindow(page, totalPages);

    return (
        <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-400">
                Showing <span className="text-slate-600">{start}–{end}</span> of{' '}
                <span className="text-slate-600">{total.toLocaleString()}</span> transactions
            </p>

            <div className="flex items-center gap-1.5">
                {/* Prev */}
                <button
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                    Prev
                </button>

                {/* Page buttons with smart window */}
                {pageWindow.map((p, idx) =>
                    p === '...' ? (
                        <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-xs text-slate-400 font-bold">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                                p === page
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                                    : 'text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                    Next
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
