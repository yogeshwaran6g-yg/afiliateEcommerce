import { queryRunner } from "./apps/server/src/config/db.js";

async function checkDb() {
    try {
        const result = await queryRunner("SELECT COUNT(*) as count FROM user_notifications");
        console.log("User Notifications Count:", result[0].count);

        const latest = await queryRunner("SELECT * FROM user_notifications ORDER BY id DESC LIMIT 5");
        console.log("Latest 5 Notifications:", JSON.stringify(latest, null, 2));

        process.exit(0);
    } catch (error) {
        console.error("DB Check Error:", error);
        process.exit(1);
    }
}

checkDb();
