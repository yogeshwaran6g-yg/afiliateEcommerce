import popupBannerService from "#src/services/popupBannerService.js";
import { rtnRes, log } from "#src/utils/helper.js";

const popupBannerController = {
    getActive: async function (req, res) {
        try {
            const result = await popupBannerService.getActive();
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (e) {
            log(`Error in getActive popup: ${e.message}`, "error");
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    getAll: async function (req, res) {
        try {
            const result = await popupBannerService.getAll();
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (e) {
            log(`Error in getAll popups: ${e.message}`, "error");
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    create: async function (req, res) {
        try {
            const { title } = req.body;
            if (!title) return rtnRes(res, 400, "Title is required");

            const data = { ...req.body };
            if (req.file) {
                data.logo = `/uploads/products/${req.file.filename}`;
            }

            const result = await popupBannerService.create(data);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (e) {
            log(`Error creating popup: ${e.message}`, "error");
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    update: async function (req, res) {
        try {
            const { id } = req.params;
            const data = { ...req.body };
            if (req.file) {
                data.logo = `/uploads/products/${req.file.filename}`;
            }
            const result = await popupBannerService.update(id, data);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (e) {
            log(`Error updating popup: ${e.message}`, "error");
            return rtnRes(res, 500, "Internal Server Error");
        }
    },

    delete: async function (req, res) {
        try {
            const { id } = req.params;
            const result = await popupBannerService.delete(id);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (e) {
            log(`Error deleting popup: ${e.message}`, "error");
            return rtnRes(res, 500, "Internal Server Error");
        }
    }
};

export default popupBannerController;
