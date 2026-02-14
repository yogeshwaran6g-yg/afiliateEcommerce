import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN = process.env.TEST_USER_TOKEN; // Set this manually or get from login

async function testTransactions() {
  if (!TOKEN) {
    console.error("Please set TEST_USER_TOKEN in your environment.");
    return;
  }

  const axiosConfig = {
    headers: { Authorization: `Bearer ${TOKEN}` },
  };

  try {
    console.log("--- Testing Transaction List ---");
    const res1 = await axios.get(
      `${API_URL}/wallet/transactions?limit=5`,
      axiosConfig,
    );
    console.log(`Fetched ${res1.data.data.length} transactions.`);

    console.log("\n--- Testing Search (Description) ---");
    const searchTerm = "referral"; // Adjust based on your data
    const res2 = await axios.get(
      `${API_URL}/wallet/transactions?searchTerm=${searchTerm}`,
      axiosConfig,
    );
    console.log(
      `Search for "${searchTerm}" returned ${res2.data.data.length} results.`,
    );
    res2.data.data.slice(0, 2).forEach((t) => {
      console.log(`- [${t.id}] ${t.description} (Ref: ${t.reference_id})`);
    });

    console.log("\n--- Testing Status Filter ---");
    const status = "SUCCESS";
    const res3 = await axios.get(
      `${API_URL}/wallet/transactions?status=${status}`,
      axiosConfig,
    );
    console.log(
      `Filter by status "${status}" returned ${res3.data.data.length} results.`,
    );

    console.log("\n--- Testing Type Filter ---");
    const type = "REFERRAL_COMMISSION";
    const res4 = await axios.get(
      `${API_URL}/wallet/transactions?type=${type}`,
      axiosConfig,
    );
    console.log(
      `Filter by type "${type}" returned ${res4.data.data.length} results.`,
    );

    console.log("\n--- Testing Pagination ---");
    const res5 = await axios.get(
      `${API_URL}/wallet/transactions?limit=2&offset=2`,
      axiosConfig,
    );
    console.log(
      `Pagination (limit=2, offset=2) returned ${res5.data.data.length} results.`,
    );
  } catch (error) {
    console.error("Test failed:", error.response?.data || error.message);
  }
}

testTransactions();
