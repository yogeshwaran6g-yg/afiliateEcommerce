import walletService from "#services/walletService.js";
import { rtnRes, log } from "#utils/helper.js";

const walletController = {
  getWallet: async function (req, res) {
    try {
      const userId = req.user.id;
      const wallet = await walletService.getWalletStats(userId);
      return rtnRes(res, 200, "Wallet fetched successfully.", wallet);
    } catch (e) {
      log(`getWallet error: ${e.message}`, "error");
      return rtnRes(res, 500, "Internal server error.");
    }
  },

  getTransactions: async function (req, res) {
    try {
      const userId = req.user.id;
      const { limit = 20, offset = 0 } = req.query;
      const transactions = await walletService.getWalletTransactions(
        userId,
        limit,
        offset,
      );
      return rtnRes(
        res,
        200,
        "Transactions fetched successfully.",
        transactions,
      );
    } catch (e) {
      log(`getTransactions error: ${e.message}`, "error");
      return rtnRes(res, 500, "Internal server error.");
    }
  },
};

export default walletController;
