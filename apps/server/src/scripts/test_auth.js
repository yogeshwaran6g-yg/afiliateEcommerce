// import { fetch } from 'undici'; // Using global fetch

import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 4001;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'afiliateecommerce'
};

const signup = async (user) => {
    console.log(`\n--- Signup ${user.phone} ---`);
    const res = await fetch(`${BASE_URL}/auth/signup`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });   
    return res.json();
};



const runTest = async () => {
    let connection;
    try {
        console.log("Connecting to DB...");
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected.");
        
        const testUser = {
            name: "Test User_" + Date.now(),
            phone: "99999" + Math.floor(Math.random() * 100000), // Random phone
            password: "password123",
            email: "test_" + Date.now() + "@example.com"
        };
        
        // 1. Signup
        console.log(`\n1. Signup User: ${testUser.name} (${testUser.phone})`);
        const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        
        console.log("Status:", signupRes.status);
        const signupText = await signupRes.text();
        
        let signupData;
        try {
            signupData = JSON.parse(signupText);
        } catch (e) {
            console.log("Failed to parse JSON. Response text:", signupText);
            throw new Error("Signup failed - not JSON");
        }
        
        console.log("Response:", signupData);
        
        if (!signupData.success) {
            throw new Error("Signup failed");
        }
        
        const userId = signupData.data.userId; // authController returns { userId: ... }

        
        // 2. Inject Known OTP
        console.log(`\n2. Injecting Known OTP '123456' for User ID ${userId}`);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash("123456", salt);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        
        await connection.execute(
            'UPDATE otp SET otp_hash = ?, expires_at = ? WHERE user_id = ?', 
            [hash, expiresAt, userId]
        );
        console.log("OTP Injected.");
        
        // 3. Verify OTP
        console.log(`\n3. Verifying OTP '123456'`);
        const verifyRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
             method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, otp: "123456" })
        });
        const verifyData = await verifyRes.json();
        console.log("Status:", verifyRes.status);
        console.log("Response:", verifyData);

        if (!verifyData.success) {
             throw new Error("OTP Verification failed");
        }

        // 4. Login
        console.log(`\n4. Login`);
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
             method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: testUser.phone, password: testUser.password })
        });
        const loginData = await loginRes.json();
        console.log("Status:", loginRes.status);
        console.log("Response:", JSON.stringify(loginData, null, 2));
        
        if (!loginData.success) {
             throw new Error("Login failed");
        }
        
        const token = loginData.data.token;
        console.log("Token received.");
        
        // 5. Get Profile
        console.log(`\n5. Get Profile`);
        const profileRes = await fetch(`${BASE_URL}/auth/profile`, {
             method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const profileData = await profileRes.json();
        console.log("Status:", profileRes.status);
        console.log("Response:", JSON.stringify(profileData, null, 2));

        if (!profileData.success) {
             throw new Error("Get Profile failed");
        }
        
        // 6. Update Profile
        console.log(`\n6. Update Profile`);
        const updateRes = await fetch(`${BASE_URL}/auth/profile`, {
             method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                profile: { kyc_pan: "ABCDE1234F" },
                address: { address_line1: "123 Test St", city: "Test City", state: "TS", country: "India", pincode: "123456" }
            })
        });
        const updateData = await updateRes.json();
         console.log("Status:", updateRes.status);
        console.log("Response:", updateData);
        
        if (!updateData.success) {
             throw new Error("Update Profile failed");
        }

        console.log("\n--- TEST COMPLETED SUCCESSFULLY ---");
        
    } catch (e) {
        console.error("\nTEST FAILED:", e.message);
    } finally {
        if(connection) await connection.end();
    }
};

runTest();