import React from "react";

export default function AddressVerification({ data, onChange, onFileChange, onUpdate, isUpdating, status }) {
    const getStatusBadge = (status) => {
        const styles = {
            NOT_SUBMITTED: "bg-slate-100 text-slate-600",
            PENDING: "bg-blue-100 text-blue-700",
            VERIFIED: "bg-green-100 text-green-700",
            REJECTED: "bg-red-100 text-red-700"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${styles[status] || styles.NOT_SUBMITTED}`}>
                ● {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Address Verification</h3>
                {getStatusBadge(status || 'NOT_SUBMITTED')}
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Address Line 1</label>
                    <input
                        type="text"
                        name="address_line1"
                        value={data.address_line1 || ""}
                        onChange={onChange}
                        disabled={status === 'VERIFIED' || status === 'PENDING'}
                        placeholder="Street address, P.O. box, company name"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">City</label>
                    <input
                        type="text"
                        name="city"
                        value={data.city || ""}
                        onChange={onChange}
                        disabled={status === 'VERIFIED' || status === 'PENDING'}
                        placeholder="City"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">State</label>
                    <input
                        type="text"
                        name="state"
                        value={data.state || ""}
                        onChange={onChange}
                        disabled={status === 'VERIFIED' || status === 'PENDING'}
                        placeholder="State / Province / Region"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pincode</label>
                    <input
                        type="text"
                        name="pincode"
                        value={data.pincode || ""}
                        onChange={onChange}
                        disabled={status === 'VERIFIED' || status === 'PENDING'}
                        placeholder="6-digit pincode"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={data.country || ""}
                        onChange={onChange}
                        disabled={status === 'VERIFIED' || status === 'PENDING'}
                        placeholder="Country"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Upload Address Proof Document</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        onChange={(e) => onFileChange('address', e.target.files[0])}
                        disabled={status === 'VERIFIED' || status === 'PENDING'}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">home_pin</span>
                    <p className="text-sm font-medium text-slate-900">
                        {data.addressFile ? data.addressFile.name : "Click or drag to upload document"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Utility Bill, Rent Agreement, etc. (Max 5MB)</p>
                </div>
            </div>

            {(status === 'NOT_SUBMITTED' || status === 'REJECTED') && (
                <button
                    onClick={() => onUpdate('address')}
                    disabled={isUpdating || !data.addressFile}
                    className="bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                >
                    {isUpdating ? "Submitting..." : "Submit Address for Verification"}
                </button>
            )}
        </div>
    );
}
