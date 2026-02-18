import pool, { queryRunner } from '../config/db.js';
import { log } from '../utils/helper.js';

const checkData = async () => {
    try {
        log("Checking for duplicates in referral_tree...", "info");
        
        const sql = `
            SELECT upline_id, downline_id, level, COUNT(*) as count
            FROM referral_tree
            GROUP BY upline_id, downline_id, level
            HAVING count > 1
        `;
        
        const duplicates = await queryRunner(sql);
        
        if (duplicates && duplicates.length > 0) {
            log(`Found ${duplicates.length} duplicate groups in referral_tree!`, "error");
            console.table(duplicates);
        } else {
            log("No exact (upline, downline, level) duplicates found.", "success");
        }

        log("Checking for multiple entries for same (upline, downline) with different levels...", "info");
        const multiLevelSql = `
            SELECT upline_id, downline_id, COUNT(*) as level_count, GROUP_CONCAT(level) as levels
            FROM referral_tree
            GROUP BY upline_id, downline_id
            HAVING level_count > 1
        `;
        const multiLevel = await queryRunner(multiLevelSql);
        if (multiLevel) {
            log(`Found ${multiLevel.length} users with multiple levels for same upline. (Expected for different uplines, but checking for same upline)`, "info");
            // Note: If (A, B) has Level 1 and Level 2, that's weird in a standard MLM.
        }

        log("Checking for orphaned rows in referral_tree (pointing to non-existent users)...", "info");
        const orphansSql = `
            SELECT COUNT(*) as orphan_count
            FROM referral_tree rt
            LEFT JOIN users u ON u.id = rt.downline_id
            WHERE u.id IS NULL
        `;
        const [orphans] = await queryRunner(orphansSql);
        if (orphans.orphan_count > 0) {
            log(`Found ${orphans.orphan_count} orphaned rows in referral_tree!`, "error");
        } else {
            log("No orphaned rows found.", "success");
        }

        log("Checking total referral counts for Admin (phone: 1234567890)...", "info");
        const [[admin]] = await pool.execute("SELECT id FROM users WHERE phone = ?", ["1234567890"]);
        if (admin) {
            const adminId = admin.id;
            const statsSql = `
                SELECT level, COUNT(*) as count
                FROM referral_tree
                WHERE upline_id = ?
                GROUP BY level
            `;
            const stats = await queryRunner(statsSql, [adminId]);
            console.table(stats);
        }

    } catch (error) {
        log(`Diagnostic failed: ${error.message}`, "error");
    } finally {
        process.exit(0);
    }
};

checkData();
