import { queryRunner } from './src/config/db.js';
import withdrawalService from './src/services/withdrawalService.js';
import rechargeService from './src/services/rechargeService.js';
import userNotificationService from './src/services/userNotificationService.js';

async function testFlows() {
    try {
        console.log("--- Starting Wallet Flow Tests ---");

        // 1. Create a dummy user and wallet if not exists (assume user 1 exists for test)
        const userId = 1;
        
        // --- Withdrawal Approval Test ---
        console.log("\nTesting Withdrawal Approval...");
        // Mock a request by inserting into DB directly for test
        const [wrResult] = await queryRunner(
            'INSERT INTO withdrawal_requests (user_id, amount, platform_fee, net_amount, status) VALUES (?, ?, ?, ?, "REVIEW_PENDING")',
            [userId, 1000, 50, 950]
        );
        const wrId = wrResult.insertId;
        
        // We need to hold balance first as if the user requested it
        // Ensure user has balance
        await queryRunner('UPDATE wallets SET balance = balance + 1000 WHERE user_id = ?', [userId]);
        const { transactionId } = await withdrawalService.createWithdrawalRequest(userId, 500); // Create a real one
        const [pendingWR] = await queryRunner('SELECT id FROM withdrawal_requests WHERE user_id = ? AND status = "REVIEW_PENDING" ORDER BY created_at DESC LIMIT 1', [userId]);
        const realWRId = pendingWR[0].id;
        
        console.log(`Approving withdrawal request ${realWRId}...`);
        const approveResult = await withdrawalService.approveWithdrawal(realWRId, "Approved in test");
        console.log("Approve Result:", approveResult.success ? "SUCCESS" : "FAILED");
        
        // Check notification
        const notifications = await userNotificationService.get({ user_id: userId, limit: 1 });
        console.log("Latest Notification:", notifications.data.items[0]?.title);

        // --- Recharge Approval Test ---
        console.log("\nTesting Recharge Approval...");
        const [rrResult] = await queryRunner(
            'INSERT INTO recharge_requests (user_id, amount, payment_method, proof_image, status) VALUES (?, ?, ?, ?, "REVIEW_PENDING")',
            [userId, 500, 'UPI', '/test.png']
        );
        const rrId = rrResult.insertId;
        
        console.log(`Approving recharge request ${rrId}...`);
        const approveRechargeResult = await rechargeService.approveRecharge(rrId, "Approved in test");
        console.log("Approve Recharge Result:", approveRechargeResult.success ? "SUCCESS" : "FAILED");

        const notifications2 = await userNotificationService.get({ user_id: userId, limit: 1 });
        console.log("Latest Notification:", notifications2.data.items[0]?.title);

        console.log("\n--- Wallet Flow Tests Completed ---");
        process.exit(0);
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
}

testFlows();
