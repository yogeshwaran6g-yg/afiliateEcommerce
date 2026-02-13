import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DUMMY_PRODUCTS = [
    { id: 1, name: 'Basic Affiliate Package', price: 999, image: 'https://placehold.co/100x100/e2e8f0/475569?text=Basic', description: 'Perfect for beginners starting their journey.' },
    { id: 2, name: 'Premium Partner Package', price: 2499, image: 'https://placehold.co/100x100/e2e8f0/475569?text=Premium', description: 'Advanced tools and higher commission rates.' },
    { id: 3, name: 'Elite Distributor Package', price: 4999, image: 'https://placehold.co/100x100/e2e8f0/475569?text=Elite', description: 'Full suite of features for top-tier distributors.' },
    { id: 4, name: 'Silver Growth Pack', price: 7999, image: 'https://placehold.co/100x100/e2e8f0/475569?text=Silver', description: 'Scale your business with professional tools.' },
    { id: 5, name: 'Gold Power Bundle', price: 12999, image: 'https://placehold.co/100x100/e2e8f0/475569?text=Gold', description: 'Maximum earning potential and priority support.' },
    { id: 6, name: 'Diamond Master Plan', price: 19999, image: 'https://placehold.co/100x100/e2e8f0/475569?text=Diamond', description: 'The ultimate distribution strategy.' },
    { id: 7, name: 'Startup Accelerator', price: 1500, image: 'https://placehold.co/100x100/e2e8f0/475569?text=Startup', description: 'Fast-track your onboarding process.' },
    { id: 8, name: 'Marketing Pro Kit', price: 3500, image: 'https://placehold.co/100x100/e2e8f0/475569?text=Marketing', description: 'Assets and templates for social media growth.' },
    { id: 9, name: 'Global Outreach Module', price: 8500, image: 'https://placehold.co/100x100/e2e8f0/475569?text=Global', description: 'Expand your network across borders.' },
    { id: 10, name: 'Executive Suite', price: 29999, image: 'https://placehold.co/100x100/e2e8f0/475569?text=Exec', description: 'Premium benefits and board-level insights.' }
];

export default function CompleteRegistration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        referralId: '',
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '+91',
        password: '',
        confirmPassword: '',
        selectedProduct: null,
        paymentType: '',
        proof: null
    });

    const [proofPreview, setProofPreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductDropdownChange = (e) => {
        const productId = parseInt(e.target.value);
        const product = DUMMY_PRODUCTS.find(p => p.id === productId);
        setFormData(prev => ({ ...prev, selectedProduct: product || null }));
    };

    const handleProofChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                return;
            }
            setFormData(prev => ({ ...prev, proof: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCopyUPI = () => {
        navigator.clipboard.writeText('pay@fintechmlm');
        alert('UPI ID copied to clipboard!');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (!formData.selectedProduct) {
            alert('Please select a product');
            return;
        }
        if (!formData.proof) {
            alert('Please upload payment proof');
            return;
        }

        console.log('Registration submitted:', formData);
        alert('Registration complete! Welcome aboard.');
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-12 px-4 sm:px-6 lg:px-8 font-display">
            <div className="max-w-5xl mx-auto">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 rounded-3xl shadow-2xl overflow-hidden mb-8 relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
                    <div className="relative p-10 text-center text-white">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
                            <span className="material-symbols-outlined text-5xl">person_add</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Complete Your Profile</h1>
                        <p className="text-lg opacity-95 font-medium max-w-2xl mx-auto">Join our exclusive network and unlock unlimited earning potential</p>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                        {/* Section 1: Personal Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold shadow-lg shadow-primary/20">1</div>
                                <h2 className="text-2xl font-black text-slate-900">Personal Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg text-primary">badge</span>
                                        First Name
                                    </label>
                                    <input type="text" name="firstName" required onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg text-primary">badge</span>
                                        Last Name
                                    </label>
                                    <input type="text" name="lastName" required onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm" placeholder="Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg text-primary">mail</span>
                                        Email Address
                                    </label>
                                    <input type="email" name="email" required onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg text-primary">link</span>
                                        Referral ID <span className="text-xs font-normal text-slate-500">(Optional)</span>
                                    </label>
                                    <input type="text" name="referralId" onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm" placeholder="REF-12345" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg text-primary">flag</span>
                                        Country Code
                                    </label>
                                    <select name="countryCode" onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm">
                                        <option value="+91">🇮🇳 +91 (India)</option>
                                        <option value="+1">🇺🇸 +1 (USA)</option>
                                        <option value="+44">🇬🇧 +44 (UK)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg text-primary">lock</span>
                                        Password
                                    </label>
                                    <input type="password" name="password" required onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm" placeholder="••••••••" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg text-primary">lock_reset</span>
                                        Confirm Password
                                    </label>
                                    <input type="password" name="confirmPassword" required onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm" placeholder="••••••••" />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100"></div>

                        {/* Section 2: Product Selection */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold shadow-lg shadow-primary/20">2</div>
                                <h2 className="text-2xl font-black text-slate-900">Choose Your Package</h2>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-full md:w-1/2 space-y-3">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg text-primary">inventory_2</span>
                                        Select a Product
                                    </label>
                                    <select
                                        className="w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm font-medium"
                                        onChange={handleProductDropdownChange}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>--- Choose Your Package ---</option>
                                        {DUMMY_PRODUCTS.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} - ₹{product.price.toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {formData.selectedProduct && (
                                    <div className="w-full md:w-1/2 flex items-center gap-4 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-5 rounded-2xl border-2 border-primary/20 shadow-lg animate-in fade-in slide-in-from-left-4 duration-300">
                                        <div className="relative">
                                            <img
                                                src={formData.selectedProduct.image}
                                                alt={formData.selectedProduct.name}
                                                className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-md"
                                            />
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                                <span className="material-symbols-outlined text-white text-sm">check</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-slate-900 text-base leading-tight mb-1">{formData.selectedProduct.name}</h4>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-primary font-black text-2xl">₹{formData.selectedProduct.price.toLocaleString()}</span>
                                                <span className="text-[10px] bg-gradient-to-r from-primary to-primary/80 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-md">Selected</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-slate-100"></div>

                        {/* Section 3: Payment */}
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
                                            onClick={() => setFormData(prev => ({ ...prev, paymentType: 'upi' }))}
                                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all shadow-sm hover:shadow-md ${formData.paymentType === 'upi' ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/10' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.paymentType === 'upi' ? 'bg-primary text-white' : 'bg-slate-100 text-primary'}`}>
                                                    <span className="material-symbols-outlined text-2xl">qr_code_2</span>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-900 block">UPI Payment</span>
                                                    <span className="text-xs text-slate-500">Quick & Secure</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => setFormData(prev => ({ ...prev, paymentType: 'bank' }))}
                                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all shadow-sm hover:shadow-md ${formData.paymentType === 'bank' ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/10' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.paymentType === 'bank' ? 'bg-primary text-white' : 'bg-slate-100 text-primary'}`}>
                                                    <span className="material-symbols-outlined text-2xl">account_balance</span>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-900 block">Bank Transfer</span>
                                                    <span className="text-xs text-slate-500">Direct Deposit</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-50/50 rounded-2xl border-2 border-slate-200 min-h-[240px] flex flex-col justify-center shadow-inner">
                                    {formData.paymentType === 'upi' && (
                                        <div className="text-center space-y-5">
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

                                    {formData.paymentType === 'bank' && (
                                        <div className="space-y-4">
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

                                    {!formData.paymentType && (
                                        <div className="text-center text-slate-400">
                                            <span className="material-symbols-outlined text-5xl mb-3 opacity-50">payments</span>
                                            <p className="text-sm font-medium">Select a payment method to view details</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100"></div>

                        {/* Section 4: Proof Upload */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold shadow-lg shadow-primary/20">4</div>
                                <h2 className="text-2xl font-black text-slate-900">Upload Payment Proof</h2>
                            </div>
                            <div className="max-w-lg mx-auto">
                                <div className="mt-1 flex justify-center px-8 pt-8 pb-8 border-3 border-slate-300 border-dashed rounded-3xl hover:border-primary transition-all cursor-pointer relative overflow-hidden group bg-gradient-to-br from-slate-50/50 to-transparent hover:shadow-lg">
                                    <div className="space-y-3 text-center w-full">
                                        {proofPreview ? (
                                            <div className="relative inline-block">
                                                <img src={proofPreview} alt="Proof" className="mx-auto h-56 w-auto rounded-2xl shadow-2xl border-4 border-white" />
                                                <button type="button" onClick={() => { setFormData(p => ({ ...p, proof: null })); setProofPreview(null); }} className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full p-2 shadow-xl hover:scale-110 transition-transform">
                                                    <span className="material-symbols-outlined text-lg">close</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer flex flex-col items-center">
                                                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                                    <span className="material-symbols-outlined text-primary text-5xl">cloud_upload</span>
                                                </div>
                                                <span className="text-base font-black text-slate-900 mb-1">Upload Payment Screenshot</span>
                                                <span className="text-sm text-slate-600 mb-3">Drag and drop or click to browse</span>
                                                <span className="text-xs text-slate-500 bg-slate-100 px-4 py-2 rounded-full font-medium">PNG, JPG, JPEG • Max 2MB</span>
                                                <input type="file" required name="proof" className="sr-only" onChange={handleProofChange} accept="image/*" />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full py-5 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white text-xl font-black rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <span>Complete Registration</span>
                                    <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
