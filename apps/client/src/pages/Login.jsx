import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation, useRequestLoginOtpMutation } from "../hooks/useAuthService";
import useAuth from "../hooks/useAuth";

const Login = () => {
    const { error: authError } = useAuth();
    const loginMutation = useLoginMutation();
    const requestOtpMutation = useRequestLoginOtpMutation();

    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const loading = loginMutation.isPending || requestOtpMutation.isPending;
    const error = loginMutation.error?.message || requestOtpMutation.error?.message || authError;

    const handleSendOtp = async () => {
        if (!phone) return;
        try {
            const response = await requestOtpMutation.mutateAsync(phone);
            if (response.success) {
                setOtpSent(true);
            }
        } catch (err) {
            console.error("Failed to send OTP:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otpSent) {
            handleSendOtp();
            return;
        }

        try {
            const response = await loginMutation.mutateAsync({ phone, password, otp });
            if (response.success) {
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-display">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl border border-slate-200 shadow-xl">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
                        F
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-slate-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                        Securely sign in to your accounts
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        {/* Phone Field */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                            <div className="mt-1 relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                                    phone
                                </span>
                                <input
                                    type="tel"
                                    required
                                    disabled={otpSent}
                                    className={`appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all ${otpSent ? "bg-slate-50 text-slate-500" : ""}`}
                                    placeholder="9876543210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        {!otpSent && (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading || !phone}
                                className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        )}

                        {otpSent && (
                            <div className="space-y-4 animate-fadeIn">
                                {/* OTP Field */}
                                <div>
                                    <label className="text-sm font-bold text-slate-700 ml-1">OTP Code</label>
                                    <div className="mt-1 relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                                            pin
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all"
                                            placeholder="••••••"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                    <div className="mt-1 relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                                            lock
                                        </span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="appearance-none block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <span className="material-symbols-outlined text-xl">
                                                {showPassword ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded-md"
                            />
                            <label className="ml-2 block text-xs text-slate-600 font-medium">
                                Remember me
                            </label>
                        </div>
                        <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || (otpSent && (!otp || !password))}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 ${!otpSent ? "hidden" : ""}`}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors">
                            Create Account
                        </Link>
                    </p>
                </div>

                {otpSent && (
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-xs font-bold text-slate-400 hover:text-primary transition-colors"
                        >
                            Change Phone Number
                        </button>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">shield</span>
                    Enterprise Grade Security
                </div>
            </div>
        </div>
    );
};

export default Login;
