import { useQuery } from "@tanstack/react-query";
import { getActivePopup } from "../services/popupBannerService";

export const useActivePopup = () => {
    return useQuery({
        queryKey: ["popup-banner", "active"],
        queryFn: getActivePopup,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false,
    });
};
