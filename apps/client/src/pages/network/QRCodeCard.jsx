import React from "react";

const QRCodeCard = () => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center shadow-sm">
            <div className="w-32 h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-5xl text-slate-300">
                    qr_code_2
                </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Network QR</h3>
            <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                <span className="material-symbols-outlined text-lg">share</span>
                Share QR
            </button>
        </div>
    );
};

export default QRCodeCard;
