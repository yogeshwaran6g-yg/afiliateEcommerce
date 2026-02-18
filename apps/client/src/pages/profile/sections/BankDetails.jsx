import React from "react";

export default function BankDetails({ data, onChange, onFileChange, onUpdate, isUpdating, status }) {
    const getStatusBadge = (status) => {
        const styles = {
            NOT_SUBMITTED: "bg-slate-100 text-slate-600 border-slate-200",
            PENDING: "bg-blue-100 text-blue-700 border-blue-200",
            VERIFIED: "bg-green-100 text-green-700 border-green-200",
            REJECTED: "bg-red-100 text-red-700 border-red-200"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${styles[status] || styles.NOT_SUBMITTED}`}>
                ● {status?.replace('_', ' ') || 'NOT SUBMITTED'}
            </span>
        );
    };

    const isVerified = status === 'VERIFIED';
    const isPending = status === 'PENDING';
    const isRejected = status === 'REJECTED';

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">account_balance</span>
                    <h3 className="text-lg font-bold text-slate-900">Bank Details</h3>
                </div>
                {getStatusBadge(status || 'NOT_SUBMITTED')}
            </div>

            {isRejected && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <span className="material-symbols-outlined text-red-500">error</span>
                    <div>
                        <p className="text-sm font-bold text-red-900">Verification Rejected</p>
                        <p className="text-xs text-red-700 mt-1">Please review your bank details and upload a clear document proof (Cancelled Cheque or Bank Statement) to re-verify.</p>
                    </div>
                </div>
            )}

            {isVerified && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    <div>
                        <p className="text-sm font-bold text-emerald-900">Verified Successfully</p>
                        <p className="text-xs text-emerald-700 mt-1">Your bank details are verified. You can now securely withdraw your earnings.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Account Holder Name</label>
                    <input
                        type="text"
                        name="account_name"
                        value={data.account_name || ""}
                        onChange={onChange}
                        disabled={isVerified || isPending}
                        placeholder="As per bank records"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm disabled:bg-slate-50 disabled:text-slate-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bank Name</label>
                    <input
                        type="text"
                        name="bank_name"
                        value={data.bank_name || ""}
                        onChange={onChange}
                        disabled={isVerified || isPending}
                        placeholder="Enter bank name"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm disabled:bg-slate-50 disabled:text-slate-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Account Number</label>
                    <input
                        type="text"
                        name="account_number"
                        value={data.account_number || ""}
                        onChange={onChange}
                        disabled={isVerified || isPending}
                        placeholder="Enter account number"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm disabled:bg-slate-50 disabled:text-slate-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">IFSC Code</label>
                    <input
                        type="text"
                        name="ifsc_code"
                        value={data.ifsc_code || ""}
                        onChange={onChange}
                        disabled={isVerified || isPending}
                        placeholder="Enter IFSC code"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm disabled:bg-slate-50 disabled:text-slate-500"
                    />
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Upload Cancelled Cheque / Bank Statement</label>
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors relative ${isVerified || isPending ? 'border-slate-100 bg-slate-50/50 cursor-not-allowed' : 'border-slate-200 hover:border-primary/50 cursor-pointer'}`}>
                    <input
                        type="file"
                        onChange={(e) => onFileChange('bank', e.target.files[0])}
                        disabled={isVerified || isPending}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className={`material-symbols-outlined text-4xl mb-2 ${isVerified || isPending ? 'text-slate-200' : 'text-slate-300'}`}>account_balance</span>
                    <p className={`text-sm font-medium ${isVerified || isPending ? 'text-slate-400' : 'text-slate-900'}`}>
                        {data.bankFile ? data.bankFile.name : (isVerified || isPending ? "Document Uploaded" : "Click or drag to upload document")}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
            </div>

            {(!isVerified && !isPending) && (
                <button
                    onClick={() => onUpdate('bank')}
                    disabled={isUpdating || !data.bankFile}
                    className="w-full bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-all text-sm disabled:opacity-50 shadow-lg shadow-primary/20 active:scale-[0.98]"
                >
                    {isUpdating ? "Submitting..." : isRejected ? "Re-submit Bank Details" : "Submit Bank Details for Verification"}
                </button>
            )}

            {isPending && (
                <div className="flex items-center justify-center gap-2 py-4 px-6 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 font-bold text-sm">
                    <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                    Verification in Progress
                </div>
            )}
        </div>
    );
}
