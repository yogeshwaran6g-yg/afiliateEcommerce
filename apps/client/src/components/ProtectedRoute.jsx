import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
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
