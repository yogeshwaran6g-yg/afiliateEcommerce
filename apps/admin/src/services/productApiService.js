const API_BASE_URL = 'http://localhost:4000/api/v1';

const productApiService = {
    getProducts: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/admin/products?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch products');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.getProducts:', error);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch product');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.getProductById:', error);
            throw error;
        }
    },

    createProduct: async (productData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/products`, {
                method: 'POST',
                body: productData // Using FormData usually for images
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create product');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.createProduct:', error);
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
                method: 'PUT',
                body: productData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.updateProduct:', error);
            throw error;
        }
    },

    deleteProduct: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete product');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in productApiService.deleteProduct:', error);
            throw error;
        }
    }
};

export default productApiService;
