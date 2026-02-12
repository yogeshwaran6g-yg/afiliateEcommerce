import React, { useState, useRef, useEffect } from "react";

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeCatName =
    categories.find((cat) => cat.id === activeCategory)?.name ||
    "All Categories";

  // Close dropdown when clicking outside
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
          category
        </span>
        <span>{activeCatName}</span>
        <span
          className={`material-symbols-outlined text-lg text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-1">
            <button
              onClick={() => {
                onCategoryChange(null);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2 border rounded-xl transition-all whitespace-nowrap lg:w-full ${
                activeCategory === null
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-slate-200 lg:border-0 hover:bg-slate-50 text-slate-600"
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                grid_view
              </span>
              <span className="text-sm font-medium">All Products</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onCategoryChange(cat.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2 border rounded-xl transition-all whitespace-nowrap lg:w-full ${
                  activeCategory === cat.id
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-transparent lg:border-0 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {cat.icon || "category"}
                </span>
                <span className="text-sm font-medium">{cat.name}</span>
                {cat.count !== undefined && (
                  <span className="hidden lg:block ml-auto text-xs font-bold opacity-60">
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
