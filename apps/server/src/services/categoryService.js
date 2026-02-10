import { queryRunner } from "#src/config/db.js";
import { srvRes } from "#src/utils/helper.js";

const categoryService = {
    get: async function(filters = {}) {
        try {
            let sql = `SELECT * FROM category WHERE 1=1`;
            const params = [];

            if (filters.id) {
                sql += ` AND id = ?`;
                params.push(filters.id);
            }

            if (filters.name) {
                sql += ` AND name LIKE ?`;
                params.push(`%${filters.name}%`);
            }

            if (filters.parent_id !== undefined && filters.parent_id !== null && filters.parent_id !== "") {
                sql += ` AND parent_id = ?`;
                params.push(filters.parent_id);
            }

            sql += ` ORDER BY created_at DESC`;

            const result = await queryRunner(sql, params);
            if (result && result.length > 0) {
                return srvRes(200, "Successfully fetched categories", result);
            }
            return srvRes(404, "No categories found");
        } catch (e) {
            throw e;
        }
    }
}

export default categoryService;