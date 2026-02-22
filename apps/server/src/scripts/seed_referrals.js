import bcrypt from "bcrypt";
import { log } from "../utils/helper.js";
import { callSP } from "../config/db.js";
import walletService from "../services/walletService.js";

export const seedReferrals = async (connection, adminId) => {
  log("Seeding referral tree and commissions...", "info");

  const password = await bcrypt.hash("password123", 10);

  // Helper to create a user and add referral
  const createReferralUser = async (name, phone, referrerId) => {
    const referralId = `REF_${phone}`;
    const [result] = await connection.execute(
      `INSERT INTO users (name, phone, email, password, role, is_active, is_phone_verified, account_activation_status, referral_id, referred_by) 
       VALUES (?, ?, ?, ?, 'USER', true, true, 'ACTIVATED', ?, ?)`,
      [name, phone, `${phone}@mock.com`, password, referralId, referrerId]
    );
    const userId = result.insertId;

    // Create Wallet
    await connection.execute(
      "INSERT INTO wallets (user_id, balance, locked_balance) VALUES (?, ?, ?)",
      [userId, 0, 0]
    );

    // Add to referral tree using Procedure
    await callSP("sp_add_referral", [referrerId, userId], connection);

    return userId;
  };

  // 1. Create 15 Direct Referrals (Level 1)
  log("Creating 15 direct referrals for admin...", "info");
  const directReferralIds = [];
  for (let i = 1; i <= 15; i++) {
    const userId = await createReferralUser(
      `User ${i}`,
      `91000000${i.toString().padStart(2, '0')}`,
      adminId
    );
    directReferralIds.push(userId);
  }

  // 2. Create complex branches
  log("Creating complex referral branches...", "info");
  
  // Branch 1: User 1 -> 5 levels deep
  let lastId1 = directReferralIds[0];
  for (let i = 16; i <= 20; i++) {
    lastId1 = await createReferralUser(`User ${i}`, `92000000${i}`, lastId1);
  }

  // Branch 2: User 2 -> 3 levels deep
  let lastId2 = directReferralIds[1];
  for (let i = 21; i <= 23; i++) {
    lastId2 = await createReferralUser(`User ${i}`, `92000000${i}`, lastId2);
  }

  // Branch 3: User 3 -> 2 direct referrals
  await createReferralUser(`User 24`, `9200000024`, directReferralIds[2]);
  await createReferralUser(`User 25`, `9200000025`, directReferralIds[2]);

  log("Referral seeding completed.", "success");
};
