import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Demo fallback for specific credentials if API fails or for immediate use
            if (mobileNumber === "9000000000" && password === "admin123") {
                await login(mobileNumber, password);
                navigate(from, { replace: true });
                return;
            }

            await login(mobileNumber, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-display bg-[#f8fafc]">
            {/* Left Side: Branding & Visuals */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#172b4d]">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay scale-110 hover:scale-100 transition-transform duration-10000 ease-linear"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-primary/80 via-transparent to-[#172b4d]/90"></div>
                </div>

                <div className="relative z-10 w-full p-20 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary font-black text-2xl shadow-2xl">
                            F
                        </div>
                        <span className="text-white text-xl font-black tracking-tighter">Fintech MLM <span className="text-white/50 font-medium">| Enterprise</span></span>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <h1 className="text-6xl font-black text-white leading-tight tracking-tighter">
                            Next Generation <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">Distributor Panel</span>
                        </h1>
                        <p className="text-xl text-white/70 font-medium leading-relaxed">
                            Empowering 1.2M+ distributors worldwide with real-time analytics, automated commissions, and enterprise-grade security.
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-12 h-12 rounded-full border-4 border-[#172b4d] shadow-xl" alt="" />
                            ))}
                        </div>
                        <p className="text-white/60 text-sm font-bold uppercase tracking-widest">
                            Joined by <span className="text-white">50k+</span> agencies this month
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative overflow-hidden">
                {/* Decorative background elements for mobile */}
                <div className="lg:hidden absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="lg:hidden absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

                <div className="w-full max-w-md space-y-10 relative">
                    <div>
                        <div className="lg:hidden w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/20 mb-8">
                            F
                        </div>
                        <h2 className="text-4xl font-black text-[#172b4d] tracking-tight">System Login</h2>
                        <p className="mt-4 text-slate-500 font-medium">Enter your credentials to access the secure dashboard.</p>

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <span className="material-symbols-outlined text-red-500">error</span>
                                <p className="text-xs font-bold text-red-600 uppercase tracking-wide">{error}</p>
                            </div>
                        )}
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        smartphone
                                    </span>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300"
                                        placeholder="+91 98765 43210"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Security Key</label>
                                    <a href="#" className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline">Recovery?</a>
                                </div>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        lock_person
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer mr-3"
                                />
                                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Automatic Session Persistence</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4.5 bg-primary text-white text-sm font-black rounded-2xl shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                        >
                            <div className={`absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12`}></div>
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <span>Establish Secure Link</span>
                                    <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-10 border-t border-slate-100 grid grid-cols-2 gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                            <span>Network Stable</span>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <span className="material-symbols-outlined text-xs">verified_user</span>
                            <span>AES-256 Encrypted</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
