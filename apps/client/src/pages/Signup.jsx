import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../hooks/useAuthService";
import useAuth from "../hooks/useAuth";

const Signup = () => {
    const { error: authError } = useAuth();
    const signupMutation = useSignupMutation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: " ",
        referralId: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState("");

    const loading = signupMutation.isPending;
    const error = signupMutation.error?.message || authError;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");

        if (formData.password !== formData.confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        try {
            const response = await signupMutation.mutateAsync(formData);
            if (response.success && response.data?.userId) {
                // Store userId, phone, purpose for OTP verification
                sessionStorage.setItem("pendingUserId", response.data.userId);
                sessionStorage.setItem("pendingPhone", formData.phone);
                sessionStorage.setItem("pendingPurpose", "signup");

                navigate("/verify-otp", {
                    state: {
                        userId: response.data.userId,
                        phone: formData.phone,
                        purpose: "signup"
                    }
                });
            }
        } catch (err) {
            console.error("Signup failed:", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-display">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl border border-slate-200 shadow-xl">
                {/* Logo and Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
                        F
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-slate-900 tracking-tight">
                        Join FintechMLM
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                        Start your journey as a first-class distributor today.
                    </p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {(localError || error) && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 mb-4 animate-shake">
                                {localError || error}
                            </div>
                        )}
                        {/* Full Name Field */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <div className="mt-1 relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                                    person
                                </span>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all"
                                    placeholder="Alex Thompson"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                            <div className="mt-1 relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                                    phone
                                </span>
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all"
                                    placeholder="9876543210"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        {/* <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <div className="mt-1 relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                                    mail
                                </span>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all"
                                    placeholder="alex@example.com"
                                    onChange={handleChange}
                                />
                            </div>
                        </div> */}

                        {/* Referral ID Field (Optional) */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Referral ID (Optional)</label>
                            <div className="mt-1 relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                                    link
                                </span>
                                <input
                                    name="referralId"
                                    type="text"
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all"
                                    placeholder="REF-12345"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                <div className="mt-1 relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all"
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 ml-1">Confirm</label>
                                <div className="mt-1 relative">
                                    <input
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all"
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 px-1">
                        <input
                            type="checkbox"
                            required
                            className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded-md"
                        />
                        <label className="text-xs text-slate-600 font-medium">
                            I agree to the <a href="#" className="font-bold text-primary">Terms of Service</a> and <a href="#" className="font-bold text-primary">Privacy Policy</a>
                        </label>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 mt-4 ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        Already have an account?{" "}
                        <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
