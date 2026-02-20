import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useVerifyOtpMutation, useResendOtpMutation } from "../hooks/useAuthService";
import useAuth from "../hooks/useAuth";

const Otp = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get userId, phone, purpose from session storage or location state
    const userId = location.state?.userId || sessionStorage.getItem("pendingUserId");
    const phone = location.state?.phone || sessionStorage.getItem("pendingPhone");
    const purpose = location.state?.purpose || sessionStorage.getItem("pendingPurpose");

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(() => {
        const storedExpiry = sessionStorage.getItem("otpExpiry");
        if (storedExpiry) {
            const remaining = Math.ceil((parseInt(storedExpiry) - Date.now()) / 1000);
            return remaining > 0 ? remaining : 0;
        }
        return 100;
    });
    const [localError, setLocalError] = useState("");

    const { error: authError } = useAuth();
    const verifyOtpMutation = useVerifyOtpMutation();
    const resendOtpMutation = useResendOtpMutation();

    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    const loading = verifyOtpMutation.isPending || resendOtpMutation.isPending;
    const error = verifyOtpMutation.error?.message || resendOtpMutation.error?.message || authError;

    useEffect(() => {
        if (!userId) {
            navigate("/signup");
        }
    }, [userId, navigate]);

    useEffect(() => {
        // Init expiry if not present
        if (!sessionStorage.getItem("otpExpiry")) {
            const expiry = Date.now() + 100 * 1000;
            sessionStorage.setItem("otpExpiry", expiry.toString());
        }
    }, []);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                const storedExpiry = sessionStorage.getItem("otpExpiry");
                if (storedExpiry) {
                    const remaining = Math.ceil((parseInt(storedExpiry) - Date.now()) / 1000);
                    setTimer(remaining > 0 ? remaining : 0);
                } else {
                    setTimer((prev) => prev - 1);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData("text").slice(0, 6);
        if (/^\d+$/.test(pasteData)) {
            const newOtp = pasteData.split("").concat(Array(6 - pasteData.length).fill(""));
            setOtp(newOtp);
            inputRefs[Math.min(pasteData.length, 5)].current.focus();
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        if (!userId || !phone || !purpose) {
            setLocalError("Session expired. Please restart the signup process.");
            console.error("Missing OTP parameters. userId:", userId, "phone:", phone, "purpose:", purpose);
            return;
        }

        try {
            await resendOtpMutation.mutateAsync({ userId, phone, purpose });
            const newTimer = 100;
            setTimer(newTimer);
            sessionStorage.setItem("otpExpiry", (Date.now() + newTimer * 1000).toString());
            setLocalError("");
            toast.success("OTP resent successfully!");
        } catch (err) {
            console.error("Resend Error:", err);
            toast.error(err?.message || "Failed to resend OTP. Please try again.");
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

        try {
            const response = await verifyOtpMutation.mutateAsync({ userId, otp: otpString });
            if (response.success) {
                // If the backend returns token/user (it should now), 
                // authApiService.verifyOtp already stored them in localStorage.

                sessionStorage.removeItem("pendingUserId");
                sessionStorage.removeItem("pendingPhone");
                sessionStorage.removeItem("pendingPurpose");
                sessionStorage.removeItem("otpExpiry");

                toast.success("Phone verified successfully!");
                navigate("/complete-registration");
            }
        } catch (err) {
            console.error("OTP Error:", err);
            toast.error(err?.message || "OTP verification failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-display">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl border border-slate-200 shadow-xl">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
                        V
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-slate-900 tracking-tight">
                        Verify OTP
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                        Enter the 6-digit code sent to your phone.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="flex justify-between gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                        ))}
                    </div>

                    {(localError || authError) && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 animate-shake">
                            {localError || authError}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : (
                                "Verify Account"
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        Didn't receive code?{" "}
                        <button
                            onClick={handleResend}
                            disabled={timer > 0}
                            className={`font-bold transition-colors ${timer > 0 ? "text-slate-400 cursor-not-allowed" : "text-primary hover:text-primary/80"
                                }`}
                        >
                            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                        </button>
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">shield</span>
                    Secure Verification
                </div>
            </div>
        </div>
    );
};

export default Otp;
