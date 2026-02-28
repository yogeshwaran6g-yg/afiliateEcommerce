import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productApiService from "../services/product.apiservice";

export const PRODUCTS_QUERY_KEY = ["products"];

/**
 * Hook to fetch products with optional params.
 */
export const useProducts = (params = {}) => {
    return useQuery({
        queryKey: [...PRODUCTS_QUERY_KEY, params],
        queryFn: () => productApiService.getProducts(params),
    });
};

/**
 * Hook to fetch a single product.
 */
export const useProductById = (id) => {
    return useQuery({
        queryKey: [...PRODUCTS_QUERY_KEY, id],
        queryFn: () => productApiService.getProductById(id),
        enabled: !!id,
    });
};

/**
 * Hook to create a new product.
 */
export const useCreateProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productData) => productApiService.createProduct(productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        },
    });
};

/**
 * Hook to update an existing product.
 */
export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, productData }) => productApiService.updateProduct(id, productData),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: [...PRODUCTS_QUERY_KEY, id] });
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        },
    });
};

/**
 * Hook to delete a product.
 */
export const useDeleteProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => productApiService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        },
    });
};
