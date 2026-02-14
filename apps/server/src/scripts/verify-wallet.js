import walletService from "#services/walletService.js";
import withdrawalService from "#services/withdrawalService.js";
import rechargeService from "#services/rechargeService.js";
import { log } from "#utils/helper.js";

async function verify() {
  try {
    const userId = 1; // Assuming user ID 1 exists
    log("Testing wallet creation/fetching...", "info");
    const wallet = await walletService.getWalletByUserId(userId);
    console.log("Wallet:", wallet);

    log("Testing recharge request...", "info");
    const recharge = await rechargeService.createRechargeRequest(
      userId,
      500,
      "UPI",
      "recharge123",
      "proof.jpg",
    );
    console.log("Recharge Request:", recharge);

    log("Approving recharge...", "info");
    await rechargeService.approveRecharge(recharge.requestId, "Verified");

    const updatedWallet = await walletService.getWalletByUserId(userId);
    console.log("Updated Wallet Balance:", updatedWallet.balance);

    log("Testing withdrawal request...", "info");
    const withdrawal = await withdrawalService.createWithdrawalRequest(
      userId,
      100,
      { bank: "Test Bank" },
    );
    console.log("Withdrawal Request:", withdrawal);

    const walletAfterWithdrawalReq =
      await walletService.getWalletByUserId(userId);
    console.log(
      "Balance after withdrawal request:",
      walletAfterWithdrawalReq.balance,
      "Locked:",
      walletAfterWithdrawalReq.locked_balance,
    );

    log("Approving withdrawal...", "info");
    await withdrawalService.approveWithdrawal(withdrawal.requestId, "Approved");

    const finalWallet = await walletService.getWalletByUserId(userId);
    console.log(
      "Final Balance:",
      finalWallet.balance,
      "Locked:",
      finalWallet.locked_balance,
    );

    log("Verification complete!", "info");
    process.exit(0);
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
}

verify();
