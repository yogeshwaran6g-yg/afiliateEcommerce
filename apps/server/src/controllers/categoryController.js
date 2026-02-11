import categoryService from "#src/services/categoryService.js";
import { rtnRes } from "#src/utils/helper.js"

const categoryController = {
    getAllCategories: async function(req, res) {
        try {
            const { id, name, parent_id } = req.query;
            const filters = {};
            if (id) filters.id = id;
            if (name) filters.name = name;
            if (parent_id !== undefined && parent_id !== null && parent_id !== "") filters.parent_id = parent_id;

            const result = await categoryService.get(filters);
            if (result.success && result.data) {
                return rtnRes(res, 200, result.msg, result.data);   
            }

            return rtnRes(res, result.code, result.msg);
        } catch (err) {
            console.log("err from getAllCategories ", err);
            return rtnRes(res, 500, "Internal Error");
        }
    },

    getCategoryById: async function(req, res) {
        try {
            const id = req.params.id || req.query.id || req.body.id;
            if (!id) {
                return rtnRes(res, 400, "id is required");
            }

            const result = await categoryService.get({ id });
            if (result.success && result.data) {
                return rtnRes(res, 200, result.msg, result.data);
            }

            return rtnRes(res, result.code, result.msg);
        } catch (err) {
            console.log("err from getCategoryById ", err);
            return rtnRes(res, 500, "Internal Error");
        }
    },

    createCategory: async function(req, res) {
        try {
            const { name } = req.body;
            if (!name) {
                return rtnRes(res, 400, "Category name is required");
            }

            const result = await categoryService.create(req.body);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.log("err from createCategory ", err);
            return rtnRes(res, 500, "Internal Error");
        }
    },

    updateCategory: async function(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return rtnRes(res, 400, "Category id is required");
            }

            const result = await categoryService.update(id, req.body);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.log("err from updateCategory ", err);
            return rtnRes(res, 500, "Internal Error");
        }
    },

    deleteCategory: async function(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return rtnRes(res, 400, "Category id is required");
            }

            const result = await categoryService.delete(id);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.log("err from deleteCategory ", err);
            return rtnRes(res, 500, "Internal Error");
        }
    },
}

export default categoryController;