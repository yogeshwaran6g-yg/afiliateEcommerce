import React, { useContext, useEffect, useRef } from "react";
import { ProfileContext } from "../context/ProfileContext";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../hooks/useAuthService";
import { toast } from "react-toastify";
import { useUnreadCount } from "../hooks/useUserNotification";

import { useWallet } from "../hooks/useWallet";

export default function Header({ toggleSidebar }) {
  const { user, isLoading } = useContext(ProfileContext);
  const { totalItemsCount } = useCart();
  const { data: wallet } = useWallet();
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const { data: unreadCount = 0 } = useUnreadCount();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (unreadCount > 0 && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.info(`You have ${unreadCount} new notification${unreadCount > 1 ? 's' : ''}`, {
        toastId: 'unread-notifications',
        autoClose: 4000,
      });
    }
  }, [unreadCount]);

  return (
    <header className="glass-header sticky top-0 z-20 px-4 md:px-8 py-3 border-b border-primary/10 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 md:gap-8 w-full">
        {/* Left Section: Menu & Search */}
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <button
            onClick={toggleSidebar}
            className="p-2.5 hover:bg-primary/5 rounded-2xl text-slate-600 hover:text-primary transition-all active:scale-95 group focus:ring-4 focus:ring-primary/10"
            aria-label="Toggle Sidebar"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          {/* Search Bar */}
          <div className="hidden sm:block flex-1 group max-w-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-12 pr-12 py-2.5 bg-slate-50/50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white text-sm transition-all shadow-xs"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded-lg shadow-xs">
                <span className="text-[10px] font-bold text-slate-400">/</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden xs:flex items-center gap-3.5 px-4 py-2 bg-linear-to-r from-primary/10 to-transparent rounded-2xl border border-primary/10 group cursor-default hover:border-primary/20 transition-all">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-xs text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px] font-variation-fill">account_balance_wallet</span>
            </div>
            <div className="text-base md:text-xl font-bold text-primary">
              ₹{(wallet?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>


          <div className="flex items-center gap-2">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 bg-slate-50/50 hover:bg-primary/5 rounded-2xl transition-all group active:scale-95 text-slate-600 hover:text-primary border border-transparent hover:border-primary/10"
            >
              <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-transform group-hover:scale-110 transform -translate-x-1 translate-y-1">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-2.5 bg-slate-50/50 hover:bg-primary/5 rounded-2xl transition-all group active:scale-95 text-slate-600 hover:text-primary border border-transparent hover:border-primary/10"
            >
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-transform group-hover:scale-110 transform -translate-x-1 translate-y-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-4 pl-4 md:pl-6 border-l border-slate-200">
            {user && !isLoading ? (
              <div className="flex items-center gap-3 group px-2.5 py-1.5 rounded-2xl hover:bg-primary/5 transition-all cursor-pointer border border-transparent hover:border-primary/10" onClick={() => navigate("/profile")}>
                <div className="text-right hidden sm:block">
                  <div className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors leading-tight">
                    {user.name}
                  </div>
                  <div className="inline-flex mt-0.5 px-1.5 py-0.5 bg-primary/10 rounded-lg">
                    <span className="text-[9px] text-primary font-black uppercase tracking-tighter">
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20 group-active:scale-95 transition-all">
                  {getInitials(user.name)}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  className="p-2 text-slate-300 hover:text-danger hover:bg-danger/5 rounded-xl transition-all active:scale-95 ml-1 hidden lg:flex"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[22px]">logout</span>
                </button>
              </div>
            ) : !isLoading && (
              <Link
                to="/login"
                className="px-6 py-2.5 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-sm hover:shadow-lg hover:shadow-primary/20 active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
