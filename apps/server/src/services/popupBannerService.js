import { queryRunner } from "#src/config/db.js";
import { log } from "#src/utils/helper.js";

const srvRes = (code, msg, data = null) => ({ code, msg, data });

const popupBannerService = {
    getActive: async function () {
        try {
            const rows = await queryRunner(
                `SELECT * FROM popup_banners WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1`
            );
            return srvRes(200, "Active popup fetched", rows && rows.length > 0 ? rows[0] : null);
        } catch (e) {
            log(`Error in getActive popup: ${e.message}`, "error");
            throw e;
        }
    },

    getAll: async function () {
        try {
            const rows = await queryRunner(
                `SELECT * FROM popup_banners ORDER BY created_at DESC`
            );
            return srvRes(200, "Popups fetched", rows || []);
        } catch (e) {
            log(`Error in getAll popups: ${e.message}`, "error");
            throw e;
        }
    },

    create: async function (data) {
        try {
            const { logo, title, short_description, long_description, is_active = 1 } = data;
            await queryRunner(
                `INSERT INTO popup_banners (logo, title, short_description, long_description, is_active) VALUES (?, ?, ?, ?, ?)`,
                [logo || null, title, short_description || null, long_description || null, is_active ? 1 : 0]
            );
            return srvRes(201, "Popup banner created");
        } catch (e) {
            log(`Error creating popup: ${e.message}`, "error");
            throw e;
        }
    },

    update: async function (id, data) {
        try {
            const fields = [];
            const params = [];
            if (data.logo !== undefined) { fields.push("logo = ?"); params.push(data.logo); }
            if (data.title !== undefined) { fields.push("title = ?"); params.push(data.title); }
            if (data.short_description !== undefined) { fields.push("short_description = ?"); params.push(data.short_description); }
            if (data.long_description !== undefined) { fields.push("long_description = ?"); params.push(data.long_description); }
            if (data.is_active !== undefined) { fields.push("is_active = ?"); params.push(data.is_active ? 1 : 0); }

            if (fields.length === 0) return srvRes(400, "No fields to update");

            params.push(id);
            await queryRunner(`UPDATE popup_banners SET ${fields.join(", ")} WHERE id = ?`, params);
            return srvRes(200, "Popup banner updated");
        } catch (e) {
            log(`Error updating popup: ${e.message}`, "error");
            throw e;
        }
    },

    delete: async function (id) {
        try {
            await queryRunner(`DELETE FROM popup_banners WHERE id = ?`, [id]);
            return srvRes(200, "Popup banner deleted");
        } catch (e) {
            log(`Error deleting popup: ${e.message}`, "error");
            throw e;
        }
    }
};

export default popupBannerService;
