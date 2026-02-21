import React, { useState, useRef, useEffect } from "react";

const sortOptions = [
    { value: "newest", label: "Newest Arrivals", icon: "schedule" },
    { value: "price-low", label: "Price: Low to High", icon: "vertical_align_bottom" },
    { value: "price-high", label: "Price: High to Low", icon: "vertical_align_top" },
];

export default function SortFilter({ activeSort, onSortChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const activeSortLabel = sortOptions.find(opt => opt.value === activeSort)?.label || "Sort By";

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
                <span className="material-symbols-outlined text-lg text-slate-500">
                    sort
                </span>
                <span>{activeSortLabel}</span>
                <span
                    className={`material-symbols-outlined text-lg text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                    expand_more
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-1">
                        {sortOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onSortChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-3 px-4 py-2 border rounded-xl transition-all whitespace-nowrap w-full ${
                                    activeSort === opt.value
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white border-transparent hover:bg-slate-50 text-slate-600"
                                }`}
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {opt.icon}
                                </span>
                                <span className="text-sm font-medium">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
