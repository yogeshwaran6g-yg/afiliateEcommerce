import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useLogoutMutation } from "../hooks/useAuthService";
import { useUpdateProfileMutation } from "../hooks/useProfile";
import { ProfileContext } from "../context/ProfileContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { user: profileUser, updateProfile: updateProfileLegacy } = useContext(ProfileContext);
    const logoutMutation = useLogoutMutation();
    const updateProfileMutation = useUpdateProfileMutation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dob: "", // We don't have this in DB yet, but keeping for UI
        address_line1: "",
        city: "",
        state: "",
        pincode: "",
        profile_image: ""
    });

    useEffect(() => {
        if (user) {
            const defaultAddress = addresses?.find(a => a.is_default) || addresses?.[0] || {};
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                dob: "06/15/1992", // Placeholder
                address_line1: defaultAddress.address_line1 || "",
                city: defaultAddress.city || "",
                state: defaultAddress.state || "",
                pincode: defaultAddress.pincode || "",
                profile_image: profile?.profile_image || ""
            });
        }
    }, [user, profile, addresses]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profile_image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            await updateProfileMutation.mutateAsync({
                profile: {
                    profile_image: formData.profile_image
                },
                address: {
                    address_line1: formData.address_line1,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    country: "USA", // Default
                    is_default: true
                }
            });
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update profile:", err);
            alert("Failed to update profile.");
        }
    };

    const handleLogout = () => {
        logoutMutation.mutate();
        navigate("/login");
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-display">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navigation */}
                <Header toggleSidebar={() => setIsSidebarOpen(true)} />

                <div className="flex-1 px-4 md:px-8 py-4 md:py-8 overflow-y-auto">
                    {/* Breadcrumb - Hidden on mobile */}
                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 mb-6">
                        <a href="/dashboard" className="hover:text-primary">Dashboard</a>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-slate-900 font-medium">Profile & Verification</span>
                    </div>

                    {/* Page Header */}
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Profile & Verification</h1>
                        <p className="text-sm md:text-base text-slate-500">
                            Manage your personal information and KYC compliance status.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Left: Profile Information */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-8">
                                {/* Profile Header */}
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 pb-8 border-b border-slate-200 text-center md:text-left">
                                    <div className="relative">
                                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full overflow-hidden flex items-center justify-center">
                                            {formData.profile_image ? (
                                                <img src={formData.profile_image} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl md:text-3xl font-bold text-slate-400">{getInitials(formData.name)}</span>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-white border-2 border-white">
                                            <span className="material-symbols-outlined text-xs md:text-sm">check</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">{formData.name || "User Name"}</h2>
                                        <p className="text-slate-500 text-xs md:text-sm mb-2">Distributor ID: MLM-{user?.id || "00000"}</p>
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] md:text-xs font-bold rounded">TIER 1 ELITE</span>
                                            <span className="text-slate-400 text-xs md:text-sm">Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Oct 2023'}</span>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="px-4 py-2 border border-slate-300 rounded-lg text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Change Photo
                                    </button>
                                </div>

                                {/* Form */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 md:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 md:py-3 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                                />
                                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg">
                                                    check_circle
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 md:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-2">Date of Birth</label>
                                            <input
                                                type="text"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 md:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-2">Residential Address</label>
                                        <input
                                            type="text"
                                            name="address_line1"
                                            placeholder="Street Address"
                                            value={formData.address_line1}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 md:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 mb-3 text-sm"
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="City"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="px-4 py-2 md:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                            />
                                            <input
                                                type="text"
                                                name="state"
                                                placeholder="State/Prov"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="px-4 py-2 md:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                            />
                                            <input
                                                type="text"
                                                name="pincode"
                                                placeholder="ZIP Code"
                                                value={formData.pincode || formData.zip}
                                                onChange={handleChange}
                                                className="px-4 py-2 md:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleUpdateProfile}
                                        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                                    >
                                        Update Profile
                                    </button>
                                </div>
                            </div>

                            {/* Security Note */}
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6 flex gap-3">
                                <span className="material-symbols-outlined text-primary text-xl">info</span>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">Security Note</h4>
                                    <p className="text-xs text-slate-600">
                                        To change your registered email or official identity name, please contact our administrative support desk.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Verification Status */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Verification Progress */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-900">Verification</h3>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">UNDER REVIEW</span>
                                </div>

                                {/* Progress Steps */}
                                <div className="relative mb-8 mt-4">
                                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200"></div>
                                    <div className="absolute top-6 left-0 w-2/3 h-0.5 bg-primary"></div>

                                    <div className="relative flex justify-between">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white mb-2 text-sm">
                                                <span className="material-symbols-outlined text-sm">check</span>
                                            </div>
                                            <span className="text-[10px] font-semibold text-slate-900">IDENTITY</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white mb-2 text-sm">
                                                <span className="material-symbols-outlined text-sm">check</span>
                                            </div>
                                            <span className="text-[10px] font-semibold text-slate-900">ADDRESS</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-2 text-sm">
                                                03
                                            </div>
                                            <span className="text-[10px] font-semibold text-slate-400">BANK</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Identity Document */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-bold text-slate-900">Identity</h4>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">VERIFIED</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <span className="material-symbols-outlined text-slate-400">description</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-semibold text-slate-900 truncate">passport_alex_h.jpg</div>
                                            <div className="text-[10px] text-slate-500">Oct 12, 2023</div>
                                        </div>
                                        <button className="p-1.5 hover:bg-slate-100 rounded-lg">
                                            <span className="material-symbols-outlined text-slate-400 text-sm">visibility</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Proof of Residence */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-bold text-slate-900">Address</h4>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">REVIEWING</span>
                                    </div>
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                                        <span className="material-symbols-outlined text-3xl text-slate-300 mb-2">upload_file</span>
                                        <div className="text-xs font-semibold text-slate-900 mb-1">Upload document</div>
                                        <div className="text-[10px] text-slate-500 mb-2">Utility bill or bank statement</div>
                                        <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-700 transition-colors">
                                            Select File
                                        </button>
                                    </div>
                                </div>

                                <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors mb-3 text-sm">
                                    Submit Final KYC
                                </button>
                                <p className="text-[10px] text-center text-slate-500">
                                    Review our <a href="#" className="text-primary hover:underline">Verification Policy</a>
                                </p>
                            </div>

                            {/* Benefits Box */}
                            <div className="bg-primary rounded-2xl p-6 text-white">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-xl">verified_user</span>
                                    <h3 className="text-base font-bold">Verification Benefits</h3>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        <span className="text-xs">Unlimited withdrawals</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        <span className="text-xs">Direct downline access</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        <span className="text-xs">Elite tier incentives</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white border-t border-slate-200 mt-auto py-6">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-slate-500">
                        <div className="text-center md:text-left">© 2024 Fintech MLM Dashboard. All rights reserved.</div>
                        <div className="flex items-center gap-4 md:gap-6">
                            <a href="#" className="hover:text-primary">Privacy Policy</a>
                            <a href="#" className="hover:text-primary">Terms of Service</a>
                            <a href="#" className="hover:text-primary">Help Center</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
