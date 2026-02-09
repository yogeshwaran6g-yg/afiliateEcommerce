import pool from '#config/db.js';
import { log } from '#utils/helper.js';

const createProcedures = async () => {
    log("Creating Stored Procedures...", "info");
// add strong contstraint setup and ignore setup to avoid the duplicated rows
    const procedures = [
        `DROP PROCEDURE IF EXISTS sp_add_referral`,
        `DROP PROCEDURE IF EXISTS sp_distribute_commission`,
        
        // Procedure: sp_add_referral
        // Adds a user to the referral tree
        `
        CREATE PROCEDURE sp_add_referral(
            IN p_referrer_id BIGINT UNSIGNED,
            IN p_new_user_id BIGINT UNSIGNED
        )
        BEGIN
            -- Level 1
            INSERT IGNORE INTO referral_tree (upline_id, downline_id, level)
            VALUES (p_referrer_id, p_new_user_id, 1);
            
            -- Levels 2-6
            INSERT IGNORE INTO referral_tree (upline_id, downline_id, level)
            SELECT 
                rt.upline_id,
                p_new_user_id,
                rt.level + 1
            FROM referral_tree rt
            WHERE rt.downline_id = p_referrer_id
              AND rt.level < 6;
        END;`
        ,
        // Procedure: sp_distribute_commission
        // Calculates and inserts commissions for an order
        `CREATE PROCEDURE sp_distribute_commission(
            IN p_order_id BIGINT UNSIGNED,
            IN p_payment_id BIGINT UNSIGNED,
            IN p_user_id BIGINT UNSIGNED,
            IN p_amount DECIMAL(10,2)
        )
        BEGIN
            INSERT IGNORE INTO referral_commission_distribution
            (upline_id, downline_id, order_id, payment_id, level, percent, amount, status)
            SELECT 
                rt.upline_id,
                p_user_id,
                p_order_id,
                p_payment_id,
                rt.level,
                rcc.percent,
                ROUND(p_amount * rcc.percent / 100, 2),
                'PENDING'
            FROM referral_tree rt
            JOIN referral_commission_config rcc 
                ON rt.level = rcc.level
            WHERE rt.downline_id = p_user_id
              AND rcc.is_active = 1;
        END;`
    ];

    for (const sql of procedures) {
        try {
            await pool.query(sql); // Changed from queryRunner(sql)
            // Simple check to identify which one ran
            if (sql.includes("CREATE PROCEDURE")) {
                const name = sql.match(/CREATE PROCEDURE (\w+)/)[1];
                log(`Procedure ${name} created/updated.`, "success");
            }
        } catch (error) {
            log(`Failed to execute SQL: ${error.message}`, "error");
            process.exit(1);
        }
    }

    log("All procedures created successfully.", "success");
};

createProcedures()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
