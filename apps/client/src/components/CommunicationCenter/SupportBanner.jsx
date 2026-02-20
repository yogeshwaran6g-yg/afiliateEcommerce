import React from "react";
import { useNavigate } from "react-router-dom";

const SupportBanner = () => {
    const navigate = useNavigate();

    return (
        <div className="mt-8 bg-primary/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 sm:gap-6 border border-primary/10 text-center sm:text-left">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">support_agent</span>
            </div>
            <div className="flex-1">
                <h6 className="font-bold text-slate-900">Need help?</h6>
                <p className="text-sm text-slate-500">
                    Our support team is available 24/7 for all account and technical inquiries.
                </p>
            </div>
            <button
                onClick={() => navigate("/support", { state: { activeTab: "contact" } })}
                className="w-full sm:w-auto bg-white border border-slate-200 px-5 py-2 rounded-lg text-sm font-bold whitespace-nowrap hover:bg-slate-50 transition-colors"
            >
                Contact Support
            </button>
        </div>
    );
};

export default SupportBanner;
