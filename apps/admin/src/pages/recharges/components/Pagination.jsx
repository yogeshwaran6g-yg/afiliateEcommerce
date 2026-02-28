import React from 'react';

const getPageWindow = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total]);
    for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) {
        pages.add(i);
    }
    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...');
        result.push(sorted[i]);
    }
    return result;
};

const Pagination = ({ page, totalPages, total, limit, onPageChange }) => {
    if (totalPages <= 0) return null;

    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    const pageWindow = getPageWindow(page, totalPages);

    return (
        <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Showing <span className="text-slate-600 font-black">{start}–{end}</span> of{' '}
                <span className="text-slate-600 font-black">{total.toLocaleString()}</span> recharges
            </p>

            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-5 py-2.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                    <span className="material-symbols-outlined text-sm font-black">chevron_left</span>
                    Prev
                </button>

                {pageWindow.map((p, idx) =>
                    p === '...' ? (
                        <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-xs text-slate-300 font-black">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`w-10 h-10 rounded-xl text-[10px] font-black flex items-center justify-center transition-all ${
                                p === page
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110'
                                    : 'text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-5 py-2.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                    Next
                    <span className="material-symbols-outlined text-sm font-black">chevron_right</span>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
