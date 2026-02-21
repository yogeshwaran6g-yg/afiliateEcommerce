import { queryRunner } from './apps/server/src/config/db.js';

async function checkSchema() {
    try {
        const result = await queryRunner('DESCRIBE wallet_transactions');
        if (result) {
            result.forEach(row => console.log(`${row.Field}: ${row.Type}`));
        } else {
            console.log("No columns found.");
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkSchema();
