import React from "react";

export default function IdentityVerification({ data, onChange, onFileChange, onUpdate, isUpdating, status }) {
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
                <h3 className="text-lg font-bold text-slate-900">Identity Verification</h3>
                {getStatusBadge(status || 'NOT_SUBMITTED')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">ID Type</label>
                    <select
                        name="idType"
                        value={data.idType || ""}
                        onChange={onChange}
                        disabled={status === 'VERIFIED' || status === 'PENDING'}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    >
                        <option value="">Select ID Type</option>
                        <option value="Passport">Passport</option>
                        <option value="PAN">PAN Card</option>
                        <option value="Aadhaar">Aadhaar Card</option>
                        <option value="Driving License">Driving License</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">ID Number</label>
                    <input
                        type="text"
                        name="idNumber"
                        value={data.idNumber || ""}
                        onChange={onChange}
                        disabled={status === 'VERIFIED' || status === 'PENDING'}
                        placeholder="Enter ID number"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Upload Identity Document</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        onChange={(e) => onFileChange('identity', e.target.files[0])}
                        disabled={status === 'VERIFIED' || status === 'PENDING'}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">cloud_upload</span>
                    <p className="text-sm font-medium text-slate-900">
                        {data.identityFile ? data.identityFile.name : "Click or drag to upload document"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
            </div>

            {(status === 'NOT_SUBMITTED' || status === 'REJECTED') && (
                <button
                    onClick={() => onUpdate('identity')}
                    disabled={isUpdating || !data.identityFile}
                    className="bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                >
                    {isUpdating ? "Submitting..." : "Submit Identity for Verification"}
                </button>
            )}
        </div>
    );
}
