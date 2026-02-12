import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from "../services/productService";

export const PRODUCT_QUERY_KEY = ["products"];

export const useGetProducts = (filters = {}) => {
    return useQuery({
        queryKey: [...PRODUCT_QUERY_KEY, filters],
        queryFn: () => getProducts(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useGetProductById = (id) => {
    return useQuery({
        queryKey: [...PRODUCT_QUERY_KEY, id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    });
};

export const useCreateProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productData) => createProduct(productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
        },
    });
};

export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, productData }) => updateProduct(id, productData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...PRODUCT_QUERY_KEY, variables.id] });
        },
    });
};


export const useDeleteProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
        },
    });
};

export const useToggleProductStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, is_active }) => updateProduct(id, { is_active }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...PRODUCT_QUERY_KEY, variables.id] });
        },
    });
};
