import { api } from "../util/axios";
import constants from "../config/constants";

const { categories: categoryEndpoints } = constants.endpoints;

export const getCategories = async () => {
    try {
        const response = await api.get(categoryEndpoints.base);
        return response;
    } catch (error) {
        console.error("Get Categories Error:", error);
        throw error;
    }
};

