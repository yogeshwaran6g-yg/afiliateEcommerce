import React, { createContext, useMemo } from "react";
import { useUser } from "../hooks/useAuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Current user query - the source of truth for auth state
    const { data: user, isLoading, error } = useUser();

    // Derived state
    const isAuthenticated = !!user && !!localStorage.getItem("accessToken");

    const value = useMemo(() => ({
        user,
        isAuthenticated,
        loading: isLoading,
        error: error ? (error.message || "An error occurred") : null,
    }), [user, isAuthenticated, isLoading, error]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
