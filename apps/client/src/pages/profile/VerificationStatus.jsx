import React from "react";

export default function VerificationStatus() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Verification Status</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">● Under Review</span>
            </div>

            {/* Progress Steps */}
            <div className="relative mb-8 mt-4">
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200"></div>
                <div className="absolute top-6 left-0 w-2/3 h-0.5 bg-primary"></div>

                <div className="relative flex justify-between">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                            <span className="material-symbols-outlined text-sm md:text-base">check</span>
                        </div>
                        <span className="text-[10px] md:text-xs font-semibold text-slate-900">IDENTITY</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                            <span className="material-symbols-outlined text-sm md:text-base">check</span>
                        </div>
                        <span className="text-[10px] md:text-xs font-semibold text-slate-900">ADDRESS</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-2">
                            03
                        </div>
                        <span className="text-[10px] md:text-xs font-semibold text-slate-400">BANK</span>
                    </div>
                </div>
            </div>

            {/* Identity Document */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-900">Identity Document</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] md:text-xs font-bold rounded">VERIFIED</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="material-symbols-outlined text-slate-400 text-lg">description</span>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs md:text-sm font-semibold text-slate-900 truncate">passport_alex_h.jpg</div>
                        <div className="text-[10px] md:text-xs text-slate-500">Uploaded on Oct 12, 2023</div>
                    </div>
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg">
                        <span className="material-symbols-outlined text-slate-400 text-sm md:text-base">visibility</span>
                    </button>
                </div>
            </div>

            {/* Proof of Residence */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-900">Proof of Residence</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] md:text-xs font-bold rounded">UNDER REVIEW</span>
                </div>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 md:p-8 text-center">
                    <span className="material-symbols-outlined text-3xl md:text-4xl text-slate-300 mb-2 md:mb-3">upload_file</span>
                    <div className="text-xs md:text-sm font-semibold text-slate-900 mb-1">Click to upload document</div>
                    <div className="text-[10px] md:text-xs text-slate-500">Utility bill or bank statement (PDF, PNG, JPG)</div>
                </div>
            </div>

            {/* Bank Verification */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-900">Bank Verification</h4>
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] md:text-xs font-bold rounded">NOT SUBMITTED</span>
                </div>
                <button className="w-full py-2 md:py-3 border border-slate-300 rounded-lg text-xs md:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    Link Bank Account
                </button>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors mb-3 text-sm">
                Submit for Review
            </button>
            <p className="text-[10px] md:text-xs text-center text-slate-500">
                By clicking submit, you agree to our <a href="#" className="text-primary hover:underline">Terms of Verification</a>
            </p>
        </div>
    );
}
