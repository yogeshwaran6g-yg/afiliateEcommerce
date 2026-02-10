import { api } from "../util/axios";

class ProductService {
    async getProducts(params = {}) {
        try {
            const response = await api.get("/products", params);
            return response;
        } catch (error) {
            console.error("Get Products Error:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const response = await api.get(`/products/${id}`);
            return response;
        } catch (error) {
            console.error("Get Product By ID Error:", error);
            throw error;
        }
    }

    async createProduct(productData) {
        try {
            const response = await api.post("/products", productData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response;
        } catch (error) {
            console.error("Create Product Error:", error);
            throw error;
        }
    }

    async updateProduct(id, productData) {
        try {
            const response = await api.put(`/products/${id}`, productData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response;
        } catch (error) {
            console.error("Update Product Error:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const response = await api.delete(`/products/${id}`);
            return response;
        } catch (error) {
            console.error("Delete Product Error:", error);
            throw error;
        }
    }
}

export default new ProductService();
