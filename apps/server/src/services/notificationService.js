import { queryRunner } from "#src/config/db.js";
import { srvRes } from "#src/utils/helper.js";

const notificationService = {
    create: async function (data) {
        try {
            const { heading, short_description, long_description, image_url, advertisement_end_time } = data;

            const sql = `
                INSERT INTO notifications (
                    heading, short_description, long_description, image_url, advertisement_end_time
                ) VALUES (?, ?, ?, ?, ?)
            `;
            const params = [heading, short_description, long_description, image_url || null, advertisement_end_time];

            const result = await queryRunner(sql, params);
            if (result && result.affectedRows > 0) {
                return srvRes(201, "Notification created successfully", { id: result.insertId, ...data });
            }
            return srvRes(400, "Failed to create notification");
        } catch (e) {
            throw e;
        }
    },

    get: async function (filters = {}) {
        try {
            let sql = `SELECT * FROM notifications WHERE 1=1`;
            const params = [];

            if (filters.id) {
                sql += ` AND id = ?`;
                params.push(filters.id);
            }

            // Return only active notifications if requested
            const activeOnly = filters.activeOnly === true || filters.activeOnly === "true" || filters.activeOnly === "1";
            if (activeOnly) {
                sql += ` AND (advertisement_end_time > NOW() OR advertisement_end_time IS NULL)`;
            }

            sql += ` ORDER BY created_at DESC`;

            const result = await queryRunner(sql, params);
            return srvRes(200, "Successfully fetched notifications", result);
        } catch (e) {
            throw e;
        }
    },

    update: async function (id, data) {
        try {
            const fields = [];
            const params = [];

            for (const [key, value] of Object.entries(data)) {
                fields.push(`${key} = ?`);
                params.push(value === undefined ? null : value);
            }

            if (fields.length === 0) return srvRes(400, "No fields to update");

            const sql = `UPDATE notifications SET ${fields.join(', ')} WHERE id = ?`;
            params.push(id);

            const result = await queryRunner(sql, params);
            if (result && result.affectedRows > 0) {
                return srvRes(200, "Notification updated successfully");
            }
            return srvRes(404, "Notification not found or no changes made");
        } catch (e) {
            throw e;
        }
    },

    delete: async function (id) {
        try {
            const sql = `DELETE FROM notifications WHERE id = ?`;
            const result = await queryRunner(sql, [id]);
            if (result && result.affectedRows > 0) {
                return srvRes(200, "Notification deleted successfully");
            }
            return srvRes(404, "Notification not found");
        } catch (e) {
            throw e;
        }
    }
};

export default notificationService;
