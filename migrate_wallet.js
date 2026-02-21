import { queryRunner } from './apps/server/src/config/db.js';

async function migrate() {
    try {
        console.log("Applying migration...");
        await queryRunner('ALTER TABLE wallet_transactions ADD COLUMN locked_after DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER balance_before');
        await queryRunner('ALTER TABLE wallet_transactions ADD COLUMN locked_before DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER locked_after');
        console.log("Migration successful!");
        process.exit(0);
    } catch (e) {
        console.error("Migration failed:", e.message);
        process.exit(1);
    }
}

migrate();
