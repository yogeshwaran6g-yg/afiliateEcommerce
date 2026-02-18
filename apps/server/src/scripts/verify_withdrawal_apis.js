import axios from 'axios';
import { log } from '../utils/helper.js';

// This is a standalone script to be run with node
// It assumes the server is running or can be tested via internal logic if mockable
// But easier to just test the logic if we had unit tests.
// Since we are in an agent environment, I will create a script that can be run if the user provides a token.

async function verifyApis(token, baseUrl = 'http://localhost:5000') {
    const api = axios.create({
        baseURL: baseUrl,
        headers: { Authorization: `Bearer ${token}` }
    });

    try {
        log("Testing /api/v1/wallet...", "info");
        const walletRes = await api.get('/api/v1/wallet');
        console.log("Wallet Response:", JSON.stringify(walletRes.data, null, 2));

        log("Testing /api/v1/settings/withdrawal...", "info");
        const settingsRes = await api.get('/api/v1/settings/withdrawal');
        console.log("Settings Response:", JSON.stringify(settingsRes.data, null, 2));

        log("Verification complete.", "success");
    } catch (error) {
        log(`Verification failed: ${error.message}`, "error");
        if (error.response) {
            console.log("Error Data:", error.response.data);
        }
    }
}

// Example usage: node verify_withdrawal_apis.js <token>
const token = process.argv[2];
if (!token) {
    console.log("Please provide a JWT token: node verify_withdrawal_apis.js <token>");
    // process.exit(1);
} else {
    verifyApis(token);
}

// Exporting logic for internal use if needed
export default verifyApis;
