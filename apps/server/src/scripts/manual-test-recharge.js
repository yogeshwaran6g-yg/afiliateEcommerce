import { queryRunner } from '../config/db.js';

const API_URL = 'http://localhost:4000/api/v1'; 

async function testRecharge() {
    try {
        console.log('Starting Recharge Test...');

        // 1. Login to get token
        console.log('Logging in...');
        const loginPayload = {
            phone: '9000000000', // Found in DB
            password: 'password123'
        };

        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginPayload)
        });

        if (!loginRes.ok) {
            const errText = await loginRes.text();
            throw new Error(`Login failed: ${loginRes.status} ${errText}`);
        }

        const loginData = await loginRes.json();
        console.log('Login Response:', loginData);
        const token = loginData.data?.token || loginData.token;
        if (!token) throw new Error('Login failed: No token received');
        console.log('Login successful. Token received.');

        // 2. Create Recharge Request
        console.log('Creating Recharge Request...');
        const formData = new FormData();
        formData.append('amount', '500');
        formData.append('paymentMethod', 'UPI');
        formData.append('paymentReference', 'TEST_TXN_PATH_001');
        
        // Create a fake file
        const blob = new Blob(['fake image content'], { type: 'image/jpeg' });
        formData.append('proof', blob, 'test-proof.jpg');

        const rechargeRes = await fetch(`${API_URL}/wallet/recharge`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Note: Content-Type is set automatically with boundary for FormData
            },
            body: formData
        });

        const rechargeResData = await rechargeRes.json();
        console.log('Recharge Request Response:', rechargeResData);

        if (rechargeRes.ok) {
            console.log('Recharge API call successful.');
            
            // 3. Verify in Database
            console.log('Verifying in Database...');
            const rows = await queryRunner('SELECT * FROM recharge_requests WHERE payment_reference = ?', ['TEST_TXN_PATH_001']);
            
            if (rows.length > 0) {
                console.log('SUCCESS: Recharge request found in database.');
                const record = rows[0];
                console.log(record);
                
                if (record.proof_image && record.proof_image.startsWith('/uploads/payments/')) {
                    console.log('SUCCESS: Proof image path is relative:', record.proof_image);
                } else {
                    console.error('FAILURE: Proof image path is NOT relative:', record.proof_image);
                }
            } else {
                console.error('FAILURE: Recharge request NOT found in database.');
            }
        } else {
            console.error('FAILURE: Recharge API call failed with status', rechargeRes.status);
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

testRecharge();
