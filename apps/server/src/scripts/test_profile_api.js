import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { log } from '../utils/helper.js';

const BASE_URL = `http://localhost:${env.PORT}/api/v1`;

async function testProfileApi() {
    try {
        log("Starting Profile API Integration Test...", "info");

        // 1. Generate a test token for User ID 3 (known from previous tests)
        const token = jwt.sign({ id: 3 }, env.JWT_SECRET, { expiresIn: '1h' });
        log("Generated test JWT for User ID 3", "info");

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // 2. Test GET /profile/me
        log(`Testing GET ${BASE_URL}/profile/me...`, "info");
        const getRes = await fetch(`${BASE_URL}/profile/me`, { headers });
        const getData = await getRes.json();
        
        if (getRes.status === 200) {
            log("GET /profile/me Success", "success");
            // console.log(JSON.stringify(getData, null, 2));
        } else {
            log(`GET /profile/me Failed: ${getRes.status} - ${getData.message}`, "error");
            return;
        }

        // 3. Test PUT /profile/personal
        log(`Testing PUT ${BASE_URL}/profile/personal...`, "info");
        const putRes = await fetch(`${BASE_URL}/profile/personal`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                name: "Integration Test User",
                phone: "1234567890",
                profile: {
                    dob: "1995-05-05",
                    profile_image: "http://example.com/api_test.png"
                }
            })
        });
        const putData = await putRes.json();

        if (putRes.status === 200) {
            log("PUT /profile/personal Success", "success");
        } else {
            log(`PUT /profile/personal Failed: ${putRes.status} - ${putData.message}`, "error");
            return;
        }

        // 4. Verify update via GET
        const verifyRes = await fetch(`${BASE_URL}/profile/me`, { headers });
        const verifyData = await verifyRes.json();
        if (verifyData.data.user.name === "Integration Test User") {
            log("API data consistency verified!", "success");
        } else {
            log("API data consistency failed, name mismatch", "error");
        }

        log("Profile API Integration Test Completed Successfully!", "success");
    } catch (error) {
        log(`API Test Failed: ${error.message}`, "error");
        if (error.message.includes('ECONNREFUSED')) {
            log("Ensure the server is running on port " + env.PORT, "warning");
        }
    }
}

testProfileApi();
