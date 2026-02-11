import React, { createContext, useContext, useMemo } from "react";
import { useProfileQuery } from "../hooks/useProfile";
import { AuthContext } from "./AuthContext";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    // Only fetch profile if authenticated
    const {
        data: profileData,
        isLoading,
        error: profileError,
        refetch
    } = useProfileQuery(isAuthenticated);

    const user = profileData?.data?.user || profileData?.data || null;

    const value = useMemo(() => ({
        user,
        isLoading,
        error: profileError,
        refetchProfile: refetch
    }), [user, isLoading, profileError, refetch]);

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};
