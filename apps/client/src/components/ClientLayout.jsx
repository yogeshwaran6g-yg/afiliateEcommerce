import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayout() {
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

    return (
        <div className="flex h-screen bg-[#f8fafc] font-display overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className={`flex-1 flex flex-col min-w-0 overflow-hidden relative transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}>
                <Header
                    toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                />

                <main className="flex-1 overflow-y-auto w-full flex flex-col">
                    <div className="flex-1">
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
}
