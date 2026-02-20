import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../hooks/useAuthService";
import useAuth from "../hooks/useAuth";

const Login = () => {
    const { error: authError } = useAuth();
    const loginMutation = useLoginMutation();

    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const loading = loginMutation.isPending;
    const error = loginMutation.error?.message || authError;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginMutation.mutateAsync({ phone, password });
            if (response.success) {
                toast.success("Login successful! Welcome back.");
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Login failed:", err);
            toast.error(err?.message || "Login failed. Please check your credentials.");
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
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all"
                                    placeholder="9876543210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
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
                        <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || !phone || !password}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20`}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-500 font-medium">
                    Dont have an account? {" "}
                    <Link
                      to="/signup"
                      className="font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
                
            </div>
        </div>
    );
};

export default Login;
