import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userApiService from "../services/userApiService";

export default function KYCDetails() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Decrypting User Dossier...</p>
        </div>
    );

    if (!user) return <div>User not found</div>;

    const sections = [
        {
            title: "Identity Protocol",
            icon: "badge",
            status: user.identity_status,
            fields: [
                { label: "Identity Type", value: user.id_type },
                { label: "Document Number", value: user.id_number }
            ],
            docUrl: user.id_document_url
        },
        {
            title: "Residential Registry",
            icon: "location_on",
            status: user.address_status,
            fields: [
                { label: "Verification Level", value: "Level 1 Physical Proof" }
            ],
            docUrl: user.address_document_url
        },
        {
            title: "Settlement Gateway",
            icon: "assured_workload",
            status: user.bank_status,
            fields: [
                { label: "Beneficiary Name", value: user.bank_account_name },
                { label: "Network Name", value: user.bank_name },
                { label: "Route Number", value: user.bank_account_number },
                { label: "Gateway Code", value: user.bank_ifsc }
            ],
            docUrl: user.bank_document_url
        }
    ];

    return (
        <div className="p-4 md:p-8 lg:p-10 space-y-10 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h2 className="text-4xl font-black text-[#172b4d] tracking-tighter">Verification Dossier</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Subject: {user.name} (UID-{user.id})</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
                        Approve Entire Dossier
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Profile Overview */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-[#0f172a] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full -mr-16 -mt-16 blur-2xl"></div>

                        <div className="relative z-10 space-y-8 text-center">
                            <div className="w-24 h-24 rounded-3xl bg-white/10 mx-auto flex items-center justify-center text-3xl font-black border border-white/10 backdrop-blur-md">
                                {user.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">{user.name}</h3>
                                <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">Authenticated Identity</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
                                <div className="text-center">
                                    <p className="text-white/30 text-[7px] font-black uppercase tracking-widest mb-1">Active Phone</p>
                                    <p className="text-[10px] font-black">{user.phone}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-white/30 text-[7px] font-black uppercase tracking-widest mb-1">Date of Birth</p>
                                    <p className="text-[10px] font-black">{user.dob ? new Date(user.dob).toLocaleDateString() : 'UNKNOWN'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            Security Clearance
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Match</span>
                                <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">VERIFIED</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">IP Integrity</span>
                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">GLOBAL-SYNC</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Tracks */}
                <div className="xl:col-span-8 space-y-8">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-8 hover:border-slate-200 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                                        <span className="material-symbols-outlined text-2xl font-black">{section.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-[#172b4d] uppercase tracking-tighter">{section.title}</h4>
                                        <span className={`inline-flex px-3 py-1 bg-slate-50 rounded-lg text-[8px] font-black border uppercase tracking-widest mt-1 ${section.status === 'VERIFIED' ? 'text-green-600' : 'text-slate-400'
                                            }`}>Status: {section.status || 'NOT_SUBMITTED'}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-5 py-2 bg-green-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-600 transition-all">Approve</button>
                                    <button className="px-5 py-2 bg-red-50 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all">Reject</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 pb-2">Extracted Intelligence</h5>
                                    <div className="grid grid-cols-1 gap-6">
                                        {section.fields.map((field, fIdx) => (
                                            <div key={fIdx}>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{field.label}</p>
                                                <p className="text-sm font-black text-[#172b4d] tracking-widest font-mono">{field.value || 'NO_RECORD'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 pb-2">Document Evidence</h5>
                                    {section.docUrl ? (
                                        <div className="relative group/doc rounded-3xl overflow-hidden border border-slate-200 shadow-lg cursor-pointer aspect-video bg-slate-100" onClick={() => window.open(`http://localhost:4000${section.docUrl}`, '_blank')}>
                                            <img src={`http://localhost:4000${section.docUrl}`} alt={section.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform">
                                                    <span className="material-symbols-outlined text-slate-900">visibility</span>
                                                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Expand Visual</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-300">
                                            <span className="material-symbols-outlined text-4xl">cloud_off</span>
                                            <p className="text-[9px] font-black uppercase tracking-widest">Evidence Not Found</p>
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
