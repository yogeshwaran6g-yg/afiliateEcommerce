import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { env } from './src/config/env.js';

const API_URL = 'http://127.0.0.1:4000/api/v1';

// DB Config (using env from server config)
const dbConfig = {
    host: env.DB_HOST || '127.0.0.1',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'afiliateecommerce'
};

async function test() {
    console.log("Starting E2E Flow Test (running from apps/server)...");
    const conn = await mysql.createConnection(dbConfig);

    const phone = "9999999999";
    const adminPhone = "9000000001";
    const adminPassword = "password123";

    try {
        // 0. Cleanup
        await conn.execute('DELETE FROM users WHERE phone = ?', [phone]);
        console.log("Cleanup done.");

        // 1. Signup
        console.log("1. Signup...");
        const signupRes = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, referrerId: 'ADMIN001' })
        });
        const signupData = await signupRes.json();
        console.log("Signup Response:", signupData.message);
        const userId = signupData.data.userId;

        // 2. Setup OTP
        const testOtp = "123456";
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(testOtp, salt);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        
        await conn.execute(
            'INSERT INTO otp (user_id, otp_hash, purpose, expires_at) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE otp_hash = VALUES(otp_hash)',
            [userId, hash, 'signup', expiresAt]
        );
        console.log("OTP '123456' injected for testing.");

        // 3. Verify OTP
        console.log("2. Verify OTP...");
        const verifyRes = await fetch(`${API_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, otp: testOtp, purpose: 'signup' })
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.data) {
            console.error("Verification failed! Data:", verifyData);
            throw new Error("No data in verification response");
        }
        const token = verifyData.data.token;
        console.log("Verify OTP Response:", verifyData.message);

        // 4. Complete Registration
        console.log("3. Complete Registration...");
        const formData = new FormData();
        formData.append('name', 'Test User');
        formData.append('email', 'test@example.com');
        formData.append('password', 'password123');
        formData.append('selectedProductId', '23');
        formData.append('paymentType', 'UPI');
        
        const blob = new Blob(['dummy content'], { type: 'image/png' });
        formData.append('proof', blob, 'proof.png');

        const completeRes = await fetch(`${API_URL}/auth/complete-registration`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const completeData = await completeRes.json();
        console.log("Complete Registration Response:", completeData.message);

        // 5. Admin Approval
        console.log("4. Admin Login...");
        const adminLoginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: adminPhone, password: adminPassword })
        });
        const adminLoginData = await adminLoginRes.json();
        const adminToken = adminLoginData.data.token;

        const [paymentRows] = await conn.execute('SELECT id FROM activation_payments_details WHERE user_id = ?', [userId]);
        const paymentId = paymentRows[0].id;

        console.log("5. Approve Payment...");
        const approveRes = await fetch(`${API_URL}/admin/approve-payment`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ paymentId })
        });
        const approveData = await approveRes.json();
        console.log("Approve Response:", approveData.message);

        // 6. Verify Activation & Commission
        const [userRows] = await conn.execute('SELECT account_activation_status FROM users WHERE id = ?', [userId]);
        console.log("Final User Status:", userRows[0].account_activation_status);

        const [commRows] = await conn.execute('SELECT * FROM referral_commission_distribution WHERE downline_id = ?', [userId]);
        console.log("Commissions Distributed:", commRows.length > 0 ? "YES (Count: " + commRows.length + ")" : "NO");

    } catch (err) {
        console.error("Test Error:", err);
    } finally {
        await conn.end();
    }
}

test();
