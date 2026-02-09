import React from "react";

export default function Support() {
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
        },
        {
            id: "#TK-8712",
            subject: "Wallet Authentication Error",
            lastUpdate: "Oct 12, 2023",
            status: "Open",
            statusColor: "bg-slate-100 text-slate-700"
        },
        {
            id: "#TK-8650",
            subject: "Missing Tier Bonus Achievement",
            lastUpdate: "Oct 10, 2023",
            status: "Resolved",
            statusColor: "bg-green-100 text-green-700"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-display">
            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                                F
                            </div>
                            <span className="text-lg font-bold text-slate-900">FinMLM <span className="font-normal">Support</span></span>
                        </div>
                        <nav className="flex items-center gap-6">
                            <a href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary">Dashboard</a>
                            <a href="/earnings" className="text-sm font-medium text-slate-600 hover:text-primary">Earnings</a>
                            <a href="/network" className="text-sm font-medium text-slate-600 hover:text-primary">Network</a>
                            <a href="/marketing" className="text-sm font-medium text-slate-600 hover:text-primary">Marketing</a>
                            <a href="/support" className="text-sm font-bold text-primary border-b-2 border-primary pb-4">Support</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-100 rounded-lg">
                            <span className="material-symbols-outlined text-slate-600">notifications</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg">
                            <span className="material-symbols-outlined text-slate-600">settings</span>
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                            S
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200 py-16">
                <div className="max-w-3xl mx-auto px-8 text-center">
                    <h1 className="text-5xl font-bold text-slate-900 mb-4">How can we help you?</h1>
                    <p className="text-slate-500 text-lg mb-8">
                        Search our knowledge base or reach out to our team for assistance.
                    </p>

                    {/* Search Bar */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search for articles, guides, and FAQs..."
                            className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                {/* Support Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {supportOptions.map((option, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-all"
                        >
                            <div className={`w-14 h-14 ${option.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                                <span className={`material-symbols-outlined text-3xl ${option.iconColor}`}>
                                    {option.icon}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{option.title}</h3>
                            <p className="text-slate-600 text-sm mb-4">{option.description}</p>
                            <a
                                href={option.link}
                                className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
                            >
                                {option.action}
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </a>
                        </div>
                    ))}
                </div>

                {/* Recent Support Tickets */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Recent Support Tickets</h2>
                        <a href="#" className="text-primary font-semibold text-sm hover:underline">
                            View all tickets
                        </a>
                    </div>

                    {/* Table */}
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Ticket ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Last Update
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-primary">{ticket.id}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-900 font-medium">
                                        {ticket.subject}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {ticket.lastUpdate}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ticket.statusColor}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg">
                                            <span className="material-symbols-outlined text-slate-400">visibility</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Load More */}
                    <div className="px-6 py-4 border-t border-slate-200 text-center">
                        <button className="text-slate-600 font-semibold text-sm hover:text-primary">
                            Load more history
                        </button>
                    </div>
                </div>

                {/* Still Need Help Banner */}
                <div className="bg-blue-50 rounded-2xl border border-blue-100 p-8 mt-12 flex items-center justify-between">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            Still can't find what you're looking for?
                        </h3>
                        <p className="text-slate-600">
                            Our dedicated support managers are available 24/7 to help you grow your distribution network.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                            Contact Sales
                        </button>
                        <button className="px-6 py-3 border border-slate-300 bg-white text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                            Call Support
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-12 py-6">
                <div className="max-w-7xl mx-auto px-8 flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">copyright</span>
                        <span>2023 FinMLM Global Support Center. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-primary">Privacy Policy</a>
                        <a href="#" className="hover:text-primary">Terms of Service</a>
                        <a href="#" className="hover:text-primary">Cookie Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
