import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userApiService from "../services/userApiService";

export const USERS_QUERY_KEY = ["users"];
export const USER_DETAILS_QUERY_KEY = ["userDetails"];
export const KYC_QUERY_KEY = ["kyc"];

/**
 * Hook to fetch all users.
 */
export const useUsers = () => {
    return useQuery({
        queryKey: USERS_QUERY_KEY,
        queryFn: userApiService.getUsers,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook to fetch a single user's details.
 */
export const useUserDetails = (userId) => {
    return useQuery({
        queryKey: [...USER_DETAILS_QUERY_KEY, userId],
        queryFn: () => userApiService.getUserDetails(userId),
        enabled: !!userId,
    });
};

/**
 * Hook to update user details.
 */
export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, userData }) => userApiService.updateUser(userId, userData),
        onSuccess: (_, { userId }) => {
            queryClient.invalidateQueries({ queryKey: [...USER_DETAILS_QUERY_KEY, userId] });
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });
};

/**
 * Hook to fetch KYC records.
 */
export const useKYCRecords = (status) => {
    return useQuery({
        queryKey: [...KYC_QUERY_KEY, status || 'all'],
        queryFn: () => userApiService.getKYCRecords(status),
    });
};

/**
 * Hook to update KYC status.
 */
export const useUpdateKYCStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, type, status }) => userApiService.updateKYCStatus(userId, type, status),
        onSuccess: (_, { userId }) => {
            queryClient.invalidateQueries({ queryKey: [...KYC_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [...USER_DETAILS_QUERY_KEY, userId] });
        },
    });
};
