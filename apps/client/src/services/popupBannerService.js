import { api, handleServiceError } from "../util/axios";
import constants from "../config/constants";

const { popupBanners: endpoints } = constants.endpoints;

export const getActivePopup = async () => {
    try {
        const response = await api.get(endpoints.active);
        return response;
    } catch (error) {
        handleServiceError(error, "Get Active Popup");
    }
};

export default { getActivePopup };
