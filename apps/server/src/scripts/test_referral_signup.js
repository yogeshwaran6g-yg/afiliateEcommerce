import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 4000;
const BASE_URL = `http://localhost:${PORT}/api`;

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'afiliateecommerce'
};

const runTest = async () => {
    let connection;
    try {
        console.log("Connecting to DB...");
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected.");

        // --- PHASE 1: Create a Referrer ---
        const referrerData = {
            name: "Referrer_" + Date.now(),
            phone: "9" + Math.floor(100000000 + Math.random() * 900000000), // Random 10-digit phone starting with 9
            password: "password123",
            email: "referrer_" + Date.now() + "@example.com"
        };

        console.log("\n1. Creating Referrer user...");
        const res1 = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(referrerData)
        });
        const signup1 = await res1.json();
        if (!signup1.success) throw new Error("Referrer signup failed: " + JSON.stringify(signup1));
        
        const referrerId = signup1.data.userId;
        
        // Get the referral code for this user
        const [users] = await connection.execute('SELECT referral_id FROM users WHERE id = ?', [referrerId]);
        const referralCode = users[0].referral_id;
        console.log(`Referrer created: ID ${referrerId}, Code: ${referralCode}`);

        // --- PHASE 2: Signup with VALID Referral Code ---
        const referralUserData = {
            name: "Referral User_" + Date.now(),
            phone: "8" + Math.floor(100000000 + Math.random() * 900000000),
            password: "password123",
            email: "referral_user_" + Date.now() + "@example.com",
            referralId: referralCode // Using the code
        };

        console.log("\n2. Signing up with VALID referral code...");
        const res2 = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(referralUserData)
        });
        const signup2 = await res2.json();
        console.log("Response:", signup2);
        if (!signup2.success) throw new Error("Referral signup failed");
        
        const newUserId = signup2.data.userId;

        // Verify in DB
        const [tree] = await connection.execute(
            'SELECT * FROM referral_tree WHERE downline_id = ? AND upline_id = ? AND level = 1',
            [newUserId, referrerId]
        );
        
        if (tree.length > 0) {
            console.log("SUCCESS: Referral link found in referral_tree table.");
        } else {
            console.log("FAILURE: Referral link NOT found in referral_tree table.");
        }

        // --- PHASE 3: Signup with INVALID Referral Code ---
        console.log("\n3. Signing up with INVALID referral code...");
        const res3 = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Invalid User_" + Date.now(),
                phone: "7" + Math.floor(100000000 + Math.random() * 900000000),
                password: "password123",
                email: "invalid_" + Date.now() + "@example.com",
                referralId: "INVALID_CODE_XYZ"
            })
        });
        const signup3 = await res3.json();
        console.log("Response status:", res3.status);
        console.log("Response:", signup3);
        
        if (res3.status === 400 && signup3.message === "Invalid referral id") {
            console.log("SUCCESS: Correctly rejected invalid referral code.");
        } else {
            console.log("FAILURE: Invalid referral code was not handled correctly.");
        }

        console.log("\n--- REFERRAL TEST COMPLETED ---");

    } catch (e) {
        console.error("\nTEST FAILED:", e.message);
    } finally {
        if (connection) await connection.end();
    }
};

runTest();
