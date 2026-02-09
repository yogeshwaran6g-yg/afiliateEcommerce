import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="glass-header sticky top-0 z-10 px-8 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between gap-6">
                {/* Search Bar */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search data, transactions, or network..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Available Payout */}
                    <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Available Payout</div>
                        <div className="text-xl font-bold text-primary">$4,250.00</div>
                    </div>

                    {/* Notification Bell */}
                    <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-slate-600">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full"></span>
                    </button>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
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
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div className="text-right">
                            <div className="font-semibold text-sm">Alex Thompson</div>
                            <div className="text-xs text-amber-600 font-medium">Gold Member</div>
                        </div>
                        <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                            AT
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
