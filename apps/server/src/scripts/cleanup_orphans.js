import pool from '../config/db.js';
import { log } from '../utils/helper.js';

const cleanupOrphans = async () => {
    const connection = await pool.getConnection();
    try {
        log("Starting cleanup of orphaned referral data...", "info");
        await connection.beginTransaction();

        // 1. Remove orphaned referral_tree entries
        const [referralTreeResult] = await connection.execute(`
            DELETE rt FROM referral_tree rt
            LEFT JOIN users u ON u.id = rt.downline_id
            WHERE u.id IS NULL
        `);
        log(`Removed ${referralTreeResult.affectedRows} orphaned rows from referral_tree.`, "success");

        // 2. Remove orphaned referral_commission_distribution entries
        // (Just in case, although these should mostly be valid if they have order IDs)
        const [commResult] = await connection.execute(`
            DELETE rcd FROM referral_commission_distribution rcd
            LEFT JOIN users u ON u.id = rcd.downline_id
            WHERE u.id IS NULL
        `);
        log(`Removed ${commResult.affectedRows} orphaned rows from referral_commission_distribution.`, "success");

        await connection.commit();
        log("Cleanup completed successfully.", "success");
    } catch (error) {
        await connection.rollback();
        log(`Cleanup failed: ${error.message}`, "error");
    } finally {
        connection.release();
        process.exit(0);
    }
};

cleanupOrphans();
