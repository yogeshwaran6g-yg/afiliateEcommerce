import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import Charts from "../components/Charts";
import TransactionsTable from "../components/TransactionsTable";

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-slate-50 font-display">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <main className="flex-1 flex flex-col min-w-0">
                <Header toggleSidebar={toggleSidebar} />

                <div className="p-4 md:p-8 space-y-6">
                    {/* Greeting */}
                    <div className="mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Good Morning, Alex!</h1>
                        <p className="text-slate-600 mt-1">Here's what's happening with your network today.</p>
                    </div>

                    {/* Stats Cards */}
                    <StatsCards />

                    {/* Charts */}
                    <Charts />

                    {/* Transactions */}
                    <TransactionsTable />
                </div>
            </main>
        </div>
    );
}
