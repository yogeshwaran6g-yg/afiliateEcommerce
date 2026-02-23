import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-8 space-y-8 animate-pulse">
                <div className="h-16 bg-white rounded-2xl border border-slate-200"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-40 bg-white rounded-2xl border border-slate-200"></div>
                    <div className="h-40 bg-white rounded-2xl border border-slate-200"></div>
                    <div className="h-40 bg-white rounded-2xl border border-slate-200"></div>
                </div>
                <div className="h-96 bg-white rounded-2xl border border-slate-200"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if registration is incomplete (using the name placeholder logic)
    const isRegistrationIncomplete = user?.name?.startsWith("User_");

    if (isRegistrationIncomplete && location.pathname !== "/complete-registration") {
        return <Navigate to="/complete-registration" replace />;
    }

    if (!isRegistrationIncomplete && location.pathname === "/complete-registration") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
