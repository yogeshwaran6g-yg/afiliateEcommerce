import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();

    const mainItems = [
        { icon: "dashboard", label: "Dashboard", path: "/dashboard" },
        { icon: "share", label: "My Network", path: "/network" },
        { icon: "account_balance_wallet", label: "Wallet", path: "/wallet" },
        { icon: "bar_chart", label: "Reports", path: "/leaderboard" },
        { icon: "inventory_2", label: "Products", path: "/products" },
    ];

    const supportItems = [
        { icon: "settings", label: "Settings", path: "/profile" },
        { icon: "help_center", label: "Help Center", path: "/support" },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                md:relative md:translate-x-0
            `}>
                {/* Logo */}
                <Link to="/dashboard" onClick={onClose} className="p-6 flex items-center justify-between hover:opacity-80 transition-opacity">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            F
                        </div>
                        <div>
                            <div className="font-bold text-lg">FinMLM</div>
                            <div className="text-xs text-slate-500 uppercase tracking-tight">DISTRIBUTOR</div>
                        </div>
                    </div>
                </Link>
                {/* Mobile Close Button - separate it or put it outside Link if preferred */}
                <button onClick={onClose} className="absolute top-6 right-4 md:hidden text-slate-400 hover:text-slate-600">
                    <span className="material-symbols-outlined">close</span>
                </button>

                {/* Main Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {mainItems.map((item, i) => (
                        <Link
                            key={i}
                            to={item.path}
                            onClick={onClose}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive(item.path)
                                ? "bg-primary/10 text-primary border-r-4 border-primary"
                                : "text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    {/* Support Section */}
                    <div className="pt-6 pb-2">
                        <div className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Support
                        </div>
                        {supportItems.map((item, i) => (
                            <Link
                                key={i}
                                to={item.path}
                                onClick={onClose}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive(item.path)
                                    ? "bg-primary/10 text-primary"
                                    : "text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Invite Button */}
                <div className="p-4">
                    <Link
                        to="/network"
                        onClick={onClose}
                        className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined">person_add</span>
                        <span>Invite Member</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
