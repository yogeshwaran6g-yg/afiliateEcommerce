import React, { useState } from "react";

export default function Support() {
    const [activeTab, setActiveTab] = useState("faq");

    const supportOptions = [
        {
            icon: "menu_book",
            iconColor: "text-blue-600",
            iconBg: "bg-blue-100",
            title: "Knowledge Base",
            description: "Browse our tutorials, guides, and product documentation.",
            action: "Browse Articles",
            link: "#"
        },
        {
            icon: "chat",
            iconColor: "text-blue-600",
            iconBg: "bg-blue-100",
            title: "Live Chat",
            description: "Chat with our support experts in real-time for quick fixes.",
            action: "Start Chatting",
            link: "#"
        },
        {
            icon: "confirmation_number",
            iconColor: "text-blue-600",
            iconBg: "bg-blue-100",
            title: "Submit a Ticket",
            description: "Open a formal support request for complex technical issues.",
            action: "Create Ticket",
            link: "#"
        }
    ];

    const tickets = [
        {
            id: "#TK-8821",
            subject: "Commission Payout Delay - Q3",
            lastUpdate: "2 hours ago",
            status: "In Progress",
            statusColor: "bg-blue-100 text-blue-700"
        },
        {
            id: "#TK-8794",
            subject: "New Distributor Link Generation",
            lastUpdate: "Yesterday, 4:30 PM",
            status: "Resolved",
            statusColor: "bg-green-100 text-green-700"
        }
    ];

    const faqs = [
        {
            q: "How do I track my order?",
            a: "Go to your Orders page and click on 'Track Shipment' next to the relevant order. You'll receive real-time updates."
        },
        {
            q: "What is the return policy?",
            a: "We offer a 30-day return policy for unopened items. Digital products and starter kits are non-refundable once activated."
        },
        {
            q: "How do PV earnings work?",
            a: "Personal Volume (PV) is earned on every purchase. Your total PV determines your rank and commission eligibility for each cycle."
        },
        {
            q: "Locked out of my account?",
            a: "Use the 'Forgot Password' link on the login page. An OTP will be sent to your registered email or mobile number."
        }
    ];

    return (
        <div className="p-4 md:p-8 space-y-8">
            {/* Hero Section - Simplified */}
            <div className="text-center py-8">
                <h1 className="text-2xl md:text-5xl font-bold text-slate-900 mb-4">How can we help?</h1>
                <p className="text-sm md:text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
                    Search our knowledge base or reach out to our team for assistance.
                </p>
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit mx-auto mb-8">
                    <button
                        onClick={() => setActiveTab("faq")}
                        className={`px-6 md:px-8 py-2 md:py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === "faq" ? "bg-white shadow-sm text-primary" : "text-slate-500"}`}
                    >
                        FAQ
                    </button>
                    <button
                        onClick={() => setActiveTab("contact")}
                        className={`px-6 md:px-8 py-2 md:py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === "contact" ? "bg-white shadow-sm text-primary" : "text-slate-500"}`}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4">
                    {activeTab === "faq" ? (
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-sm">
                                    <summary className="flex items-center justify-between p-4 md:p-6 cursor-pointer hover:bg-slate-50 transition-colors">
                                        <h3 className="text-sm md:text-lg font-bold text-slate-900">{faq.q}</h3>
                                        <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                                    </summary>
                                    <div className="px-4 md:px-6 pb-4 md:pb-6 text-sm md:text-base text-slate-500 leading-relaxed">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                <h2 className="text-lg md:text-xl font-bold text-slate-900">Support Tickets</h2>
                                <button className="text-primary font-semibold text-sm hover:underline">
                                    New Ticket
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">ID</th>
                                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Subject</th>
                                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase hidden md:table-cell">Status</th>
                                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">View</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {tickets.map((ticket) => (
                                            <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 text-xs md:text-sm font-semibold text-primary">{ticket.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-xs md:text-sm font-medium text-slate-900">{ticket.subject}</div>
                                                    <div className="text-[10px] md:text-xs text-slate-400">{ticket.lastUpdate}</div>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${ticket.statusColor}`}>
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <h3 className="text-lg md:text-xl font-bold mb-4 relative z-10">Distributor Hotline</h3>
                        <p className="text-slate-400 text-xs md:text-sm mb-6 relative z-10">Direct line for Platinum and above rank distributors. Available 24/7 for urgent matters.</p>
                        <a href="tel:1800FINTECH" className="flex items-center gap-2 text-primary font-black text-lg hover:underline whitespace-nowrap relative z-10">
                            <span className="material-symbols-outlined">call</span>
                            1-800-FINTECH
                        </a>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-2">Community Support</h3>
                        <p className="text-slate-500 text-xs md:text-sm mb-6">Join our official telegram group for community tips and fast updates.</p>
                        <button className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                            <span className="material-symbols-outlined">send</span>
                            Join Telegram
                        </button>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Live Now</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">Live Chat Support</h3>
                        <p className="text-slate-500 text-xs md:text-sm mb-4">Connect with a real person in less than 2 minutes.</p>
                        <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                            Start Chat
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
