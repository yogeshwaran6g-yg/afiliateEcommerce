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
        "SELECT upline_id, amount, id FROM referral_commission_distribution WHERE order_id = ? AND downline_id = ?",
        [orderId, userId],
      );

      for (const comm of commissions) {
        log(
          `Crediting wallet for upline ${comm.upline_id}: ${comm.amount}`,
          "info",
        );

        // 3. Update wallet balance
        await walletService.updateWalletBalance(
          comm.upline_id,
          comm.amount,
          "CREDIT",
          "REFERRAL_COMMISSION",
          "referral_commission_distribution",
          comm.id,
          `Commission from level downline user ${userId} for order ${orderId}`,
          "SUCCESS",
          null,
          runner,
        );

        // 4. Update commission status to APPROVED since it's now in the wallet
        await runner.execute(
          "UPDATE referral_commission_distribution SET status = 'APPROVED', approved_at = NOW() WHERE id = ?",
          [comm.id],
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
        (SELECT COUNT(rt.downline_id) FROM referral_tree rt JOIN users u ON u.id = rt.downline_id WHERE rt.upline_id = ? AND rt.level = lvls.level) AS referral_count,
        (SELECT COALESCE(SUM(rcd.amount), 0) FROM referral_commission_distribution rcd WHERE rcd.upline_id = ? AND rcd.level = lvls.level AND rcd.status = 'APPROVED') AS total_earnings
      FROM (
        SELECT 1 AS level UNION SELECT 2 UNION SELECT 3 UNION 
        SELECT 4 UNION SELECT 5 UNION SELECT 6
      ) lvls
      ORDER BY lvls.level;
    `;

    const rows = await queryRunner(sql, [uplineId, uplineId]);

    const data = (rows || []).map((row) => ({
      level: row.level,
      referralCount: row.referral_count,
      totalEarnings: Number(row.total_earnings),
    }));

    return {
      success: true,
      data,
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
      SELECT DISTINCT
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
            WHERE rcd_inner.upline_id = ? 
              AND rcd_inner.status = 'APPROVED'
              AND (
                rcd_inner.downline_id = u.id 
                OR EXISTS (
                  SELECT 1 FROM referral_tree rt_sub 
                  WHERE rt_sub.upline_id = u.id 
                  AND rt_sub.downline_id = rcd_inner.downline_id
                )
              )
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
    const levelsData = statsResult.data.map((lvlStat) => {
      const levelMembers = allReferrals
        ? allReferrals
          .filter((r) => r.level === lvlStat.level)
          .map((r) => ({
            id: r.downline_id,
            name: r.name,
            email: r.email,
            joinedAt: r.joined_at,
            referrer: r.referrer_id
              ? {
                id: r.referrer_id,
                name: r.referrer_name,
              }
              : null,
            downlineEarnings: Number(r.downline_earnings),
          }))
        : [];

      return {
        ...lvlStat,
        members: levelMembers,
      };
    });

    return {
      success: true,
      data: {
        root: rootUser ? { id: rootUser.id, name: rootUser.name } : null,
        totalLevels: 6,
        overallCount: levelsData.reduce((sum, l) => sum + l.referralCount, 0),
        overallEarnings: levelsData.reduce(
          (sum, l) => sum + l.totalEarnings,
          0,
        ),
        levels: levelsData,
      },
    };
  } catch (error) {
    log(`Error fetching referral overview: ${error.message}`, "error");
    throw error;
  }
};

export const getDirectReferrals = async (uplineId, page = 1, limit = 10) => {
  try {
    const p = Math.max(1, Number(page));
    const l = Math.max(1, Number(limit));
    const offset = (p - 1) * l;

    // 1. Get total count for pagination
    const countSql = `
      SELECT COUNT(*) as total
      FROM referral_tree rt
      JOIN users u ON u.id = rt.downline_id
      WHERE rt.upline_id = ? AND rt.level = 1
    `;
    const [countResult] = await queryRunner(countSql, [uplineId]);
    const totalReferrals = countResult?.total || 0;

    // 2. Get paginated referrals
    const referralsSql = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.created_at AS joined_at,
        u.is_active AS status,
        COALESCE(
          (SELECT SUM(rcd.amount) 
           FROM referral_commission_distribution rcd
           WHERE rcd.upline_id = ? 
             AND rcd.status = 'APPROVED'
             AND (
               rcd.downline_id = u.id 
               OR EXISTS (
                 SELECT 1 FROM referral_tree rt_sub 
                 WHERE rt_sub.upline_id = u.id 
                 AND rt_sub.downline_id = rcd.downline_id
               )
             )
          ), 
          0
        ) AS total_contribution
      FROM referral_tree rt
      JOIN users u ON u.id = rt.downline_id
      WHERE rt.upline_id = ? AND rt.level = 1
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?;
    `;

    const statsSql = `
      SELECT 
        COUNT(*) as total_count,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as active_today
      FROM referral_tree 
      WHERE upline_id = ? AND level = 1;
    `;

    const [directReferrals, [stats]] = await Promise.all([
      queryRunner(referralsSql, [uplineId, uplineId, Number(limit), Number(offset)]),
      queryRunner(statsSql, [uplineId]),
    ]);

    return {
      success: true,
      data: {
        count: stats?.total_count || 0,
        activeToday: stats?.active_today || 0,
        referrals: (directReferrals || []).map((r) => {
          return {
            id: r.id,
            name: r.name,
            email: r.email,
            phone: r.phone,
            joinedAt: r.joined_at,
            status: r.status ? "Active" : "Inactive",
            totalContribution: Number(r.total_contribution),
          };
        }),
        pagination: {
          total: totalReferrals,
          page: p,
          limit: l,
          totalPages: Math.ceil(totalReferrals / l),
        },
      },
    };
  } catch (error) {
    log(`Error fetching direct referrals: ${error.message}`, "error");
    throw error;
  }
};
export const getTeamMembersByLevel = async (uplineId, level, page = 1, limit = 10) => {
  try {
    const p = Math.max(1, Number(page));
    const l = Math.max(1, Number(limit));
    const offset = (p - 1) * l;

    // 1. Get total count for pagination
    const countSql = `
      SELECT COUNT(DISTINCT rt.downline_id) as total
      FROM referral_tree rt
      JOIN users u ON u.id = rt.downline_id
      WHERE rt.upline_id = ? AND rt.level = ?
    `;
    const [countResult] = await queryRunner(countSql, [uplineId, level]);
    const totalMembers = countResult?.total || 0;

    // 2. Get paginated members with details and contribution
    const sql = `
      SELECT DISTINCT
        u.id                    AS downline_id,
        u.name,
        u.email,
        u.phone,
        u.created_at            AS joined_at,
        u.is_active             AS status,
        rt.level,
        referrer.id             AS referrer_id,
        referrer.name           AS referrer_name,
        (
            SELECT COALESCE(SUM(rcd_inner.amount), 0)
            FROM referral_commission_distribution rcd_inner
            WHERE rcd_inner.upline_id = ? 
              AND rcd_inner.status = 'APPROVED'
              AND (
                rcd_inner.downline_id = u.id 
                OR EXISTS (
                  SELECT 1 FROM referral_tree rt_sub 
                  WHERE rt_sub.upline_id = u.id 
                  AND rt_sub.downline_id = rcd_inner.downline_id
                )
              )
        ) AS contribution
      FROM referral_tree rt
      JOIN users u ON u.id = rt.downline_id
      LEFT JOIN referral_tree direct_referrer_tree 
        ON direct_referrer_tree.downline_id = u.id AND direct_referrer_tree.level = 1
      LEFT JOIN users referrer 
        ON referrer.id = direct_referrer_tree.upline_id
      WHERE rt.upline_id = ? AND rt.level = ?
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?;
    `;

    const members = await queryRunner(sql, [uplineId, uplineId, level, Number(limit), Number(offset)]);

    return {
      success: true,
      data: {
        members: (members || []).map(m => ({
          id: m.downline_id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          joinedAt: m.joined_at,
          status: m.status ? "Active" : "Inactive",
          contribution: Number(m.contribution),
          referrer: m.referrer_id ? { id: m.referrer_id, name: m.referrer_name } : null
        })),
        pagination: {
          total: totalMembers,
          page: p,
          limit: l,
          totalPages: Math.ceil(totalMembers / l)
        }
      }
    };
  } catch (error) {
    log(`Error fetching team members by level: ${error.message}`, "error");
    throw error;
  }
};

/**
 * Get recursive tree data for a given upline user up to a certain depth.
 */
export const getRecursiveTree = async (uplineId, maxDepth = 6) => {
  try {
    // 1. Get user details for the root
    const [user] = await queryRunner(`SELECT id, name, created_at FROM users WHERE id = ?`, [uplineId]);
    if (!user) throw new Error("User not found");

    // 2. Recursive function to build the tree
    const buildTree = async (currentId, currentLevel, targetLevel) => {
      if (currentLevel >= targetLevel) return [];

      const sql = `
        SELECT 
          u.id, 
          u.name, 
          u.created_at as joinedAt,
          u.is_active as status,
          (SELECT COUNT(*) FROM referral_tree rt_inner JOIN users u_inner ON u_inner.id = rt_inner.downline_id WHERE rt_inner.upline_id = u.id AND rt_inner.level = 1) as directRefs,
          (SELECT COUNT(*) FROM referral_tree rt_inner JOIN users u_inner ON u_inner.id = rt_inner.downline_id WHERE rt_inner.upline_id = u.id) as networkSize,
          COALESCE((SELECT SUM(amount) FROM referral_commission_distribution WHERE upline_id = ? AND status = 'APPROVED'), 0) as earnings
        FROM referral_tree rt
        JOIN users u ON u.id = rt.downline_id
        WHERE rt.upline_id = ? AND rt.level = 1
      `;

      const children = await queryRunner(sql, [currentId, currentId]);

      const treeChildren = await Promise.all(
        (children || []).map(async (child) => {
          const subChildren = await buildTree(child.id, currentLevel + 1, targetLevel);
          return {
            id: child.id,
            name: child.name,
            joinDate: child.joinedAt,
            status: child.status ? "active" : "inactive",
            level: currentLevel + 1,
            directRefs: child.directRefs,
            networkSize: child.networkSize,
            earnings: Number(child.earnings),
            children: subChildren
          };
        })
      );

      return treeChildren;
    };

    // Root stats
    const [[rootStats]] = await Promise.all([
      queryRunner(`
        SELECT 
          (SELECT COUNT(*) FROM referral_tree rt_inner JOIN users u_inner ON u_inner.id = rt_inner.downline_id WHERE rt_inner.upline_id = ? AND rt_inner.level = 1) as directRefs,
          (SELECT COUNT(*) FROM referral_tree rt_inner JOIN users u_inner ON u_inner.id = rt_inner.downline_id WHERE rt_inner.upline_id = ?) as networkSize,
          COALESCE((SELECT SUM(amount) FROM referral_commission_distribution WHERE upline_id = ? AND status = 'APPROVED'), 0) as earnings
      `, [uplineId, uplineId, uplineId])
    ]);

    const tree = {
      id: user.id,
      name: user.name,
      joinDate: user.created_at,
      status: "active", // Root is usually active
      level: 0,
      directRefs: rootStats.directRefs,
      networkSize: rootStats.networkSize,
      earnings: Number(rootStats.earnings),
      children: await buildTree(uplineId, 0, maxDepth)
    };

    return {
      success: true,
      data: tree
    };
  } catch (error) {
    log(`Error fetching recursive tree: ${error.message}`, "error");
    throw error;
  }
};
