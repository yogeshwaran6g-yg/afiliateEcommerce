import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();

    const navigationGroups = [
        {
            title: "Overview",
            items: [
                { icon: "dashboard", label: "Dashboard", path: "/dashboard" },
                { icon: "notifications", label: "Notifications", path: "/notifications" },
            ]
        },
        {
            title: "Store",
            items: [
                { icon: "storefront", label: "Products", path: "/products" },
                { icon: "shopping_bag", label: "Orders", path: "/orders" },
                { icon: "shopping_cart", label: "Cart", path: "/cart" },
                { icon: "inventory_2", label: "Inventory", path: "/inventory" },
            ]
        },
        {
            title: "Network",
            items: [
                { icon: "share", label: "My Network", path: "/network" },
                { icon: "groups", label: "Teams", path: "/teams" },
                { icon: "military_tech", label: "Ranks", path: "/ranks" },
                { icon: "leaderboard", label: "Leaderboard", path: "/leaderboard" },
            ]
        },
        {
            title: "Finance",
            items: [
                { icon: "account_balance_wallet", label: "Wallet", path: "/wallet" },
                { icon: "payments", label: "Withdrawals", path: "/withdrawals" },
            ]
        },
        {
            title: "System",
            items: [
                { icon: "settings", label: "Settings", path: "/profile" },
                { icon: "help_center", label: "Help Center", path: "/support" },
            ]
        }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            ></div>

            {/* Sidebar Drawer */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 flex flex-col h-screen ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Logo & Close Button */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            F
                        </div>
                        <div>
                            <div className="font-bold text-lg dark:text-white">FinMLM</div>
                            <div className="text-xs text-slate-500">DISTRIBUTOR</div>
                        </div>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden text-slate-500"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Navigation Groups */}
                <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar pb-6">
                    {navigationGroups.map((group, groupIdx) => (
                        <div key={groupIdx}>
                            <h3 className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                                {group.title}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item, itemIdx) => (
                                    <Link
                                        key={itemIdx}
                                        to={item.path}
                                        onClick={() => {
                                            if (window.innerWidth < 1024) onClose();
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all group ${isActive(item.path)
                                            ? "bg-primary/10 text-primary"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                            }`}
                                    >
                                        <span className={`material-symbols-outlined text-xl transition-colors ${isActive(item.path) ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`}>
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                        {isActive(item.path) && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Invite Button */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <Link
                        to="/network"
                        onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                        }}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        <span className="text-sm">Invite Member</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
