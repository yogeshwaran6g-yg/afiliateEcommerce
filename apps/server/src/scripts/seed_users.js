import bcrypt from "bcrypt";
import { log } from "../utils/helper.js";

export const seedUsers = async (connection) => {
  log("Seeding initial users and profiles...", "info");

  // Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  const [adminUserResult] = await connection.execute(
    `INSERT INTO users (
      name, phone, email, password, role, referral_id, 
      is_active, is_phone_verified, account_activation_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "Admin",
      "9000000000",
      "admin@example.com",
      adminPassword,
      "ADMIN",
      "ADMINREF",
      true,
      true,
      "ACTIVATED",
    ],
  );
  const adminUserId = adminUserResult.insertId;
  log("Seeded admin user (9000000000 / admin123).", "success");

  // Admin Profile
  await connection.execute(
    `INSERT INTO profiles (
      user_id, dob, id_type, id_number, id_document_url, identity_status,
      address_document_url, address_status, 
      bank_account_name, bank_name, bank_account_number, bank_ifsc, 
      bank_document_url, bank_status, profile_image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      adminUserId,
      "1985-01-15",
      "AADHAAR",
      "1234-5678-9012",
      "/uploads/admin/aadhaar.jpg",
      "VERIFIED",
      "/uploads/admin/address_proof.jpg",
      "VERIFIED",
      "Admin",
      "State Bank of India",
      "12345678901234",
      "SBIN0001234",
      "/uploads/admin/passbook.jpg",
      "VERIFIED",
      "/uploads/admin/profile.jpg",
    ],
  );
  log("Seeded admin profile.", "success");

  // Admin Address
  await connection.execute(
    `INSERT INTO addresses (
      user_id, address_line1, address_line2, city, state, country, pincode, is_default
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      adminUserId,
      "123 Admin Street",
      "Silicon Valley Complex",
      "Chennai",
      "Tamil Nadu",
      "India",
      "600001",
      true,
    ],
  );
  log("Seeded admin address.", "success");

  // Admin Wallet
  const [adminWalletResult] = await connection.execute(
    `INSERT INTO wallets (user_id, balance, locked_balance, version) 
     VALUES (?, ?, ?, ?)`,
    [adminUserId, 50000.0, 0.0, 0],
  );
  const adminWalletId = adminWalletResult.insertId;
  log("Seeded admin wallet.", "success");

  return { adminUserId, adminWalletId };
};
