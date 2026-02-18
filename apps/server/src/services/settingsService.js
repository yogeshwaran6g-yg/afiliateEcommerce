import { queryRunner } from "#config/db.js";

export const getSetting = async (key, defaultValue = null) => {
  const rows = await queryRunner("SELECT value FROM settings WHERE `key` = ?", [key]);
  if (rows && rows.length > 0) {
    return rows[0].value;
  }
  return defaultValue;
};

export const getSettings = async (keys) => {
  const placeholders = keys.map(() => "?").join(",");
  const rows = await queryRunner(`SELECT \`key\`, \`value\` FROM settings WHERE \`key\` IN (${placeholders})`, keys);
  const settingsMap = {};
  rows.forEach((row) => {
    settingsMap[row.key] = row.value;
  });
  return settingsMap;
};

export default {
  getSetting,
  getSettings,
};
