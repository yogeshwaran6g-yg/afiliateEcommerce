import { queryRunner } from "./apps/server/src/config/db.js";

async function setup() {
    try {
        // Create table
        await queryRunner(`
            CREATE TABLE IF NOT EXISTS popup_banners (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                logo VARCHAR(255) NULL,
                title VARCHAR(255) NOT NULL,
                short_description VARCHAR(255) NULL,
                long_description TEXT NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE = InnoDB
        `);
        console.log("✅ Table created");

        // Insert test data
        await queryRunner(`
            INSERT INTO popup_banners (title, short_description, long_description, is_active) 
            VALUES (?, ?, ?, ?)
        `, [
            "Welcome to Our Platform! 🚀",
            "Your journey to success starts here",
            "We are thrilled to have you on board. Explore your dashboard to track your earnings, manage your network, and discover new opportunities. Start by checking your referral link and sharing it with friends to grow your team!",
            1
        ]);
        console.log("✅ Test popup inserted");

        process.exit(0);
    } catch (e) {
        console.error("Error:", e.message);
        process.exit(1);
    }
}
setup();
