import React from "react";

export default function Pagination({ page, totalPages, total, limit, onPageChange }) {
    if (totalPages <= 1) return null;

    const startIdx = (page - 1) * limit + 1;
    const endIdx = Math.min(page * limit, total);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-10 py-8 bg-slate-50/50 border-t border-slate-100 rounded-b-[2.5rem]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Showing <span className="text-slate-800">{startIdx}</span> to <span className="text-slate-800">{endIdx}</span> of <span className="text-slate-800">{total}</span> records
            </p>
            
            <div className="flex items-center gap-3">
                <button
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-90 disabled:opacity-30 disabled:scale-100 disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-100"
                >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>

                <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => onPageChange(i + 1)}
                            className={`w-12 h-12 rounded-2xl text-[11px] font-black uppercase transition-all shadow-sm active:scale-90 ${
                                page === i + 1
                                    ? "bg-slate-900 text-white shadow-xl shadow-slate-300"
                                    : "bg-white text-slate-400 border border-slate-100 hover:border-slate-900 hover:text-slate-900"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-90 disabled:opacity-30 disabled:scale-100 disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-100"
                >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
            </div>
        </div>
    );
}
