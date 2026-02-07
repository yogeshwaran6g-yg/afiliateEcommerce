import { callSP, queryRunner } from "../config/db.js";
import { log, rtnRes } from "../utils/helper.js";

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
  try {
    log(
      `Distributing commission for Order ${orderId}, User ${userId}, Amount ${amount}`,
      "info",
    );
    await callSP(
      "sp_distribute_commission",
      [orderId, 0, userId, amount],
      connection,
    ); // Added 0 for paymentId as placeholder if not provided
    return {
      success: true,
      message: "Commissions distributed successfully",
    };
  } catch (error) {
    log(`Error distributing commission: ${error.message}`, "error");
    throw error;
  }
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
    
    const data = rows.map(row => ({
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
    // 1. Get Summary Stats (counts and earnings)
    const statsResult = await getReferralStats(uplineId);
    if (!statsResult.success) throw new Error("Failed to fetch stats");

    // 2. Get All Referrals for this upline (all levels)
    const sql = `
      SELECT
        u.id                    AS downline_id,
        u.name,
        u.email,
        u.created_at            AS joined_at,
        rt.level,
        COALESCE(SUM(rcd.amount), 0) AS total_amount
      FROM referral_tree rt
      JOIN users u ON u.id = rt.downline_id
      LEFT JOIN referral_commission_distribution rcd
        ON rcd.upline_id = rt.upline_id
       AND rcd.downline_id = rt.downline_id
       AND rcd.level = rt.level
       AND rcd.status = 'APPROVED'
      WHERE rt.upline_id = ?
      GROUP BY u.id, u.name, u.email, u.created_at, rt.level
      ORDER BY rt.level ASC, u.created_at DESC;
    `;

    const allReferrals = await queryRunner(sql, [uplineId]);
    
    // 2.5 Get Per-Member Contributions (Depth-Limited)
    // This query finds who (among Level 1 direct referrals) is responsible for the earnings in each level.
    const contributionSql = `
      SELECT 
        COALESCE(ancestor.downline_id, rcd.downline_id) as l1_id,
        rcd.level as target_level,
        SUM(rcd.amount) as amount
      FROM referral_commission_distribution rcd
      LEFT JOIN referral_tree ancestor 
        ON ancestor.upline_id = rcd.upline_id 
        AND ancestor.level = 1
        AND EXISTS (
            SELECT 1 FROM referral_tree rt 
            WHERE rt.upline_id = ancestor.downline_id 
            AND rt.downline_id = rcd.downline_id 
            AND rt.level = rcd.level - 1
        )
      WHERE rcd.upline_id = ? AND rcd.status = 'APPROVED'
      GROUP BY l1_id, target_level;
    `;
    const contributionRows = await queryRunner(contributionSql, [uplineId]);

    // 3. Map status and referrals into a single integrated structure
    const overview = statsResult.data.map(lvlStat => {
      const levelMembers = allReferrals 
        ? allReferrals
            .filter(r => r.level === lvlStat.level)
            .map(r => ({
              id: r.downline_id,
              name: r.name,
              email: r.email,
              joinedAt: r.joined_at,
              totalAmount: Number(r.total_amount)
            }))
        : [];

      // Filter contributions for this specific level
      const distributions = contributionRows
        ? contributionRows
            .filter(c => c.target_level === lvlStat.level)
            .map(c => ({
              memberId: c.l1_id,
              amount: Number(c.amount)
            }))
        : [];

      return {
        ...lvlStat,
        members: levelMembers,
        contributions: distributions
      };
    });

    return {
      success: true,
      data: {
        totalLevels: 6,
        overallCount: overview.reduce((sum, l) => sum + l.referralCount, 0),
        overallEarnings: overview.reduce((sum, l) => sum + l.totalEarnings, 0),
        levels: overview
      }
    };
  } catch (error) {
    log(`Error fetching referral overview: ${error.message}`, "error");
    throw error;
  }
};
