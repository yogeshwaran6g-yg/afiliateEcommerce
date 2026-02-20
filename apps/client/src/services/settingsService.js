import { api } from "../util/axios";
import constants from "../config/constants";

const { settings: settingsEndpoints } = constants.endpoints;

const handleApiError = (error, context) => {
    console.error(`${context} Error:`, error.message || error);
    throw error;
};

export const getShippingSettings = async () => {
    try {
        const response = await api.get(settingsEndpoints.shipping);
        return response;
    } catch (error) {
        handleApiError(error, "Get Shipping Settings");
    }
};

export default {
    getShippingSettings,
};
