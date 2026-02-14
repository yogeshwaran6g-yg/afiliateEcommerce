import { callSP, queryRunner, transactionRunner } from "#config/db.js";
import { log, rtnRes } from "#utils/helper.js";
import walletService from "#services/walletService.js";

export const createReferral = async (
  referrerId,
  newUserId,
  connection = null,
) => {
  try {
    log(`Creating referral link: ${referrerId} -> ${newUserId}`, "info");
    await callSP("sp_add_referral", [referrerId, newUserId], connection);
    return {
      success: true,
      message: "Referral link created successfully",
    };
  } catch (error) {
    // Check for duplicate or other specific DB errors if needed
    log(`Error creating referral: ${error.message}`, "error");
    throw error;
  }
};

export const distributeCommission = async (
  orderId,
  userId,
  amount,
  connection = null,
) => {
  return await transactionRunner(async (conn) => {
    const runner = connection || conn;
    try {
      log(
        `Distributing commission for Order ${orderId}, User ${userId}, Amount ${amount}`,
        "info",
      );
      
      // 1. Run the stored procedure to calculate and insert PENDING commissions
      await callSP(
        "sp_distribute_commission",
        [orderId, 0, userId, amount],
        runner,
      );

      // 2. Fetch the newly created commissions to credit wallets
      // Note: We might want them to stay PENDING, but the user asked for "global transaction for both"
      // suggesting they should hit the wallet now.
      const [commissions] = await runner.execute(
        'SELECT upline_id, amount, id FROM referral_commission_distribution WHERE order_id = ? AND downline_id = ?',
        [orderId, userId]
      );

      for (const comm of commissions) {
        log(`Crediting wallet for upline ${comm.upline_id}: ${comm.amount}`, "info");
        
        // 3. Update wallet balance
        await walletService.updateWalletBalance(
          comm.upline_id,
          comm.amount,
          'CREDIT',
          'COMMISSION',
          comm.id,
          `Commission from level downline user ${userId} for order ${orderId}`,
          runner
        );

        // 4. Update commission status to APPROVED since it's now in the wallet
        await runner.execute(
          "UPDATE referral_commission_distribution SET status = 'APPROVED', approved_at = NOW() WHERE id = ?",
          [comm.id]
        );
      }

      return {
        success: true,
        message: "Commissions distributed and wallets credited successfully",
      };
    } catch (error) {
      log(`Error distributing commission: ${error.message}`, "error");
      throw error;
    }
  });
};


/**
 * Get referral statistics (count and earnings) for all levels (1-6)
 */
export const getReferralStats = async (uplineId) => {
  try {
    const sql = `
      SELECT 
        lvls.level,
        COUNT(DISTINCT rt.downline_id) AS referral_count,
        COALESCE(SUM(rcd.amount), 0) AS total_earnings
      FROM (
        SELECT 1 AS level UNION SELECT 2 UNION SELECT 3 UNION 
        SELECT 4 UNION SELECT 5 UNION SELECT 6
      ) lvls
      LEFT JOIN referral_tree rt 
        ON rt.level = lvls.level AND rt.upline_id = ?
      LEFT JOIN referral_commission_distribution rcd
        ON rcd.upline_id = rt.upline_id 
        AND rcd.downline_id = rt.downline_id
        AND rcd.level = rt.level
        AND rcd.status = 'APPROVED'
      GROUP BY lvls.level
      ORDER BY lvls.level;
    `;

    const rows = await queryRunner(sql, [uplineId]);
    
    const data = (rows || []).map(row => ({
      level: row.level,
      referralCount: row.referral_count,
      totalEarnings: Number(row.total_earnings)
    }));

    return {
      success: true,
      data
    };
  } catch (error) {
    log(`Error fetching referral stats: ${error.message}`, "error");
    throw error;
  }
};

/**
 * Get comprehensive referral overview including stats and the tree (members) for all levels.
 * Groups data by level.
 */
export const getReferralOverview = async (uplineId) => {
  try {    
    const rootUserSql = `SELECT id, name FROM users WHERE id = ?`;
    const [rootUser] = await queryRunner(rootUserSql, [uplineId]);

    const statsResult = await getReferralStats(uplineId);
    if (!statsResult.success) throw new Error("Failed to fetch stats");

    // 3. Get All Referrals with Referrer and Downline Earnings
    const sql = `
      SELECT
        u.id                    AS downline_id,
        u.name,
        u.email,
        u.created_at            AS joined_at,
        rt.level,
        referrer.id             AS referrer_id,
        referrer.name           AS referrer_name,
        (
            SELECT COALESCE(SUM(rcd_inner.amount), 0)
            FROM referral_commission_distribution rcd_inner
            JOIN referral_tree descendant_tree ON rcd_inner.downline_id = descendant_tree.downline_id
            WHERE rcd_inner.upline_id = ? 
              AND descendant_tree.upline_id = u.id
              AND rcd_inner.status = 'APPROVED'
        ) AS downline_earnings
      FROM referral_tree rt
      JOIN users u ON u.id = rt.downline_id
      LEFT JOIN referral_tree direct_referrer_tree 
        ON direct_referrer_tree.downline_id = u.id AND direct_referrer_tree.level = 1
      LEFT JOIN users referrer 
        ON referrer.id = direct_referrer_tree.upline_id
      WHERE rt.upline_id = ?
      ORDER BY rt.level ASC, u.created_at DESC;
    `;

    const allReferrals = await queryRunner(sql, [uplineId, uplineId]);
    
    // 4. Group referrals by level
    const levelsData = statsResult.data.map(lvlStat => {
      const levelMembers = allReferrals 
        ? allReferrals
            .filter(r => r.level === lvlStat.level)
            .map(r => ({
              id: r.downline_id,
              name: r.name,
              email: r.email,
              joinedAt: r.joined_at,
              referrer: r.referrer_id ? {
                id: r.referrer_id,
                name: r.referrer_name
              } : null,
              downlineEarnings: Number(r.downline_earnings)
            }))
        : [];

      return {
        ...lvlStat,
        members: levelMembers
      };
    });

    return {
      success: true,
      data: {
        root: rootUser ? { id: rootUser.id, name: rootUser.name } : null,
        totalLevels: 6,
        overallCount: levelsData.reduce((sum, l) => sum + l.referralCount, 0),
        overallEarnings: levelsData.reduce((sum, l) => sum + l.totalEarnings, 0),
        levels: levelsData
      }
    };
  } catch (error) {
    log(`Error fetching referral overview: ${error.message}`, "error");
    throw error;
  }
};
