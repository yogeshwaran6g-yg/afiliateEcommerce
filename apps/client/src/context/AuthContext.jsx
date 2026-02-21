import React, { createContext, useMemo, useContext, useEffect, useCallback } from "react";
import { useUser } from "../hooks/useAuthService";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        const { exp } = JSON.parse(jsonPayload);
        if (!exp) return false; // If no exp, assume valid
        const now = Math.floor(Date.now() / 1000);
        return exp < now;
    } catch (e) {   
        return true;
    }
};

export const AuthProvider = ({ children }) => {
    // Current user query - the source of truth for auth state
    const { data: user, isLoading, error, refetch } = useUser();

    const logout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        // We don't necessarily need to reload if we update state, 
        // but ProtectedRoute depends on isAuthenticated which should update.
        window.location.href = "/login";
    }, []);

    // Derived state
    const isAuthenticated = useMemo(() => {
        const token = localStorage.getItem("accessToken");
        return !!user && !!token && !isTokenExpired(token);
    }, [user]);

    // Check token on mount and periodically
    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("accessToken");
            if (token && isTokenExpired(token)) {
                toast.error("Session expired. Please log in again.", {
                    toastId: "auth-session-expired",
                });
                logout();
            }
        };

        checkToken();

        const interval = setInterval(checkToken, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [logout]);

    const value = useMemo(() => ({
        user,
        isAuthenticated,
        loading: isLoading,
        error: error ? (error.message || "An error occurred") : null,
        logout,
        refetchUser: refetch
    }), [user, isAuthenticated, isLoading, error, logout, refetch]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
