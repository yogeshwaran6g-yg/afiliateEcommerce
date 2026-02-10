import React, { createContext, useContext, useMemo } from "react";
import { useProfileQuery, useUpdateProfileMutation } from "../hooks/useProfile";
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

    const updateProfileMutation = useUpdateProfileMutation();

    const user = profileData?.data?.user || profileData?.data || null;

    const updateProfile = async (profile, address) => {
        return updateProfileMutation.mutateAsync({ profile, address });
    };

    const value = useMemo(() => ({
        user,
        isLoading: isLoading || updateProfileMutation.isPending,
        error: profileError || updateProfileMutation.error,
        updateProfile,
        refetchProfile: refetch
    }), [user, isLoading, profileError, updateProfileMutation.isPending, updateProfileMutation.error, refetch]);

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};
