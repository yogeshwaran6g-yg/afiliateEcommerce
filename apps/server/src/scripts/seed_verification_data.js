import { queryRunner } from "../config/db.js";
import { createReferral, distributeCommission } from "../service/referralService.js";
import { log } from "../utils/helper.js";

async function seed() {
  try {
    log("Clearing existing data...", "info");

    // 0. Clear tables (order matters)
    await queryRunner("SET FOREIGN_KEY_CHECKS = 0");
    await queryRunner("TRUNCATE TABLE referral_commission_distribution");
    await queryRunner("TRUNCATE TABLE referral_tree");
    await queryRunner("TRUNCATE TABLE orders");
    await queryRunner("TRUNCATE TABLE referral_commission_config");
    await queryRunner("DELETE FROM users WHERE id <> 1");
    await queryRunner("SET FOREIGN_KEY_CHECKS = 1");

    log("All tables cleared", "info");

    // 1. Ensure ROOT user (yg)
    await queryRunner(
      "INSERT IGNORE INTO users (id, name, email, password) VALUES (1, 'yg', 'yg@root.com', 'hashedpassword')"
    );
    log("Root user 'yg' ensured (ID: 1)", "info");

    // 2. Create users for each level (3 per level)
    const levels = 6;
    const membersPerLevel = 3;
    let userIdCounter = 1000;

    const levelUsers = {};

    for (let level = 1; level <= levels; level++) {
      levelUsers[level] = [];

      for (let i = 1; i <= membersPerLevel; i++) {
        userIdCounter++;
        const user = {
          id: userIdCounter,
          name: `L${level}-User-${i}`,
          email: `l${level}_user_${i}@test.com`,
        };

        await queryRunner(
          "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, 'hashedpassword')",
          [user.id, user.name, user.email]
        );

        levelUsers[level].push(user);
      }
    }

    log("Created users for levels 1–6 (3 each)", "info");

    // 3. Build referral tree (REAL TREE, NOT FLAT)
    // Level 1 → referred by root
    for (const user of levelUsers[1]) {
      await createReferral(1, user.id);
    }

    // Level 2–6 → each user refers ONE child
    for (let level = 1; level < levels; level++) {
      for (let i = 0; i < membersPerLevel; i++) {
        const parent = levelUsers[level][i];
        const child = levelUsers[level + 1][i];
        await createReferral(parent.id, child.id);
      }
    }

    log("Referral tree created (branch-preserving)", "info");

    // 4. Commission config (1–6)
    for (let i = 1; i <= 6; i++) {
      await queryRunner(
        "INSERT INTO referral_commission_config (level, percent, is_active) VALUES (?, ?, 1)",
        [i, 10 - i] // 9% → 4%
      );
    }

    log("Commission config ensured", "info");

    // 5. Create order at deepest level (Level 6, first member)
    const deepestUser = levelUsers[6][0];

    const orderResult = await queryRunner(
      "INSERT INTO orders (user_id, amount, status) VALUES (?, ?, 'COMPLETED')",
      [deepestUser.id, 1000]
    );

    const orderId = orderResult.insertId;
    log(`Order ${orderId} created for ${deepestUser.name}`, "info");

    // 6. Distribute commission
    await distributeCommission(orderId, deepestUser.id, 1000);
    log("Commission distributed", "info");

    // 7. Approve commissions
    await queryRunner(
      "UPDATE referral_commission_distribution SET status = 'APPROVED' WHERE order_id = ?",
      [orderId]
    );

    log("Commissions approved", "info");

    log("Mock seeding COMPLETE. Now run verify_referral_stats.js", "success");
  } catch (error) {
    log(`Seeding failed: ${error.message}`, "error");
  } finally {
    process.exit();
  }
}

seed();
