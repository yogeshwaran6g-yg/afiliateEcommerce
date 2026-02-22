import { api, handleServiceError } from "../util/axios";
import constants from "../config/constants";

const { settings: settingsEndpoints } = constants.endpoints;

export const getShippingSettings = async () => {
    try {
        const response = await api.get(settingsEndpoints.shipping);
        return response;
    } catch (error) {
        handleServiceError(error, "Get Shipping Settings");
    }
};

export default {
    getShippingSettings,
};
