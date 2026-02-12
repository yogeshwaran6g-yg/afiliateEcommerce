import React from "react";

const SupportSidebar = () => {
    return (
        <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h3 className="text-lg md:text-xl font-bold mb-4 relative z-10">
                    Distributor Hotline
                </h3>
                <p className="text-slate-400 text-xs md:text-sm mb-6 relative z-10">
                    Direct line for Platinum and above rank distributors. Available 24/7
                    for urgent matters.
                </p>
                <a
                    href="tel:1800FINTECH"
                    className="flex items-center gap-2 text-primary font-black text-lg hover:underline whitespace-nowrap relative z-10"
                >
                    <span className="material-symbols-outlined">call</span>
                    1-800-FINTECH
                </a>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">Community Support</h3>
                <p className="text-slate-500 text-xs md:text-sm mb-6">
                    Join our official telegram group for community tips and fast updates.
                </p>
                <button className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                    <span className="material-symbols-outlined">send</span>
                    Join Telegram
                </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">
                        Live Now
                    </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Live Chat Support</h3>
                <p className="text-slate-500 text-xs md:text-sm mb-4">
                    Connect with a real person in less than 2 minutes.
                </p>
                <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                    Start Chat
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                </button>
            </div>
        </div>
    );
};

export default SupportSidebar;
