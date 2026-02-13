import React, { createContext, useContext, useMemo } from "react";
import {
    useProfileQuery,
    useUpdateProfileMutation,
    useUpdateIdentityMutation,
    useUpdateAddressMutation,
    useUpdateBankMutation
} from "../hooks/useProfile";
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

    const user = profileData?.data?.user || profileData?.user || null;
    const profile = profileData?.data?.profile || profileData?.profile || null;
    const addresses = profileData?.data?.addresses || profileData?.addresses || [];

    const updateProfileMutation = useUpdateProfileMutation();
    const updateIdentityMutation = useUpdateIdentityMutation();
    const updateAddressMutation = useUpdateAddressMutation();
    const updateBankMutation = useUpdateBankMutation();

    // Calculate KYC status and progress (derived from backend data)
    const kycStatus = {
        identity: profile?.identity_status || 'NOT_SUBMITTED',
        address: profile?.address_status || 'NOT_SUBMITTED',
        bank: profile?.bank_status || 'NOT_SUBMITTED'
    };

    const overallKycStatus = useMemo(() => {
        const statuses = Object.values(kycStatus);
        if (statuses.every(s => s === 'VERIFIED')) return 'VERIFIED';
        if (statuses.some(s => s === 'PENDING' || s === 'VERIFIED')) return 'PARTIALLY_VERIFIED';
        if (statuses.some(s => s === 'REJECTED')) return 'ACTION_REQUIRED';
        return 'NOT_SUBMITTED';
    }, [kycStatus]);

    const kycProgress = useMemo(() => {
        const statuses = Object.values(kycStatus);
        const completed = statuses.filter(s => s === 'VERIFIED').length;
        return Math.round((completed / statuses.length) * 100);
    }, [kycStatus]);

    const value = useMemo(() => ({
        user,
        profile,
        addresses,
        kycStatus,
        overallKycStatus,
        kycProgress,
        isLoading,
        error: profileError,
        refetchProfile: refetch,
        updateProfile: updateProfileMutation.mutateAsync,
        updateIdentity: updateIdentityMutation.mutateAsync,
        updateAddress: updateAddressMutation.mutateAsync,
        updateBank: updateBankMutation.mutateAsync
    }), [
        user, profile, addresses, kycStatus, overallKycStatus, kycProgress,
        isLoading, profileError, refetch,
        updateProfileMutation, updateIdentityMutation, updateAddressMutation, updateBankMutation
    ]);

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};
