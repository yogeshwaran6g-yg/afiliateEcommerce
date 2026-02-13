import React from 'react';

export default function PersonalInfoSection({ formData, handleInputChange, errors }) {
    return (
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
                    <input 
                        type="text" 
                        name="firstName" 
                        required 
                        value={formData.firstName}
                        onChange={handleInputChange} 
                        className={`w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 ${errors.firstName ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm`}
                        placeholder="John" 
                    />
                    {errors.firstName && <p className="text-xs text-red-500 font-medium ml-1">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-primary">badge</span>
                        Last Name
                    </label>
                    <input 
                        type="text" 
                        name="lastName" 
                        required 
                        value={formData.lastName}
                        onChange={handleInputChange} 
                        className={`w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 ${errors.lastName ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm`}
                        placeholder="Doe" 
                    />
                    {errors.lastName && <p className="text-xs text-red-500 font-medium ml-1">{errors.lastName}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-primary">mail</span>
                        Email Address
                    </label>
                    <input 
                        type="email" 
                        name="email" 
                        required 
                        value={formData.email}
                        onChange={handleInputChange} 
                        className={`w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 ${errors.email ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm`}
                        placeholder="john@example.com" 
                    />
                    {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email}</p>}
                </div>
                {/* Note: Referral ID removed as per requirement */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-primary">flag</span>
                        Country Code
                    </label>
                    <select 
                        name="countryCode" 
                        value={formData.countryCode}
                        onChange={handleInputChange} 
                        className="w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm"
                    >
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
                    <input 
                        type="password" 
                        name="password" 
                        required 
                        value={formData.password}
                        onChange={handleInputChange} 
                        className={`w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 ${errors.password ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm`}
                        placeholder="••••••••" 
                    />
                    {errors.password && <p className="text-xs text-red-500 font-medium ml-1">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-primary">lock_reset</span>
                        Confirm Password
                    </label>
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        required 
                        value={formData.confirmPassword}
                        onChange={handleInputChange} 
                        className={`w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 ${errors.confirmPassword ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm`}
                        placeholder="••••••••" 
                    />
                    {errors.confirmPassword && <p className="text-xs text-red-500 font-medium ml-1">{errors.confirmPassword}</p>}
                </div>
            </div>
        </div>
    );
}
