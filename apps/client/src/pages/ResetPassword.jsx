import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useResetPasswordMutation, useResendOtpMutation } from "../hooks/useAuthService";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get userId and phone from location state
    const userId = location.state?.userId;
    const phone = location.state?.phone;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [timer, setTimer] = useState(100);
    const [localError, setLocalError] = useState("");

    const resetPasswordMutation = useResetPasswordMutation();
    const resendOtpMutation = useResendOtpMutation();

    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    const loading = resetPasswordMutation.isPending || resendOtpMutation.isPending;
    const mutationError = resetPasswordMutation.error?.message || resendOtpMutation.error?.message;

    useEffect(() => {
        if (!userId) {
            navigate("/forgot-password");
        }
    }, [userId, navigate]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        try {
            await resendOtpMutation.mutateAsync({ userId, phone, purpose: "forgot" });
            setTimer(100);
            setLocalError("");
        } catch (err) {
            console.error("Resend Error:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");

        const otpString = otp.join("");
        if (otpString.length < 6) {
            setLocalError("Please enter all 6 digits");
            return;
        }

        if (newPassword !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        try {
            const response = await resetPasswordMutation.mutateAsync({ userId, otp: otpString, newPassword });
            if (response.success) {
                navigate("/login");
            }
        } catch (err) {
            console.error("Reset Password Error:", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-display">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl border border-slate-200 shadow-xl">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-3xl">lock_reset</span>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-slate-900 tracking-tight">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                        Enter the code sent to your phone and your new password.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {(localError || mutationError) && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 animate-shake">
                                {localError || mutationError}
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">OTP Code</label>
                            <div className="flex justify-between gap-2 mb-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
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

                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        Didn't receive code?{" "}
                        <button
                            onClick={handleResend}
                            disabled={timer > 0}
                            className={`font-bold transition-colors ${timer > 0 ? "text-slate-400 cursor-not-allowed" : "text-primary hover:text-primary/80"}`}
                        >
                            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
