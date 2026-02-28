import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import commissionApiService from "../services/commission.apiservice";
import { toast } from "react-toastify";

export const COMMISSION_CONFIG_QUERY_KEY = "commissionConfig";

export const useCommissionConfig = () => {
    const queryClient = useQueryClient();
    const [draftLevels, setDraftLevels] = useState([]);

    const { data: fetchedLevels, isLoading: loading } = useQuery({
        queryKey: [COMMISSION_CONFIG_QUERY_KEY],
        queryFn: async () => {
            const data = await commissionApiService.getConfigs();
            const defaultLevels = Array.from({ length: 6 }, (_, i) => ({
                level: i + 1,
                percent: 0,
                is_active: true
            }));
            return defaultLevels.map(def => {
                const found = data.find(d => d.level === def.level);
                return found ? { ...found } : def;
            });
        }
    });

    useEffect(() => {
        if (fetchedLevels) {
            setDraftLevels(fetchedLevels);
        }
    }, [fetchedLevels]);

    const saveMutation = useMutation({
        mutationFn: async (updatedLevels) => {
            const promises = updatedLevels.map(level =>
                commissionApiService.upsertConfig({
                    level: level.level,
                    percent: parseFloat(level.percent) || 0,
                    is_active: level.is_active ? 1 : 0
                })
            );
            return Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COMMISSION_CONFIG_QUERY_KEY] });
            toast.success("Commission structure updated successfully");
        },
        onError: (error) => {
            console.error("Failed to save commission configs:", error);
            toast.error("Failed to save commission configuration");
        }
    });

    const updateLevelProperty = (levelId, property, value) => {
        setDraftLevels(prev => prev.map(l =>
            l.level === levelId ? { ...l, [property]: value } : l
        ));
    };

    const saveConfigs = () => {
        saveMutation.mutate(draftLevels);
    };

    return {
        levels: draftLevels,
        loading,
        saving: saveMutation.isPending,
        updateLevelProperty,
        saveConfigs,
        refresh: () => queryClient.invalidateQueries({ queryKey: [COMMISSION_CONFIG_QUERY_KEY] })
    };
};
