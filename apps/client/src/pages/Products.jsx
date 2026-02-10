import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CategoryFilter from "./products/CategoryFilter";
import ProductCard from "./products/ProductCard";
import { useProducts } from "../hooks/useProducts";

export default function Products() {
    const [viewMode, setViewMode] = useState("grid");
    const {
        products,
        categories,
        filters,
        updateFilters,
        isProductsLoading,
        isProductsError
    } = useProducts();

    const sortBy = filters.sort;
    const selectedCategory = filters.category_id;

    const setSortBy = (sort) => updateFilters({ sort });
    const setSelectedCategory = (category_id) => updateFilters({ category_id });

    return (
        <div className="p-4 md:p-8 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Products & Shop</h1>
                    <p className="text-sm md:text-base text-slate-500 mt-1">
                        Empowering your business with high-quality inventory and great PV points.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* View Toggle - Hidden on mobile */}
                    <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 md:p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                        >
                            <span className="material-symbols-outlined text-slate-600 text-lg md:text-xl">grid_view</span>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-1.5 md:p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                        >
                            <span className="material-symbols-outlined text-slate-600 text-lg md:text-xl">view_list</span>
                        </button>
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 md:flex-none px-3 py-2 border border-slate-300 rounded-lg text-xs md:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="newest">Newest Arrivals</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="pv">Highest PV</option>
                    </select>
                </div>
            </div>

            {/* Content with Category Filter */}
            <div className="flex flex-col lg:flex-row gap-8">
                <CategoryFilter
                    categories={categories}
                    onCategoryChange={setSelectedCategory}
                    activeCategory={selectedCategory}
                />

                {/* Products Grid */}
                <div className="flex-1">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
