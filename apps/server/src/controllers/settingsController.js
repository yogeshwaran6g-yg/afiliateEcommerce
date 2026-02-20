import settingsService from "../services/settingsService.js";
import { rtnRes } from "../utils/helper.js";

export const getWithdrawalSettings = async (req, res) => {
  try {
    const settings = await settingsService.getSettings([
      "withdraw_commission",
      "maximum_amount_per_withdraw",
    ]);

    // Provide defaults if not set
    const data = {
      withdraw_commission: parseFloat(settings.withdraw_commission ?? 5.0),
      maximum_amount_per_withdraw: parseFloat(settings.maximum_amount_per_withdraw ?? 50000.0),
    };

    return rtnRes(res, 200, "Withdrawal settings fetched successfully", data);
  } catch (error) {
    rtnRes(res, 500, "internalError")
  }
};

export const getShippingSettings = async (req, res) => {
  try {
    const shipping_cost = await settingsService.getSetting("shipping_cost", "12.00");

    return rtnRes(res, 200, "Shipping settings fetched successfully", {
      shipping_cost: parseFloat(shipping_cost)
    });
  } catch (error) {
    rtnRes(res, 500, "internalError")
  }
};

export default {
  getWithdrawalSettings,
  getShippingSettings
};
