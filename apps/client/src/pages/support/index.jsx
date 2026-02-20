import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SupportHeader from "./SupportHeader";
import FAQSection from "./FAQSection";
import TicketsSection from "./TicketsSection";
import SupportSidebar from "./SupportSidebar";

import { faqs, tickets } from "./data";

export default function Support() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || "faq");

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="p-4 md:p-8 space-y-8 flex-1">
                <SupportHeader activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {activeTab === "faq" ? (
                            <FAQSection faqs={faqs} />
                        ) : (
                            <TicketsSection tickets={tickets} />
                        )}
                    </div>
                    <SupportSidebar />
                </div>
            </div>

        </div>
    );
}
