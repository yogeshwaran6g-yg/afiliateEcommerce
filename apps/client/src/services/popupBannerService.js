import { api } from "../util/axios";
import constants from "../config/constants";

const { popupBanners: endpoints } = constants.endpoints;

export const getActivePopup = async () => {
    try {
        const response = await api.get(endpoints.active);
        return response;
    } catch (error) {
        console.error("Get Active Popup Error:", error.message || error);
        throw error;
    }
};

export default { getActivePopup };
