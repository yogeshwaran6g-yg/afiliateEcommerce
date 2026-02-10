import { queryRunner } from "#config/db.js";

const comissionConfigService = {

  getAllConfigs: async () => {
    const sql = `SELECT * FROM 
    referral_commission_config ORDER BY level ASC`;
    return await queryRunner(sql);
  },

  upsertConfig: async (level, percent, isActive) => {
    // Basic validation
    if (level < 1 || level > 6) {
      throw new Error("Level must be between 1 and 6");
    }
    if (percent < 0 || percent > 100) {
      throw new Error("Percent must be between 0 and 100");
    }

    const sql = `
            INSERT INTO referral_commission_config (level, percent, is_active)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE percent = VALUES(percent), is_active = VALUES(is_active)
        `;
    return await queryRunner(sql, [level, percent, isActive]);
  },

  deleteConfig: async (level) => {
    // Soft delete usually or hard delete? Plan said "Hard delete or soft delete".
    // Given the constraints, hard delete might be fine, but let's stick to update isActive=0 if we want soft.
    // But honestly, let's just do a DELETE for now as it's a config table.
    const sql = `DELETE FROM referral_commission_config WHERE level = ?`;
    return await queryRunner(sql, [level]);
  },


};

export default comissionConfigService;
