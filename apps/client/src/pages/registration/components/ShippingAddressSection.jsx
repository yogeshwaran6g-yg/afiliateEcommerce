import React from 'react';

export default function ShippingAddressSection({ formData, handleInputChange, errors }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold shadow-lg shadow-primary/20">3</div>
                <h2 className="text-2xl font-black text-slate-900">Shipping Address</h2>
            </div>
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-primary">home</span>
                        Street Address
                    </label>
                    <textarea 
                        name="address" 
                        required 
                        value={formData.address || ''}
                        onChange={handleInputChange} 
                        rows="2"
                        className={`w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 ${errors.address ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm resize-none`}
                        placeholder="House No, Building, Street, Area" 
                    />
                    {errors.address && <p className="text-xs text-red-500 font-medium ml-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg text-primary">location_city</span>
                            City
                        </label>
                        <input 
                            type="text" 
                            name="city" 
                            required 
                            value={formData.city || ''}
                            onChange={handleInputChange} 
                            className={`w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 ${errors.city ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm`}
                            placeholder="Mumbai" 
                        />
                        {errors.city && <p className="text-xs text-red-500 font-medium ml-1">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg text-primary">map</span>
                            State
                        </label>
                        <input 
                            type="text" 
                            name="state" 
                            required 
                            value={formData.state || ''}
                            onChange={handleInputChange} 
                            className={`w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 ${errors.state ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm`}
                            placeholder="Maharashtra" 
                        />
                        {errors.state && <p className="text-xs text-red-500 font-medium ml-1">{errors.state}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg text-primary">pin_drop</span>
                            Pincode
                        </label>
                        <input 
                            type="text" 
                            name="pincode" 
                            required 
                            value={formData.pincode || ''}
                            onChange={handleInputChange} 
                            className={`w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 ${errors.pincode ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm`}
                            placeholder="400001" 
                        />
                        {errors.pincode && <p className="text-xs text-red-500 font-medium ml-1">{errors.pincode}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
