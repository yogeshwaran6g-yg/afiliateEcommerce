import { queryRunner } from '#config/db.js';
import { log } from '#utils/helper.js';

async function migrate() {
    try {
        log("Starting Profile Table Migration...", "info");

        // 1. Add new columns one by one
        const columns = [
            { name: 'dob', type: 'DATE NULL AFTER `user_id`' },
            { name: 'id_type', type: 'VARCHAR(50) NULL AFTER `dob`' },
            { name: 'id_number', type: 'VARCHAR(100) NULL AFTER `id_type`' },
            { name: 'id_document_url', type: 'TEXT NULL AFTER `id_number`' },
            { name: 'identity_status', type: "ENUM('NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'NOT_SUBMITTED' AFTER `id_document_url`" },
            { name: 'address_document_url', type: 'TEXT NULL AFTER `identity_status`' },
            { name: 'address_status', type: "ENUM('NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'NOT_SUBMITTED' AFTER `address_document_url`" },
            { name: 'bank_account_name', type: 'VARCHAR(255) NULL AFTER `address_status`' },
            { name: 'bank_name', type: 'VARCHAR(255) NULL AFTER `bank_account_name`' },
            { name: 'bank_account_number', type: 'VARCHAR(100) NULL AFTER `bank_name`' },
            { name: 'bank_ifsc', type: 'VARCHAR(20) NULL AFTER `bank_account_number`' },
            { name: 'bank_document_url', type: 'TEXT NULL AFTER `bank_ifsc`' },
            { name: 'bank_status', type: "ENUM('NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'NOT_SUBMITTED' AFTER `bank_document_url`" }
        ];

        for (const col of columns) {
            try {
                await queryRunner(`ALTER TABLE \`profiles\` ADD COLUMN \`${col.name}\` ${col.type}`);
                log(`Added column ${col.name}`, "success");
            } catch (err) {
                if (err.message.includes('Duplicate column name')) {
                    log(`Column ${col.name} already exists, skipping`, "info");
                } else {
                    throw err;
                }
            }
        }

        // 2. Drop old columns if they exist
        try {
            await queryRunner('ALTER TABLE `profiles` DROP COLUMN `kyc_pan`');
            log("Dropped legacy column kyc_pan", "success");
        } catch (e) { }

        try {
            await queryRunner('ALTER TABLE `profiles` DROP COLUMN `kyc_aadhar`');
            log("Dropped legacy column kyc_aadhar", "success");
        } catch (e) { }

        log("Migration Completed!", "success");
        process.exit(0);
    } catch (error) {
        log(`Migration Failed: ${error.message}`, "error");
        console.error(error);
        process.exit(1);
    }
}

migrate();
