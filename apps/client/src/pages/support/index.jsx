import React, { useState } from "react";
import SupportHeader from "./SupportHeader";
import FAQSection from "./FAQSection";
import TicketsSection from "./TicketsSection";
import SupportSidebar from "./SupportSidebar";
import SupportFooter from "./SupportFooter";
import { faqs, tickets } from "./data";

export default function Support() {
    const [activeTab, setActiveTab] = useState("faq");

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
            <SupportFooter />
        </div>
    );
}
