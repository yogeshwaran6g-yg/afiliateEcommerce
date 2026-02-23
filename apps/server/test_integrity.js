import { queryRunner } from './src/config/db.js';
import { verifyWalletIntegrity } from './src/services/walletService.js';
import { log } from './src/utils/helper.js';

async function verifyIntegrityTest() {
    const userId = 1; // Testing with user 1
    try {
        console.log("--- Testing Wallet Integrity Checker ---");
        
        // 1. Check current integrity
        console.log("Checking initial integrity...");
        await verifyWalletIntegrity(userId);
        console.log("Initial integrity check passed.");

        // 2. Simulate corruption
        console.log("\nSimulating balance corruption...");
        await queryRunner('UPDATE wallets SET balance = balance + 10 WHERE user_id = ?', [userId]);
        
        try {
            await verifyWalletIntegrity(userId);
            console.error("FAILURE: Integrity check should have failed but passed!");
        } catch (error) {
            console.log("SUCCESS: Integrity check failed as expected:", error.message);
        }

        // 3. Restore balance
        console.log("\nRestoring balance...");
        await queryRunner('UPDATE wallets SET balance = balance - 10 WHERE user_id = ?', [userId]);
        await verifyWalletIntegrity(userId);
        console.log("Integrity restored and verified.");

        process.exit(0);
    } catch (error) {
        console.error("Test execution failed:", error);
        process.exit(1);
    }
}

verifyIntegrityTest();
