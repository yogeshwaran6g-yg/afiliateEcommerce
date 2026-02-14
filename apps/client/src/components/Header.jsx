import React, { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";
import { useCart } from "../hooks/useCart";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../hooks/useAuthService";

export default function Header({ toggleSidebar }) {
  const { user, isLoading } = useContext(ProfileContext);
  const { totalItemsCount } = useCart();
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
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

  return (
    <header className="glass-header sticky top-0 z-10 px-4 md:px-8 py-3 md:py-4 border-b border-slate-200">
      <div className="flex items-center justify-between gap-4 md:gap-6">
        {/* Left Section: Menu & Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Search Bar - Hidden on small mobile */}
          <div className="hidden sm:block flex-1">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Available Payout - Simplified on mobile */}
          <div className="text-right hidden xs:block">
            <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wide hidden md:block">
              Available Payout
            </div>
            <div className="text-base md:text-xl font-bold text-primary">
              $4,250.00
            </div>
          </div>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors group"
          >
            <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">
              shopping_cart
            </span>
            {totalItemsCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-subtle">
                {totalItemsCount}
              </span>
            )}
          </Link>

          {/* Notification Bell */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-slate-600">
              notifications
            </span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full"></span>
          </button>

          {/* Action Buttons - Icons only on mobile */}
          <div className="flex items-center gap-1 md:gap-3">
            {!user && !isLoading && (
              <Link
                to="/login"
                className="p-2 md:px-4 md:py-2 border border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">login</span>
                <span className="hidden md:inline">Login</span>
              </Link>
            )}

            {user && !isLoading && (
              <button
                onClick={handleLogout}
                className="p-2 md:px-4 md:py-2 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-100 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="hidden md:inline">Logout</span>
              </button>
            )}

            <button className="p-2 md:px-4 md:py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">
                download
              </span>
              <span className="hidden md:inline">Export</span>
            </button>
          </div>

          {/* User Profile - Simplified on mobile */}
          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-200 group"
            >
              <div className="text-right hidden md:block">
                <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {user.name || "User"}
                </div>
                <div className="text-xs text-amber-600 font-medium">
                  {user.rank || "Member"}
                </div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-linear-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-base shadow-sm group-hover:shadow-md transition-all">
                {getInitials(user.name)}
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
