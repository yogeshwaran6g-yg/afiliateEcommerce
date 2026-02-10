import { api } from "../util/axios";

class CategoryService {
    async getCategories() {
        try {
            const response = await api.get("/categories");
            return response;
        } catch (error) {
            console.error("Get Categories Error:", error);
            throw error;
        }
    }
}

export default new CategoryService();
