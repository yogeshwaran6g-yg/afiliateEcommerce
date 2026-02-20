import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useResetPasswordMutation, useUpdatePasswordMutation } from "../hooks/useAuthService";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // isUpdate means user is coming from settings (authenticated)
    const isUpdate = location.state?.isUpdate === true;
    // For forgot password flow (unauthenticated)
    const userId = location.state?.userId;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState("");

    const resetPasswordMutation = useResetPasswordMutation();
    const updatePasswordMutation = useUpdatePasswordMutation();

    const loading = resetPasswordMutation.isPending || updatePasswordMutation.isPending;
    const mutationError = resetPasswordMutation.error?.message || updatePasswordMutation.error?.message;

    useEffect(() => {
        if (!isUpdate && !userId) {
            navigate("/forgot-password");
        }
    }, [isUpdate, userId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");

        if (newPassword !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        try {
            if (isUpdate) {
                if (!oldPassword) {
                    setLocalError("Old password is required");
                    return;
                }
                const response = await updatePasswordMutation.mutateAsync({ oldPassword, newPassword });
                if (response.success) {
                    toast.success("Password updated successfully!");
                    navigate("/settings");
                }
            } else {
                const otpString = otp.join("");
                if (otpString.length < 6) {
                    setLocalError("Please enter all 6 digits");
                    return;
                }
                const response = await resetPasswordMutation.mutateAsync({ userId, otp: otpString, newPassword });
                if (response.success) {
                    toast.success("Password reset successful! Please sign in.");
                    navigate("/login");
                }
            }
        } catch (err) {
            console.error("Password reset error:", err);
            toast.error(err?.message || "Operation failed. Please try again.");
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (value && nextInput) {
            nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
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
                        {isUpdate ? "Update Password" : "Reset Password"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                        {isUpdate
                            ? "Set a new password for your account."
                            : "Enter the code sent to your phone and your new password."}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {(localError || mutationError) && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 animate-shake">
                                {localError || mutationError}
                            </div>
                        )}

                        {!isUpdate ? (
                            <div>
                                <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">OTP Code</label>
                                <div className="flex justify-between gap-2 mb-4">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
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
                        ) : (
                            <div>
                                <label className="text-sm font-bold text-slate-700 ml-1">Old Password</label>
                                <div className="mt-1 relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all shadow-sm"
                                        placeholder="••••••••"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all shadow-sm"
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
                                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-all shadow-sm"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.01] active:scale-[0.99]"}`}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="size-4 border-2 border-slate-300 border-t-white rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </div>
                            ) : (isUpdate ? "Update Password" : "Reset Password")}
                        </button>
                    </div>
                </form>

                {isUpdate && (
                    <div className="text-center">
                        <button
                            onClick={() => navigate("/settings")}
                            className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Cancel and Return
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
