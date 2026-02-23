import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useUserNotification } from "../hooks/useUserNotification";
import { toast } from "react-toastify";

export default function Header({ title = "Analytics Overview", onMenuClick }) {
    // Use unread_only to get the count for the bell
    const { data } = useUserNotification({ unread_only: true, limit: 100 });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [headerSearch, setHeaderSearch] = useState("");

    // Calculate count from items to be safer than total
    // If we have items but no total, use items length. 
    // If we have no items but server says total=5, we trust items (0) because it means 5 are likely not reachable or already read.
    const unreadCount = data?.items?.filter(n => !n.is_read).length || 0;
    const [hasToastShown, setHasToastShown] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (headerSearch.trim()) {
            const currentPath = window.location.pathname;
            if (currentPath.includes('/orders')) {
                navigate(`/orders?search=${encodeURIComponent(headerSearch)}`);
            } else if (currentPath.includes('/order-payment')) {
                navigate(`/order-payment?orderNumber=${encodeURIComponent(headerSearch)}`);
            } else {
                navigate(`/users?search=${encodeURIComponent(headerSearch)}`);
            }
        }
    };

    // Show toast on refresh if there are unread notifications
    useEffect(() => {
        if (unreadCount > 0 && !hasToastShown) {
            toast.info(`You have ${unreadCount} unread system alerts`, {
                toastId: "unread-alerts-summary"
            });
            setHasToastShown(true);
        }
    }, [unreadCount, hasToastShown]);

    return (
        <header className="h-16 md:h-20 flex items-center justify-between px-3 md:px-8 bg-white border-b border-slate-100 sticky top-0 z-20">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-1.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all shrink-0"
                >
                    <span className="material-symbols-outlined font-bold text-[22px]">menu</span>
                </button>
                <h1 className="text-sm md:text-xl font-semibold text-slate-800 truncate leading-tight">{title}</h1>

            </div>

            <div className="flex items-center gap-1.5 md:gap-6 shrink-0">
                {/* Search Bar - Hidden on mobile/tablet */}
                <div className="relative hidden lg:block w-64 xl:w-96">
                    <form onSubmit={handleSearch}>
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search accounts, txns..."
                            value={headerSearch}
                            onChange={(e) => setHeaderSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                        />
                    </form>
                </div>

                {/* Date Selector - Compact on mobile */}
                <button className="flex items-center gap-2 px-2.5 md:px-4 py-2 md:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm font-semibold text-[#172b4d] hover:bg-slate-100 transition-colors">
                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                    <span className="hidden sm:inline">Last 30 Days</span>
                </button>

                {/* Icons */}
                <div className="flex items-center gap-0.5 md:gap-2">
                    <Link to="/notifications" className="relative p-2 md:p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all group">
                        <span className="material-symbols-outlined text-[22px] md:text-2xl">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white px-1 shadow-sm">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </Link>
                    <button className="hidden sm:flex p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
                        <span className="material-symbols-outlined">help</span>
                    </button>
                </div>
            </div>


        </header>
    );
}
