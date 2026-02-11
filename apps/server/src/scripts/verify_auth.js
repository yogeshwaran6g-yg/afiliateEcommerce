import axios from 'axios';

const BASE_URL = 'http://localhost:4001/api/auth';

async function testAuth() {
    console.log('--- Starting Auth Flow Verification ---');
    
    try {
        const phone = '9876543210';
        const name = 'Test User';
        const password = 'Password@123';

        // 1. Signup
        console.log('\n[1] Testing Signup...');
        const signupRes = await axios.post(`${BASE_URL}/signup`, {
            name, phone, password
        });
        console.log('Signup Result:', signupRes.data.message);
        const userId = signupRes.data.data.userId;

        // 2. Verify OTP (Signup)
        console.log('\n[2] Testing OTP Verification (Signup)...');
        // Note: In real test, we would look up the OTP in DB. 
        // For this script, we assume the developer verifies it manually or injects it.
        console.log('Manual check: Please check the server logs for the generated OTP.');
        
        /*
        const verifyRes = await axios.post(`${BASE_URL}/verify-otp`, {
            userId, otp: 'XXXXXX', purpose: 'signup'
        });
        console.log('Verify Result:', verifyRes.data.message);
        if (verifyRes.data.data.token) console.log('SUCCESS: Auto-login token received!');
        */

        // 3. Login Stage 1 (Trigger OTP)
        console.log('\n[3] Testing Login Stage 1 (Trigger OTP)...');
        const login1Res = await axios.post(`${BASE_URL}/login`, { phone });
        console.log('Login Stage 1 Result:', login1Res.data.message);

        // 4. Forgot Password
        console.log('\n[4] Testing Forgot Password...');
        const forgotRes = await axios.post(`${BASE_URL}/forgot-password`, { phone });
        console.log('Forgot Password Result:', forgotRes.data.message);

    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
    }
}

testAuth();
