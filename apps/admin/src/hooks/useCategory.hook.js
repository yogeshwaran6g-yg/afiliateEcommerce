import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import categoryApiService from "../services/category.apiservice";

export const CATEGORIES_QUERY_KEY = ["categories"];

export const useCategories = (params = {}) => {
    return useQuery({
        queryKey: [...CATEGORIES_QUERY_KEY, params],
        queryFn: () => categoryApiService.getAllCategories(params),
    });
};

export const useCategoryById = (id) => {
    return useQuery({
        queryKey: [...CATEGORIES_QUERY_KEY, id],
        queryFn: () => categoryApiService.getCategoryById(id),
        enabled: !!id,
    });
};

export const useCreateCategoryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (categoryData) => categoryApiService.createCategory(categoryData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
        },
    });
};

export const useUpdateCategoryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, categoryData }) => categoryApiService.updateCategory(id, categoryData),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...CATEGORIES_QUERY_KEY, id] });
        },
    });
};

export const useDeleteCategoryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => categoryApiService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
        },
    });
};
