import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_URL = 'http://localhost:4000/api/v1';

// DB Config (Derived from apps/server/src/config/db.js environment)
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'afiliate_ecommerce'
};

async function test() {
    const conn = await mysql.createConnection(dbConfig);
    console.log("Connected to DB for verification");

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
            body: JSON.stringify({ phone })
        });
        const signupData = await signupRes.json();
        console.log("Signup Response:", signupData.message);
        const userId = signupData.data.userId;

        // 2. Get OTP from DB
        const [otpRows] = await conn.execute('SELECT * FROM otp WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [userId]);
        // Note: The OTP is hashed in the DB, but our sendOtp log outputted the plaintext.
        // For testing, I'll modify the DB to set a known OTP or just wait for the log.
        // Actually, let's just use 123456 by updating the hash for test.
        const testOtp = "123456";
        const bcrypt = await import('bcrypt');
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(testOtp, salt);
        await conn.execute('UPDATE otp SET otp_hash = ? WHERE user_id = ?', [hash, userId]);
        console.log("OTP hash updated to '123456' for testing.");

        // 3. Verify OTP
        console.log("2. Verify OTP...");
        const verifyRes = await fetch(`${API_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, otp: testOtp, purpose: 'signup' })
        });
        const verifyData = await verifyRes.json();
        const token = verifyData.data.token;
        console.log("Verify OTP Response:", verifyData.message);

        // 4. Complete Registration
        console.log("3. Complete Registration...");
        // Mock multipart form-data
        const formData = new FormData();
        formData.append('name', 'Test User');
        formData.append('email', 'test@example.com');
        formData.append('password', 'password123');
        formData.append('selectedProductId', '1');
        formData.append('paymentType', 'UPI');
        
        // Create a dummy blob for file
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
        // First login as admin
        console.log("4. Admin Login...");
        const adminLoginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: adminPhone, password: adminPassword })
        });
        const adminLoginData = await adminLoginRes.json();
        const adminToken = adminLoginData.data.token;

        // Get payment ID
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
        console.log("User Status:", userRows[0].account_activation_status);

        const [commRows] = await conn.execute('SELECT * FROM referral_commission_distribution WHERE downline_id = ?', [userId]);
        console.log("Commissions Distributed:", commRows.length > 0 ? "YES" : "NO");

    } catch (err) {
        console.error("Test Error:", err);
    } finally {
        await conn.end();
    }
}

test();
