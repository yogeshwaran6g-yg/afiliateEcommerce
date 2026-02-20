import { queryRunner } from './src/config/db.js';

async function debug() {
    try {
        const userCount = await queryRunner('SELECT COUNT(*) as count FROM users');
        const users = await queryRunner('SELECT id, phone, name FROM users ORDER BY id DESC LIMIT 10');
        console.log(`--- Total Users: ${userCount[0].count} ---`);
        console.log(JSON.stringify(users, null, 2));

        const otpCount = await queryRunner('SELECT COUNT(*) as count FROM otp');
        const otps = await queryRunner('SELECT * FROM otp ORDER BY updated_at DESC LIMIT 10');
        console.log(`\n--- Total OTPs: ${otpCount[0].count} ---`);
        console.log(JSON.stringify(otps, null, 2));
    } catch (err) {
        console.error('Debug failed:', err);
    } finally {
        process.exit();
    }
}

debug();
