import { rtnRes } from "#utils/helper.js";
import { queryRunner } from "#config/db.js";

const comisssionController = {

    getCommission: async (req, res) => {
        try {
            const { id } = req.params;
            const [rows] = await queryRunner("SELECT * FROM referral_commission_distribution WHERE id = ?", [id]);
            if (!rows.length) return rtnRes(res, 404, "Commission not found");
            rtnRes(res, 200, "Commission fetched successfully", rows[0]);
        } catch (error) {
            console.error("Error fetching commission:", error);
            rtnRes(res, 500, "Internal server error");
        }
    },

    getMyCommissions: async (req, res) => {
        try {
            const userId = req.user.id; // Assuming auth middleware populates req.user
            const sql = `
                SELECT 
                    rc.*,
                    u.name as downline_name,
                    u.email as downline_email
                FROM referral_commission_distribution rc
                JOIN users u ON rc.downline_id = u.id
                WHERE rc.upline_id = ?
                ORDER BY rc.created_at DESC
            `;
            const rows = await queryRunner(sql, [userId]);
            rtnRes(res, 200, "Commissions fetched successfully", rows);
        } catch (error) {
            console.error("Error fetching my commissions:", error);
            rtnRes(res, 500, "Internal server error");
        }
    }
};

export default comisssionController;
