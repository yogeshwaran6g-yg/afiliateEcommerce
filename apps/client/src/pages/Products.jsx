import React, { useState } from "react";
import CategoryFilter from "./products/CategoryFilter";
import SortFilter from "./products/SortFilter";
import ProductCard from "./products/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { useGetProducts } from "../hooks/useProductService";

export default function Products() {
    const [viewMode, setViewMode] = useState("grid");
    const {
        categories,
        filters,
        updateFilters,
        isCategoriesLoading,
        isCategoriesError
    } = useProducts();

    const {
        data: productsData,
        isLoading: isProductsLoading,
        isError: isProductsError
    } = useGetProducts(filters);

    const products = productsData?.success ? productsData.data : [];

    const sortBy = filters.sort;
    const selectedCategory = filters.category_id;

    const setSortBy = (sort) => updateFilters({ sort });
    const setSelectedCategory = (category_id) => updateFilters({ category_id });

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                <span className="hover:text-primary cursor-pointer">Home</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-slate-900">Shop</span>
            </nav>

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-2">
                <div className="max-w-xl">
                    <h1 className="text-2xl md:text-3.5xl font-bold text-slate-900 tracking-tight">Products & Shop</h1>
                    <p className="text-sm md:text-base text-slate-500 mt-2 leading-relaxed">
                        Empowering your business with high-quality inventory.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto self-end lg:self-auto justify-end">
                    {/* View Toggle */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-xs text-primary" : "text-slate-500"}`}
                        >
                            <span className="material-symbols-outlined text-lg md:text-xl block">grid_view</span>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-xs text-primary" : "text-slate-500"}`}
                        >
                            <span className="material-symbols-outlined text-lg md:text-xl block">view_list</span>
                        </button>
                    </div>

                    {/* Category Dropdown */}
                    {/* <CategoryFilter
                        categories={categories}
                        onCategoryChange={setSelectedCategory}
                        activeCategory={selectedCategory}
                    /> */}

                    {/* Sort Dropdown */}
                    <SortFilter 
                        activeSort={sortBy}
                        onSortChange={setSortBy}
                    />
                </div>
            </div>

            {/* Products Grid */}
            <div className="w-full pt-4">
                {isProductsLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : isProductsError ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500">Error loading products. Please try again later.</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-lg">No products found in this category.</p>
                    </div>
                ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid'
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1"
                        }`}>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} viewMode={viewMode} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
