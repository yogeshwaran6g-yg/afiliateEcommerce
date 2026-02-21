import { queryRunner } from "./apps/server/src/config/db.js";

async function checkDb() {
    try {
        const total = await queryRunner("SELECT COUNT(*) as count FROM user_notifications");
        const unread = await queryRunner("SELECT COUNT(*) as count FROM user_notifications WHERE is_read = 0");
        const read = await queryRunner("SELECT COUNT(*) as count FROM user_notifications WHERE is_read = 1");

        console.log("Database Stats:");
        console.log("Total:", total[0].count);
        console.log("Unread:", unread[0].count);
        console.log("Read:", read[0].count);

        const latestUnread = await queryRunner("SELECT * FROM user_notifications WHERE is_read = 0 ORDER BY id DESC LIMIT 5");
        console.log("Latest Unread Items:", JSON.stringify(latestUnread, null, 2));

        process.exit(0);
    } catch (error) {
        console.error("DB Error:", error);
        process.exit(1);
    }
}
checkDb();
