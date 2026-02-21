import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserDetails, useUpdateUserMutation } from "../hooks/useUserService";
import UserProfileSidebar from "../components/user-details/UserProfileSidebar";
import UserDetailsContent from "../components/user-details/UserDetailsContent";
import { toast } from "react-toastify";

export default function UserDetails() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('WALLET');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '' });

    const { data: user, isLoading: loading, error } = useUserDetails(userId);
    const updateUserMutation = useUpdateUserMutation();

    useEffect(() => {
        if (userId) {
            window.scrollTo(0, 0);
        }
    }, [userId]);

    useEffect(() => {
        if (user) {
            setEditData({
                name: user.name,
                email: user.email
            });
        }
    }, [user]);

    const handleSave = async () => {
        try {
            await updateUserMutation.mutateAsync({ userId, userData: editData });
            setIsEditing(false);
        } catch (err) {
            toast.error(err.message || "Failed to update profile");
        } 
    };

    const handleBlockToggle = async () => {
        try {
            const action = user.is_blocked ? 'unblock' : 'block';
            if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

            const updatedStatus = !user.is_blocked;
            await userApiService.updateUser(userId, { is_blocked: updatedStatus });
            setUser(prev => ({ ...prev, is_blocked: updatedStatus }));
            toast.success(`User ${updatedStatus ? 'blocked' : 'unblocked'} successfully`);
        } catch (err) {
            toast.error(err.message || "Failed to update block status");
        } finally {
            setIsBlocking(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-slate-400 font-medium text-sm animate-pulse">Loading user details...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-8 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto space-y-6">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="material-symbols-outlined text-4xl">error</span>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">User Not Found</h3>
                        <p className="font-medium text-slate-500 text-base leading-relaxed px-6">{error?.message || "The requested user profile does not exist or could not be loaded."}</p>
                    </div>
                    <button
                        onClick={() => navigate('/users')}
                        className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm hover:bg-slate-700 transition-all active:scale-[0.98]"
                    >
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-2 md:p-4 bg-slate-50/50">
            <div className="max-w-[1600px] mx-auto space-y-4">

                {/* Global Back Header */}
                <div className="flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
                    <button
                        onClick={() => navigate('/users')}
                        className="group flex items-center gap-3 pl-1 pr-5 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                        <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                        </div>
                        <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 uppercase tracking-wider transition-colors">Back to Users</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Profile Verified</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <UserProfileSidebar
                        user={user}
                        isEditing={isEditing}
                        editData={editData}
                        setEditData={setEditData}
                        handleSave={handleSave}
                        saving={updateUserMutation.isPending}
                        setIsEditing={setIsEditing}
                        handleBlockToggle={handleBlockToggle}
                        isBlocking={updateUserMutation.isPending}
                        setActiveTab={setActiveTab}
                        navigate={navigate}
                    />

                    <UserDetailsContent
                        user={user}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        userId={userId}
                        navigate={navigate}
                        refreshUser={fetchUserDetails}
                    />
                </div>

                {/* Footer Insight */}
                <div className="text-center pt-8 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Secure User Management System</p>
                </div>

            </div>
        </div>
    );
}
