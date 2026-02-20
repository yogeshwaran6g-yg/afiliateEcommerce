import { sendOtp } from './src/services/authService.js';
import { queryRunner } from './src/config/db.js';

async function test() {
    try {
        console.log('Testing sendOtp for user 10...');
        const res = await sendOtp(10, '9999999999', 'signup');
        console.log('sendOtp Result:', JSON.stringify(res, null, 2));

        const otp = await queryRunner('SELECT * FROM otp WHERE user_id = 10');
        console.log('OTP in DB:', JSON.stringify(otp, null, 2));
    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        process.exit();
    }
}

test();
