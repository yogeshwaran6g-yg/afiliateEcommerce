import express from "express";
import walletController from "#controllers/walletController.js";
import withdrawalController from "#controllers/withdrawalController.js";
import rechargeController from "#controllers/rechargeController.js";
import paymentUpload from "#middlewares/paymentUploadMiddleware.js";
import passport from "passport";
import { rtnRes } from "#src/utils/helper.js";

const router = express.Router();

// All wallet routes require authentication
router.use(passport.authenticate("jwt", { session: false }));

router.get("/", walletController.getWallet);
router.get("/transactions", walletController.getTransactions);
router.get("/network-transactions", walletController.getNetworkTransactions);

// Withdraw request
router.post("/withdraw", withdrawalController.createRequest);

// Recharge upload middleware
const uploadProof = (req, res, next) => {
  paymentUpload.single("proof")(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return rtnRes(res, 400, err.message || "Upload error");
    }
    next();
  });
};

router.post("/recharge", uploadProof, rechargeController.createRequest);

// Status routes
router.get("/withdrawals", withdrawalController.getRequests);
router.get("/recharges", rechargeController.getRequests);

export default router;