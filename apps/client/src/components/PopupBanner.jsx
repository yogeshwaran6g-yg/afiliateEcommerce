import React, { useState } from "react";
import { useActivePopup } from "../hooks/usePopupBanner";

export default function PopupBanner() {
    const { data, error, isLoading } = useActivePopup();
    const popup = data?.data || null;
    const [dismissed, setDismissed] = useState(false);

    // Only show after a fresh login (flag set in Login.jsx)
    const justLoggedIn = sessionStorage.getItem("just_logged_in") === "true";

    const handleClose = () => {
        setDismissed(true);
        sessionStorage.removeItem("just_logged_in");
    };

    // Don't render if: no popup data, still loading, dismissed, or not a fresh login
    if (!popup || isLoading || dismissed || !justLoggedIn) return null;

    const API_BASE = import.meta.env.VITE_API_URL || "";

    return (
        <>
            {/* Injected Styles */}
            <style>{`
                @keyframes popupFadeIn {
                    from { opacity: 0; transform: scale(0.85) translateY(30px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes popupFadeOut {
                    from { opacity: 1; transform: scale(1) translateY(0); }
                    to   { opacity: 0; transform: scale(0.85) translateY(30px); }
                }
                @keyframes overlayIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                .popup-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    animation: overlayIn 0.3s ease-out forwards;
                }
                .popup-overlay.closing {
                    opacity: 0;
                    transition: opacity 0.3s ease-out;
                }
                .popup-card {
                    position: relative;
                    width: 100%;
                    max-width: 440px;
                    background: linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,250,252,0.98));
                    border-radius: 28px;
                    overflow: hidden;
                    box-shadow:
                        0 25px 60px -15px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255,255,255,0.2),
                        inset 0 1px 0 rgba(255,255,255,0.8);
                    animation: popupFadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .popup-card.closing {
                    animation: popupFadeOut 0.3s ease-out forwards;
                }
                .popup-gradient-bar {
                    height: 5px;
                    background: linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #ec4899, #6366f1);
                    background-size: 200% 100%;
                    animation: shimmer 3s linear infinite;
                }
                .popup-logo-container {
                    display: flex;
                    justify-content: center;
                    padding: 32px 24px 16px;
                }
                .popup-logo {
                    width: 80px;
                    height: 80px;
                    border-radius: 20px;
                    object-fit: cover;
                    box-shadow: 0 8px 25px -5px rgba(99, 102, 241, 0.4);
                    border: 3px solid white;
                    animation: float 3s ease-in-out infinite;
                }
                .popup-logo-placeholder {
                    width: 80px;
                    height: 80px;
                    border-radius: 20px;
                    background: linear-gradient(135deg, #6366f1, #a855f7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 25px -5px rgba(99, 102, 241, 0.4);
                    animation: float 3s ease-in-out infinite;
                }
                .popup-body {
                    padding: 8px 28px 32px;
                    text-align: center;
                }
                .popup-title {
                    font-size: 22px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #1e293b, #6366f1);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 0 0 8px;
                    line-height: 1.3;
                }
                .popup-short-desc {
                    font-size: 14px;
                    font-weight: 600;
                    color: #64748b;
                    margin: 0 0 16px;
                    line-height: 1.5;
                }
                .popup-long-desc {
                    font-size: 13px;
                    color: #475569;
                    line-height: 1.7;
                    margin: 0 0 24px;
                    max-height: 180px;
                    overflow-y: auto;
                    padding: 0 4px;
                }
                .popup-long-desc::-webkit-scrollbar {
                    width: 4px;
                }
                .popup-long-desc::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .popup-close-btn {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    z-index: 10;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: none;
                    background: rgba(255,255,255,0.9);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    color: #64748b;
                }
                .popup-close-btn:hover {
                    background: #f1f5f9;
                    transform: rotate(90deg) scale(1.1);
                    color: #1e293b;
                }
                .popup-dismiss-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 12px 32px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    border: none;
                    border-radius: 14px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 15px -3px rgba(99, 102, 241, 0.5);
                }
                .popup-dismiss-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px -5px rgba(99, 102, 241, 0.6);
                }
            `}</style>

            {/* Overlay */}
            <div className="popup-overlay" onClick={handleClose}>
                {/* Card */}
                <div className="popup-card" onClick={(e) => e.stopPropagation()}>
                    {/* Gradient Top Bar */}
                    <div className="popup-gradient-bar" />

                    {/* Close Button */}
                    <button className="popup-close-btn" onClick={handleClose} aria-label="Close popup">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="4" y1="4" x2="12" y2="12" />
                            <line x1="12" y1="4" x2="4" y2="12" />
                        </svg>
                    </button>

                    {/* Logo */}
                    <div className="popup-logo-container">
                        {popup.logo ? (
                            <img
                                src={popup.logo.startsWith("http") ? popup.logo : `${API_BASE}${popup.logo}`}
                                alt={popup.title}
                                className="popup-logo"
                            />
                        ) : (
                            <div className="popup-logo-placeholder">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="popup-body">
                        <h2 className="popup-title">{popup.title}</h2>
                        {popup.short_description && (
                            <p className="popup-short-desc">{popup.short_description}</p>
                        )}
                        {popup.long_description && (
                            <p className="popup-long-desc">{popup.long_description}</p>
                        )}
                        <button className="popup-dismiss-btn" onClick={handleClose}>
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
