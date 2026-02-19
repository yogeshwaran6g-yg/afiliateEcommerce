import { useState, useEffect, useCallback } from "react";
import commissionApiService from "../services/commissionApiService";
import { toast } from "react-toastify";

export const useCommissionConfig = () => {
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchConfigs = useCallback(async () => {
        try {
            setLoading(true);
            const data = await commissionApiService.getConfigs();

            // Default 6 levels if data is empty
            const defaultLevels = Array.from({ length: 6 }, (_, i) => ({
                level: i + 1,
                percent: 0,
                is_active: true
            }));

            // Merge with fetched data
            const merged = defaultLevels.map(def => {
                const found = data.find(d => d.level === def.level);
                return found ? { ...found } : def;
            });

            setLevels(merged);
        } catch (error) {
            console.error("Failed to fetch commission configs:", error);
            toast.error("Failed to load commission configuration");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfigs();
    }, [fetchConfigs]);

    const updateLevelProperty = (levelId, property, value) => {
        setLevels(prev => prev.map(l =>
            l.level === levelId ? { ...l, [property]: value } : l
        ));
    };

    const saveConfigs = async () => {
        try {
            setSaving(true);

            // Upsert each level
            const promises = levels.map(level =>
                commissionApiService.upsertConfig({
                    level: level.level,
                    percent: parseFloat(level.percent) || 0,
                    is_active: level.is_active ? 1 : 0
                })
            );

            await Promise.all(promises);
            toast.success("Commission structure updated successfully");
            await fetchConfigs();
            return true;
        } catch (error) {
            console.error("Failed to save commission configs:", error);
            toast.error("Failed to save commission configuration");
            return false;
        } finally {
            setSaving(false);
        }
    };

    return {
        levels,
        loading,
        saving,
        updateLevelProperty,
        saveConfigs,
        refresh: fetchConfigs
    };
};
