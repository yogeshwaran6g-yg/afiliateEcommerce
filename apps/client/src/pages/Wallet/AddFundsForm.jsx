import React, { useState } from 'react';

export default function AddFundsForm() {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        countryCode: '+91',
        paymentMethod: '',
        payslip: null
    });

    const [payslipPreview, setPayslipPreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, payslip: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPayslipPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Funds request submitted successfully! (This is a demo)');
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Payment Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="John Doe"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="john@example.com"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Country Code & Mobile */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                        <div className="flex">
                            <select
                                name="countryCode"
                                className="px-2 py-2 bg-slate-100 border border-slate-200 rounded-l-lg focus:outline-none border-r-0 text-xs font-semibold"
                                onChange={handleInputChange}
                            >
                                <option value="+91">+91 (IN)</option>
                                <option value="+1">+1 (US)</option>
                                <option value="+44">+44 (UK)</option>
                                <option value="+971">+971 (UAE)</option>
                            </select>
                            <input
                                type="tel"
                                name="mobile"
                                required
                                placeholder="9876543210"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Payment Method Dropdown */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Payment Method</label>
                        <select
                            name="paymentMethod"
                            required
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            onChange={handleInputChange}
                        >
                            <option value="">Select Method</option>
                            <option value="gpay">GPay</option>
                            <option value="phonepe">PhonePe</option>
                            <option value="bank_transfer">Bank Transfer</option>
                        </select>
                    </div>
                </div>

                {/* Conditional Payment Details */}
                {formData.paymentMethod === 'gpay' && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center">
                        <p className="text-sm font-semibold text-slate-700 mb-3 text-center">Scan QR Code to pay via GPay</p>
                        <div className="w-48 h-48 bg-white border border-slate-200 rounded-lg flex items-center justify-center mb-2">
                            <div className="text-slate-400 flex flex-col items-center">
                                <span className="material-symbols-outlined text-5xl mb-1">qr_code_2</span>
                                <span className="text-xs font-bold">GPAY QR CODE</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">Merchant: AI Affiliate Ecom</p>
                    </div>
                )}

                {formData.paymentMethod === 'phonepe' && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center">
                        <p className="text-sm font-semibold text-slate-700 mb-3 text-center">Scan QR Code to pay via PhonePe</p>
                        <div className="w-48 h-48 bg-white border border-slate-200 rounded-lg flex items-center justify-center mb-2">
                            <div className="text-slate-400 flex flex-col items-center">
                                <span className="material-symbols-outlined text-5xl mb-1">qr_code_2</span>
                                <span className="text-xs font-bold text-indigo-600">PHONEPE QR CODE</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">Merchant: AI Affiliate Ecom</p>
                    </div>
                )}

                {formData.paymentMethod === 'bank_transfer' && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <p className="text-sm font-semibold text-slate-700 mb-1 text-center">Bank Transfer Details</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-t border-slate-200 pt-3">
                            <span className="text-slate-500">Bank Name:</span>
                            <span className="font-semibold text-slate-800">State Bank of India</span>

                            <span className="text-slate-500">A/C Number:</span>
                            <span className="font-semibold text-slate-800 tracking-wider">30012345678</span>

                            <span className="text-slate-500">IFSC Code:</span>
                            <span className="font-semibold text-slate-800">SBIN0001234</span>

                            <span className="text-slate-500">Account Type:</span>
                            <span className="font-semibold text-slate-800">Current Account</span>
                        </div>
                    </div>
                )}

                {/* Payslip Upload Field */}
                {(formData.paymentMethod !== '') && (
                    <div className="space-y-1.5 pt-2">
                        <label className="text-sm font-semibold text-slate-700">Payslip (Upload Screenshot)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-primary transition-colors cursor-pointer relative">
                            <div className="space-y-1 text-center">
                                {payslipPreview ? (
                                    <div className="relative">
                                        <img src={payslipPreview} alt="Preview" className="mx-auto h-32 w-auto rounded-lg shadow-sm" />
                                        <button
                                            type="button"
                                            onClick={() => setPayslipPreview(null)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                        >
                                            <span className="material-symbols-outlined text-xs">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 flex flex-col items-center">
                                            <span className="material-symbols-outlined text-slate-400 text-4xl mb-2">cloud_upload</span>
                                            <span className="text-sm">Click to upload screenshot</span>
                                            <input type="file" name="payslip" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                        <p className="text-xs text-slate-500 mt-2">PNG, JPG up to 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!formData.paymentMethod}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-md ${formData.paymentMethod ? 'bg-primary hover:bg-primary/90' : 'bg-slate-300 cursor-not-allowed'
                        }`}
                >
                    Submit Payment Details
                </button>
            </form>
        </div>
    );
}
