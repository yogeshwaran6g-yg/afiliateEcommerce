import React from "react";

const SupportHeader = ({ activeTab, setActiveTab }) => {
    return (
        <div className="text-center py-8">
            <h1 className="text-2xl md:text-5xl font-bold text-slate-900 mb-4">
                How can we help?
            </h1>
            <p className="text-sm md:text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
                Search our knowledge base or reach out to our team for assistance.
            </p>
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit mx-auto mb-8">
                <button
                    onClick={() => setActiveTab("faq")}
                    className={`px-6 md:px-8 py-2 md:py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === "faq"
                            ? "bg-white shadow-sm text-primary"
                            : "text-slate-500"
                        }`}
                >
                    FAQ
                </button>
                <button
                    onClick={() => setActiveTab("contact")}
                    className={`px-6 md:px-8 py-2 md:py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === "contact"
                            ? "bg-white shadow-sm text-primary"
                            : "text-slate-500"
                        }`}
                >
                    Tickets
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                    search
                </span>
                <input
                    type="text"
                    placeholder="Search for articles, guides, and FAQs..."
                    className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-slate-300 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
                />
            </div>
        </div>
    );
};

export default SupportHeader;
