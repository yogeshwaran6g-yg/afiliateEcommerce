import React from "react";

const FAQSection = ({ faqs }) => {
    return (
        <div className="space-y-4">
            {faqs.map((faq, i) => (
                <details
                    key={i}
                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-sm"
                >
                    <summary className="flex items-center justify-between p-4 md:p-6 cursor-pointer hover:bg-slate-50 transition-colors">
                        <h3 className="text-sm md:text-lg font-bold text-slate-900">
                            {faq.q}
                        </h3>
                        <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">
                            expand_more
                        </span>
                    </summary>
                    <div className="px-4 md:px-6 pb-4 md:pb-6 text-sm md:text-base text-slate-500 leading-relaxed">
                        {faq.a}
                    </div>
                </details>
            ))}
        </div>
    );
};

export default FAQSection;
