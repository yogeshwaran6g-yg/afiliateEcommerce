import { queryRunner } from './apps/server/src/config/db.js';

async function diagnose() {
    try {
        console.log("--- Users Table ---");
        const users = await queryRunner("SELECT id, name, phone, referral_id, created_at FROM users ORDER BY id DESC LIMIT 5");
        console.log(JSON.stringify(users, null, 2));

        console.log("\n--- OTP Table ---");
        const otps = await queryRunner("SELECT * FROM otp ORDER BY id DESC LIMIT 5");
        console.log(JSON.stringify(otps, null, 2));

        process.exit(0);
    } catch (error) {
        console.error("Diagnosis failed:", error);
        process.exit(1);
    }
}

diagnose();
