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
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary font-bold text-xl shadow-xl">
                            A
                        </div>
                        <span className="text-white text-lg font-bold tracking-tight">Admin Panel <span className="text-white/40 font-normal">| Enterprise</span></span>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
                            Management <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">Dashboard Area</span>
                        </h1>
                        <p className="text-lg text-white/70 font-medium leading-relaxed">
                            Professional administration interface for managing users, monitoring growth, and overseeing platform performance.
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-white/10 shadow-xl" alt="" />
                            ))}
                        </div>
                        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">
                            Trusted by <span className="text-white">Active Admins</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative overflow-hidden">
                {/* Decorative background elements for mobile */}
                <div className="lg:hidden absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="lg:hidden absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

                <div className="w-full max-w-md space-y-8 relative">
                    <div>
                        <div className="lg:hidden w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 mb-8">
                            A
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Login</h2>
                        <p className="mt-2 text-slate-500 font-medium">Please enter your credentials to continue.</p>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <span className="material-symbols-outlined text-red-500">error</span>
                                <p className="text-xs font-bold text-red-600 uppercase tracking-wide">{error}</p>
                            </div>
                        )}
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Mobile Number</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">
                                        smartphone
                                    </span>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300"
                                        placeholder="Enter mobile number"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                    <a href="#" className="text-[11px] font-bold text-primary uppercase tracking-wider hover:underline">Forgot?</a>
                                </div>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">
                                        lock
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer mr-2.5"
                                />
                                <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/10 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <span>Login</span>
                                    <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            <span>System Active</span>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <span className="material-symbols-outlined text-sm">lock</span>
                            <span>Secure Session</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
