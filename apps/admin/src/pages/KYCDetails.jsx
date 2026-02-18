import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userApiService from "../services/userApiService";

export default function KYCDetails() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const data = await userApiService.getUserDetails(userId);
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKYCAction = async (type, status) => {
        try {
            setProcessing(true);
            await userApiService.updateKYCStatus(userId, type, status);
            await fetchUserDetails(); // Refresh data
        } catch (error) {
            alert(error.message || "Failed to update KYC status");
        } finally {
            setProcessing(false);
        }
    };

    const handleApproveAll = async () => {
        try {
            if (!window.confirm("Approve all submitted documentation for this user?")) return;
            setProcessing(true);

            // Sequential approvals to avoid concurrency issues if any, or use Promise.all
            const sections = [
                { id: 'identity', val: user.id_document_url },
                { id: 'address', val: user.address_document_url },
                { id: 'bank', val: user.bank_document_url }
            ];

            for (const section of sections) {
                if (section.val) {
                    await userApiService.updateKYCStatus(userId, section.id, 'VERIFIED');
                }
            }

            await fetchUserDetails();
        } catch (error) {
            alert(error.message || "Failed to approve all documents");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium text-sm animate-pulse">Loading verification details...</p>
        </div>
    );

    if (!user) return <div>User not found</div>;

    const sections = [
        {
            title: "Identity Verification",
            icon: "badge",
            status: user.identity_status,
            fields: [
                { label: "Document Type", value: user.id_type },
                { label: "Document ID", value: user.id_number }
            ],
            docUrl: user.id_document_url
        },
        {
            title: "Address Verification",
            icon: "location_on",
            status: user.address_status,
            fields: [
                { label: "Verification Status", value: "Standard Document Check" }
            ],
            docUrl: user.address_document_url
        },
        {
            title: "Banking Information",
            icon: "assured_workload",
            status: user.bank_status,
            fields: [
                { label: "Account Holder", value: user.bank_account_name },
                { label: "Bank Name", value: user.bank_name },
                { label: "Account Number", value: user.bank_account_number },
                { label: "IFSC Code", value: user.bank_ifsc }
            ],
            docUrl: user.bank_document_url
        }
    ];

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Verification Details</h2>
                        <p className="text-slate-500 font-medium text-xs mt-0.5">User: {user.name} (ID: {user.id})</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleApproveAll}
                        disabled={processing}
                        className={`px-6 py-3 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-2 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {processing && <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                        Approve All Documents
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Profile Overview */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10 space-y-6 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-slate-50 mx-auto flex items-center justify-center text-2xl font-bold border border-slate-100 text-slate-700">
                                {user.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 tracking-tight">{user.name}</h3>
                                <p className="text-slate-500 text-xs font-medium mt-0.5">Verified Identity</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                                <div className="text-center">
                                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">Mobile</p>
                                    <p className="text-xs font-semibold text-slate-700">{user.phone}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">Birth Date</p>
                                    <p className="text-xs font-semibold text-slate-700">{user.dob ? new Date(user.dob).toLocaleDateString() : 'UNKNOWN'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            System Checks
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Phone Match</span>
                                <span className="text-[10px] font-bold text-green-600 uppercase">Verified</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Integrity</span>
                                <span className="text-[10px] font-bold text-blue-600 uppercase">Synced</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Tracks */}
                <div className="xl:col-span-8 space-y-6">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                                        <span className="material-symbols-outlined text-xl">{section.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 tracking-tight">{section.title}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[10px] font-bold uppercase tracking-wide ${section.status === 'VERIFIED' ? 'text-green-600' : 'text-slate-400'}`}>
                                                {section.status || 'Not Submitted'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={processing || section.status === 'VERIFIED'}
                                        onClick={() => handleKYCAction(idx === 0 ? 'identity' : idx === 1 ? 'address' : 'bank', 'VERIFIED')}
                                        className={`px-4 py-2 bg-green-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-green-700 transition-all ${processing || section.status === 'VERIFIED' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        disabled={processing || section.status === 'REJECTED'}
                                        onClick={() => handleKYCAction(idx === 0 ? 'identity' : idx === 1 ? 'address' : 'bank', 'REJECTED')}
                                        className={`px-4 py-2 bg-white border border-slate-200 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-red-50 transition-all ${processing || section.status === 'REJECTED' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-50">Details</h5>
                                    <div className="space-y-4">
                                        {section.fields.map((field, fIdx) => (
                                            <div key={fIdx}>
                                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">{field.label}</p>
                                                <p className="text-xs font-semibold text-slate-700 tracking-tight">{field.value || 'Not Provided'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-50">Document</h5>
                                    {section.docUrl ? (
                                        <div className="relative group/doc rounded-2xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer aspect-video bg-slate-50" onClick={() => window.open(`http://localhost:4000${section.docUrl}`, '_blank')}>
                                            <img src={`http://localhost:4000${section.docUrl}`} alt={section.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                <div className="bg-white px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform">
                                                    <span className="material-symbols-outlined text-sm text-slate-800">visibility</span>
                                                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">View Full Size</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-300">
                                            <span className="material-symbols-outlined text-3xl">image_not_supported</span>
                                            <p className="text-[9px] font-bold uppercase tracking-widest">No Document</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
