import { queryRunner } from '#config/db.js';
import { log } from '#utils/helper.js';

async function migrate() {
    try {
        log("Starting Profile Table Migration...", "info");

        // 1. Add new columns
        await queryRunner(`
            ALTER TABLE \`profiles\` 
            ADD COLUMN IF NOT EXISTS \`dob\` DATE NULL AFTER \`user_id\`,
            ADD COLUMN IF NOT EXISTS \`id_type\` VARCHAR(50) NULL AFTER \`dob\`,
            ADD COLUMN IF NOT EXISTS \`id_number\` VARCHAR(100) NULL AFTER \`id_type\`,
            ADD COLUMN IF NOT EXISTS \`id_document_url\` TEXT NULL AFTER \`id_number\`,
            ADD COLUMN IF NOT EXISTS \`identity_status\` ENUM('NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'NOT_SUBMITTED' AFTER \`id_document_url\`,
            ADD COLUMN IF NOT EXISTS \`address_document_url\` TEXT NULL AFTER \`identity_status\`,
            ADD COLUMN IF NOT EXISTS \`address_status\` ENUM('NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'NOT_SUBMITTED' AFTER \`address_document_url\`,
            ADD COLUMN IF NOT EXISTS \`bank_account_name\` VARCHAR(255) NULL AFTER \`address_status\`,
            ADD COLUMN IF NOT EXISTS \`bank_name\` VARCHAR(255) NULL AFTER \`bank_account_name\`,
            ADD COLUMN IF NOT EXISTS \`bank_account_number\` VARCHAR(100) NULL AFTER \`bank_name\`,
            ADD COLUMN IF NOT EXISTS \`bank_ifsc\` VARCHAR(20) NULL AFTER \`bank_account_number\`,
            ADD COLUMN IF NOT EXISTS \`bank_document_url\` TEXT NULL AFTER \`bank_ifsc\`,
            ADD COLUMN IF NOT EXISTS \`bank_status\` ENUM('NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'NOT_SUBMITTED' AFTER \`bank_document_url\`
        `);
        log("New columns added successfully", "success");

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
