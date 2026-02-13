import React from 'react';

export default function PaymentSection({ paymentType, setPaymentType, errors }) {
    const handleCopyUPI = () => {
        navigator.clipboard.writeText('pay@fintechmlm');
        alert('UPI ID copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold shadow-lg shadow-primary/20">3</div>
                <h2 className="text-2xl font-black text-slate-900">Payment Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-primary">payments</span>
                        Select Payment Method
                    </label>
                    <div className="space-y-3">
                        <div
                            onClick={() => setPaymentType('upi')}
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all shadow-sm hover:shadow-md ${paymentType === 'upi' ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/10' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentType === 'upi' ? 'bg-primary text-white' : 'bg-slate-100 text-primary'}`}>
                                    <span className="material-symbols-outlined text-2xl">qr_code_2</span>
                                </div>
                                <div>
                                    <span className="font-bold text-slate-900 block">UPI Payment</span>
                                    <span className="text-xs text-slate-500">Quick & Secure</span>
                                </div>
                            </div>
                        </div>
                        <div
                            onClick={() => setPaymentType('bank')}
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all shadow-sm hover:shadow-md ${paymentType === 'bank' ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/10' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentType === 'bank' ? 'bg-primary text-white' : 'bg-slate-100 text-primary'}`}>
                                    <span className="material-symbols-outlined text-2xl">account_balance</span>
                                </div>
                                <div>
                                    <span className="font-bold text-slate-900 block">Bank Transfer</span>
                                    <span className="text-xs text-slate-500">Direct Deposit</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {errors.paymentType && <p className="text-xs text-red-500 font-medium ml-1">{errors.paymentType}</p>}
                </div>

                <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-50/50 rounded-2xl border-2 border-slate-200 min-h-[240px] flex flex-col justify-center shadow-inner">
                    {paymentType === 'upi' && (
                        <div className="text-center space-y-5 animate-in fade-in duration-300">
                            <div className="w-36 h-36 bg-white mx-auto rounded-2xl border-2 border-slate-200 flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-6xl text-slate-300">qr_code_2</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">UPI ID</span>
                                <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border-2 border-slate-200 shadow-md">
                                    <span className="font-mono font-bold text-slate-900 text-sm">pay@fintechmlm</span>
                                    <button type="button" onClick={handleCopyUPI} className="text-primary hover:text-primary/80 transition-colors p-1 hover:bg-primary/10 rounded-lg">
                                        <span className="material-symbols-outlined text-xl">content_copy</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentType === 'bank' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <h4 className="font-black text-slate-900 text-lg flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                                <span className="material-symbols-outlined text-primary">account_balance</span>
                                Bank Details
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50">
                                    <span className="text-slate-600 font-medium">Bank Name</span>
                                    <span className="font-bold text-slate-900">Fintech Bank</span>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50">
                                    <span className="text-slate-600 font-medium">Account No</span>
                                    <span className="font-bold text-slate-900 font-mono">998877665544</span>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50">
                                    <span className="text-slate-600 font-medium">IFSC Code</span>
                                    <span className="font-bold text-slate-900 font-mono">FINB000123</span>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50">
                                    <span className="text-slate-600 font-medium">Holder Name</span>
                                    <span className="font-bold text-slate-900">FintechMLM Solutions</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {!paymentType && (
                        <div className="text-center text-slate-400">
                            <span className="material-symbols-outlined text-5xl mb-3 opacity-50">payments</span>
                            <p className="text-sm font-medium">Select a payment method to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
