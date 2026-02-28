import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    useProducts, 
    useDeleteProductMutation 
} from "../hooks/useProductService";
import { useCategories } from "../hooks/useCategory.hook";
import { toast } from "react-toastify";

// Components
import ProductHeader from "./products/components/ProductHeader";
import ProductStats from "./products/components/ProductStats";
import ProductList from "./products/components/ProductList";
import ProductDrawer from "./products/components/ProductDrawer";

export default function Products() {
    const navigate = useNavigate();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { data: products = [], isLoading, error } = useProducts();
    const { data: categories = [] } = useCategories();
    const deleteProductMutation = useDeleteProductMutation();

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setDrawerOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProductMutation.mutateAsync(id);
                toast.success("Product deleted successfully");
            } catch (err) {
                toast.error(err.message || "Failed to delete product");
            }
        }
    };

    const handleOpenDrawer = () => {
        setSelectedProduct(null);
        setDrawerOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.slug && p.slug.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.category_name && p.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    // Reset to first page when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Product Catalog...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="bg-red-50 border border-red-100 p-8 rounded-4xl text-center max-w-md">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                    <h3 className="text-xl font-black text-red-900 mb-2">Sync Failure</h3>
                    <p className="text-red-700 font-medium mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-500 text-white text-sm font-black rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                    >
                        Retry Sync
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10 relative">
            <ProductHeader 
                onAddProduct={handleOpenDrawer}
                onManageCategories={() => navigate("/categories")}
            />

            <ProductStats totalProducts={products.filter(p => p.is_active).length} />

            <ProductList 
                products={paginatedProducts}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                startIndex={startIndex}
                itemsPerPage={itemsPerPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Pagination Controls (Added back as they were implied by currentPage logic) */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-4">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            )}

            <ProductDrawer 
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                product={selectedProduct}
                categories={categories}
            />
        </div>
    );
}
