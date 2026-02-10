import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Header({ toggleSidebar }) {
    const { user } = useAuth();

    // Get initials for avatar fallback
    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <header className="glass-header sticky top-0 z-10 px-4 md:px-8 py-3 md:py-4 border-b border-slate-200">
            <div className="flex items-center justify-between gap-4">
                {/* Left Section: Menu & Search */}
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>

                    {/* Logo for mobile - if needed, but usually we have it in sidebar */}
                    <Link to="/dashboard" className="md:hidden flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            F
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Available Payout - Hidden on small screens */}
                    <div className="text-right hidden sm:block">
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Available Payout</div>
                        <div className="text-xl font-bold text-primary">$4,250.00</div>
                    </div>

                    {/* Notification Bell */}
                    <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-slate-600">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full"></span>
                    </button>

                    {/* Action Buttons - Hidden on mobile */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login" className="px-4 py-2 border border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">login</span>
                            <span>Login</span>
                        </Link>

                        <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">download</span>
                            <span>Export</span>
                        </button>

                        <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">add</span>
                            <span>New Order</span>
                        </button>
                    </div>

                    {/* User Profile */}
                    <Link to="/profile" className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <div className="font-semibold text-sm truncate max-w-[120px]">{user?.name || "Guest User"}</div>
                            <div className="text-xs text-amber-600 font-medium">{user?.role === 'ADMIN' ? 'Administrator' : 'Distributor'}</div>
                        </div>
                        {user?.profile_image ? (
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-slate-200">
                                <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                                {getInitials(user?.name)}
                            </div>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}

