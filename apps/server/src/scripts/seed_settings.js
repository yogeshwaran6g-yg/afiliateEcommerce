import { log } from "../utils/helper.js";

export const seedSettings = async (connection) => {
  log("Seeding system settings...", "info");

  const settings = [
    {
      key: "withdraw_commission",
      value: "5.0",
      description: "Percentage commission taken on each withdrawal"
    },
    {
      key: "maximum_amount_per_withdraw",
      value: "50000.0",
      description: "Maximum amount allowed for a single withdrawal request"
    },
    {
      key: "shipping_cost",
      value: "50.0",
      description: "Default shipping cost for product orders"
    }
  ];

  for (const setting of settings) {
    await connection.execute(
      "INSERT INTO settings (`key`, `value`, `description`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `description` = VALUES(`description`)",
      [setting.key, setting.value, setting.description]
    );
  }

  log("System settings seeded successfully.", "success");
};
