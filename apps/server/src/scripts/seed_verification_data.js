import { queryRunner } from "../config/db.js";
import { createReferral, distributeCommission } from "../service/referralService.js";
import { log } from "../utils/helper.js";

async function seed() {
  try {
    log("Clearing existing data...", "info");

    // 0. Clear tables
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

    // 2. Build Ultra Tree Branching
    // Level 1: 5 members
    // Level 2: Each L1 refers 2 (10)
    // Level 3: Each L2 refers 2 (20)
    // Level 4-6: Each parent refers 1 (20 each)
    
    let userIdCounter = 1000;
    const levelUsers = { 0: [{ id: 1, name: 'yg' }] };

    const branchingMap = {
      1: 5, // Root refers 5
      2: 2, // Each L1 refers 2
      3: 2, // Each L2 refers 2
      4: 1, // Each L3 refers 1
      5: 1, // Each L4 refers 1
      6: 1  // Each L5 refers 1
    };

    for (let level = 1; level <= 6; level++) {
      levelUsers[level] = [];
      const parents = levelUsers[level - 1];
      const branchFactor = level === 1 ? branchingMap[1] : branchingMap[level];

      for (const parent of parents) {
        for (let i = 1; i <= branchFactor; i++) {
          userIdCounter++;
          const user = {
            id: userIdCounter,
            name: `L${level}-U${userIdCounter}`,
            email: `user${userIdCounter}@test.com`
          };

          await queryRunner(
            "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, 'hashedpassword')",
            [user.id, user.name, user.email]
          );

          await createReferral(parent.id, user.id);
          levelUsers[level].push(user);
        }
      }
      log(`Created ${levelUsers[level].length} users for Level ${level}`, "info");
    }

    log("Ultra Referral tree created with complex branching", "info");

    // 3. Commission config (1–6)
    const configPercents = [10, 8, 5, 3, 2, 1];
    for (let i = 1; i <= 6; i++) {
      await queryRunner(
        "INSERT INTO referral_commission_config (level, percent, is_active) VALUES (?, ?, 1)",
        [i, configPercents[i-1]]
      );
    }
    log("Commission config ensured", "info");

    // 4. Create multiple orders for earnings
    const orderScenarios = [
      { userId: levelUsers[6][0].id, amount: 1000, desc: "Level 6 User Branch A" },
      { userId: levelUsers[6][levelUsers[6].length - 1].id, amount: 2000, desc: "Level 6 User Branch Z" },
      { userId: levelUsers[3][5].id, amount: 500, desc: "Level 3 User Mid-Tree" },
      { userId: levelUsers[6][10].id, amount: 3000, desc: "Level 6 User Branch Middle" }
    ];

    for (const scenario of orderScenarios) {
      const orderResult = await queryRunner(
        "INSERT INTO orders (user_id, amount, status) VALUES (?, ?, 'COMPLETED')",
        [scenario.userId, scenario.amount]
      );
      const orderId = orderResult.insertId;
      log(`Order ${orderId} ($${scenario.amount}) created for ${scenario.desc}`, "info");

      await distributeCommission(orderId, scenario.userId, scenario.amount);
      await queryRunner(
        "UPDATE referral_commission_distribution SET status = 'APPROVED' WHERE order_id = ?",
        [orderId]
      );
    }

    log("Multiple commissions distributed and approved across branches", "info");
    log("Ultra seeding COMPLETE.", "success");
  } catch (error) {
    log(`Seeding failed: ${error.message}`, "error");
  } finally {
    process.exit();
  }
}

seed();
