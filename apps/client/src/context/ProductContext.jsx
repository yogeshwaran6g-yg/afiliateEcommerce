import React, { createContext, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import productService from "../services/productService";
import categoryService from "../services/categoryService";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        category_id: null,
        sort: "newest",
        search: ""
    });

    // Fetch Products
    const {
        data: productsData,
        isLoading: isProductsLoading,
        isError: isProductsError,
        refetch: refetchProducts
    } = useQuery({
        queryKey: ["products", filters],
        queryFn: () => productService.getProducts(filters),
    });

    // Fetch Categories
    const {
        data: categoriesData,
        isLoading: isCategoriesLoading,
        isError: isCategoriesError
    } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoryService.getCategories(),
    });

    const products = productsData?.success ? productsData.data : [];
    const categories = categoriesData?.success ? categoriesData.data : [];

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const value = useMemo(() => ({
        products,
        categories,
        filters,
        updateFilters,
        isProductsLoading,
        isProductsError,
        isCategoriesLoading,
        isCategoriesError,
        refetchProducts
    }), [
        products,
        categories,
        filters,
        isProductsLoading,
        isProductsError,
        isCategoriesLoading,
        isCategoriesError,
        refetchProducts
    ]);

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
