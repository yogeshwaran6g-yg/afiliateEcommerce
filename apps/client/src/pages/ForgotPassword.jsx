import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../hooks/useAuthService";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const forgotPasswordMutation = useForgotPasswordMutation();
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");

    const loading = forgotPasswordMutation.isPending;
    const mutationError = forgotPasswordMutation.error?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!phone) {
            setError("Please enter your phone number");
            return;
        }

        try {
            const response = await forgotPasswordMutation.mutateAsync(phone);
            if (response.success && response.data?.userId) {
                navigate("/reset-password", {
                    state: {
                        userId: response.data.userId,
                        phone: phone
                    }
                });
            }
        } catch (err) {
            console.error("Forgot password failed:", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-display">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl border border-slate-200 shadow-xl">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
                        ?
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-slate-900 tracking-tight">
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                        Enter your phone number to reset your password.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {(error || mutationError) && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 animate-shake">
                                {error || mutationError}
                            </div>
                        )}

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
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Sending..." : "Send Reset Code"}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        Remember your password?{" "}
                        <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
