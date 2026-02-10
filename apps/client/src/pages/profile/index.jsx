import React, { useState, useContext, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileForm from "./ProfileForm";
import VerificationStatus from "./VerificationStatus";
import VerificationBenefits from "./VerificationBenefits";
import { ProfileContext } from "../../context/ProfileContext";

export default function Profile() {
    const { user, isLoading, updateProfile } = useContext(ProfileContext);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        dob: "06/15/1992",
        street: "",
        city: "",
        state: "",
        zip: ""
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                // Add more fields if they exist in user object
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await updateProfile({
                name: formData.fullName,
                phone: formData.phone,
                // Add more profile fields
            }, {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zip: formData.zip
            });
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile: " + (error.message || "Unknown error"));
        }
    };

    if (isLoading && !user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-8 py-4 md:py-8">
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
                    Manage your personal information and KYC compliance status to unlock all features.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left: Profile Information */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-8">
                        <ProfileHeader
                            name={user?.name || "User"}
                            distributorId={user?.referralId || "N/A"}
                            tier={user?.rank || "Gold Member"}
                            joinDate={user?.joinDate || "N/A"}
                        />

                        <ProfileForm
                            formData={formData}
                            handleChange={handleChange}
                            onUpdate={handleUpdate}
                        />
                    </div>

                    {/* Security Note */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6 flex gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">info</span>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-sm mb-1">Security Note</h4>
                            <p className="text-xs md:text-sm text-slate-600">
                                To change your registered email or official identity name, please contact our administrative support desk with proof of change.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Verification Status */}
                <div className="lg:col-span-1 space-y-6">
                    <VerificationStatus />
                    <VerificationBenefits />
                </div>
            </div>

            {/* Footer Placeholder or Actual Footer if needed */}
            <footer className="mt-12 py-6 border-t border-slate-200 text-xs md:text-sm text-slate-500">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">© 2024 Fintech MLM Dashboard. All rights reserved.</div>
                    <div className="flex items-center gap-4 md:gap-6">
                        <a href="#" className="hover:text-primary">Privacy Policy</a>
                        <a href="#" className="hover:text-primary">Terms of Service</a>
                        <a href="#" className="hover:text-primary">Help Center</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
