import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setMobileSidebarOpen(!isMobileSidebarOpen);
    const closeSidebar = () => setMobileSidebarOpen(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <div className="flex w-full h-screen bg-[#f8fafc] font-display overflow-hidden">


            {/* Overlay for mobile */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-[#0b101b]/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
                    onClick={closeSidebar}
                ></div>
            )}

            <Sidebar
                isOpen={isMobileSidebarOpen}
                onClose={closeSidebar}
                isCollapsed={isCollapsed}
                onToggleCollapse={toggleCollapse}
            />

            <main className="flex-1 flex flex-col min-w-0 w-full transition-all duration-300">

                <Header onMenuClick={toggleSidebar} />
                <div className="flex-1 overflow-y-auto h-full">

                    <Outlet />
                </div>
            </main>
        </div>
    );
}
