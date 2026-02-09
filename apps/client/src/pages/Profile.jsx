import React, { useState } from "react";

export default function Profile() {
    const [formData, setFormData] = useState({
        fullName: "Alex Harrison",
        email: "alex.harrison@example.com",
        phone: "+1 (555) 000-1234",
        dob: "06/15/1992",
        street: "",
        city: "",
        state: "",
        zip: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-display">
            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                F
                            </div>
                            <span className="text-lg font-bold text-slate-900">Fintech MLM</span>
                        </div>
                        <nav className="flex items-center gap-6">
                            <a href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary">Dashboard</a>
                            <a href="/distributors" className="text-sm font-medium text-slate-600 hover:text-primary">Distributors</a>
                            <a href="/earnings" className="text-sm font-medium text-slate-600 hover:text-primary">Earnings</a>
                            <a href="/profile" className="text-sm font-bold text-primary border-b-2 border-primary pb-4">Profile</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <button className="p-2 hover:bg-slate-100 rounded-lg">
                            <span className="material-symbols-outlined text-slate-600">notifications</span>
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                            A
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <a href="/dashboard" className="hover:text-primary">Dashboard</a>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-slate-900 font-medium">Profile & Verification</span>
                </div>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Profile & Verification</h1>
                    <p className="text-slate-500">
                        Manage your personal information and KYC compliance status to unlock all features.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-slate-200 p-8">
                            {/* Profile Header */}
                            <div className="flex items-start gap-6 mb-8 pb-8 border-b border-slate-200">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full overflow-hidden">
                                        <img src="/api/placeholder/96/96" alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                                        <span className="material-symbols-outlined text-sm">check</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Alex Harrison</h2>
                                    <p className="text-slate-500 text-sm mb-2">Distributor ID: MLM-98765</p>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">TIER 1 ELITE</span>
                                        <span className="text-slate-400 text-sm">Joined Oct 2023</span>
                                    </div>
                                </div>
                                <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                    Change Photo
                                </button>
                            </div>

                            {/* Form */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg">
                                                check_circle
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date of Birth</label>
                                        <input
                                            type="text"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Residential Address</label>
                                    <input
                                        type="text"
                                        name="street"
                                        placeholder="Street Address"
                                        value={formData.street}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 mb-3"
                                    />
                                    <div className="grid grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="State/Prov"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <input
                                            type="text"
                                            name="zip"
                                            placeholder="ZIP Code"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors">
                                    Update Profile
                                </button>
                            </div>
                        </div>

                        {/* Security Note */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6 flex gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">info</span>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 text-sm mb-1">Security Note</h4>
                                <p className="text-sm text-slate-600">
                                    To change your registered email or official identity name, please contact our administrative support desk with proof of change.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Verification Status */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Verification Progress */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Verification Status</h3>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">● Under Review</span>
                            </div>

                            {/* Progress Steps */}
                            <div className="relative mb-8">
                                <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200"></div>
                                <div className="absolute top-6 left-0 w-2/3 h-0.5 bg-primary"></div>

                                <div className="relative flex justify-between">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                                            <span className="material-symbols-outlined">check</span>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-900">IDENTITY</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                                            <span className="material-symbols-outlined">check</span>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-900">ADDRESS</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-2">
                                            03
                                        </div>
                                        <span className="text-xs font-semibold text-slate-400">BANK</span>
                                    </div>
                                </div>
                            </div>

                            {/* Identity Document */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold text-slate-900">Identity Document</h4>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">VERIFIED</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <span className="material-symbols-outlined text-slate-400">description</span>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-slate-900">passport_alex_h.jpg</div>
                                        <div className="text-xs text-slate-500">Uploaded on Oct 12, 2023</div>
                                    </div>
                                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                                        <span className="material-symbols-outlined text-slate-400">visibility</span>
                                    </button>
                                </div>
                            </div>

                            {/* Proof of Residence */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold text-slate-900">Proof of Residence</h4>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">UNDER REVIEW</span>
                                </div>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">upload_file</span>
                                    <div className="text-sm font-semibold text-slate-900 mb-1">Click to upload document</div>
                                    <div className="text-xs text-slate-500">Utility bill or bank statement (PDF, PNG, JPG)</div>
                                    <div className="text-xs text-slate-400 mt-2">Max size: 5MB · Last 3 months</div>
                                </div>
                            </div>

                            {/* Bank Verification */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold text-slate-900">Bank Verification</h4>
                                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded">NOT SUBMITTED</span>
                                </div>
                                <button className="w-full py-3 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                    Link Bank Account
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors mb-3">
                                Submit for Review
                            </button>
                            <p className="text-xs text-center text-slate-500">
                                By clicking submit, you agree to our <a href="#" className="text-primary hover:underline">Terms of Verification</a>
                            </p>
                        </div>

                        {/* Benefits Box */}
                        <div className="bg-primary rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-2xl">verified_user</span>
                                <h3 className="text-lg font-bold">Verify to unlock:</h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                    <span className="text-sm">Unlimited withdrawal amounts</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                    <span className="text-sm">Direct downline management</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                    <span className="text-sm">Premium distributor incentives</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-12 py-6">
                <div className="max-w-7xl mx-auto px-8 flex items-center justify-between text-sm text-slate-500">
                    <div>© 2024 Fintech MLM Dashboard. All rights reserved.</div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-primary">Privacy Policy</a>
                        <a href="#" className="hover:text-primary">Terms of Service</a>
                        <a href="#" className="hover:text-primary">Help Center</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
