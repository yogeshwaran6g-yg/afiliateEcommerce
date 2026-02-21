import React from "react";

export default function SupportBanner() {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-white">support_agent</span>
      </div>
      <div className="flex-1">
        <h6 className="font-bold text-white text-base">Need assistance with an order?</h6>
        <p className="text-sm text-slate-400">Our 24/7 support team can help with logistics or order queries.</p>
      </div>
      <button className="w-full md:w-auto px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
        Get Help
      </button>
    </div>
  );
}