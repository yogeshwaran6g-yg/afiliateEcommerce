import { rtnRes } from "#utils/helper.js";
import comissionConfigService from "#services/comissionConfigService.js";

const comissionConfigController = {

  getConfigs: async (req, res) => {
    try {
      const configs = await comissionConfigService.getAllConfigs();
      rtnRes(res, 200, "Configs fetched successfully", configs);
    } catch (error) {
      console.error("Error fetching configs:", error);
      rtnRes(res, 500, "Internal server error");
    }
  },

  updateConfig: async (req, res) => {
    try {
      const { level, percent, is_active } = req.body;
      
      // Basic validation
      if (!level || percent === undefined) {
        return rtnRes(
            res,
            400,
            "Level and percent are required"
          );
      }

      await comissionConfigService.upsertConfig(level, percent, is_active);
      rtnRes(res, 200, "Config updated successfully");
    } catch (error) {
      console.error("Error updating config:", error);
      rtnRes(res, 500, error.message || "Internal server error");
    }
  },

  deleteConfig: async (req, res) => {
      try {
          const { level } = req.params;
          if(!level) return rtnRes(res, 400, "Level is required");

          await comissionConfigService.deleteConfig(level);
          rtnRes(res, 200, "Config deleted successfully");
      } catch (error) {
          console.error("Error deleting config:", error);
          rtnRes(res, 500, "Internal server error");
      }
  }

};

export default comissionConfigController;
