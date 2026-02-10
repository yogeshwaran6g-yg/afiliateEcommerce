import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#f8fafc] font-display overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Header
                    onMenuToggle={() => setSidebarOpen(!isSidebarOpen)}
                />

                <main className="flex-1 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
