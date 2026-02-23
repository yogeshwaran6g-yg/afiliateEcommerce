import { queryRunner } from "#src/config/db.js";
import { srvRes } from "#src/utils/helper.js";

const categoryService = {
    get: async function (filters = {}) {
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
    },

    create: async function (categoryData) {
        try {
            const { name, image, parent_id } = categoryData;
            const sql = `INSERT INTO category (name, image, parent_id) VALUES (?, ?, ?)`;
            const params = [name, image || null, parent_id || null];

            const result = await queryRunner(sql, params);
            if (result && result.affectedRows > 0) {
                return srvRes(201, "Category created successfully", { id: result.insertId, ...categoryData });
            }
            return srvRes(400, "Failed to create category");
        } catch (e) {
            throw e;
        }
    },

    update: async function (id, categoryData) {
        try {
            const fields = [];
            const params = [];

            for (const [key, value] of Object.entries(categoryData)) {
                fields.push(`${key} = ?`);
                params.push(value);
            }

            if (fields.length === 0) return srvRes(400, "No fields to update");

            const sql = `UPDATE category SET ${fields.join(', ')} WHERE id = ?`;
            params.push(id);

            const result = await queryRunner(sql, params);
            if (result && result.affectedRows > 0) {
                return srvRes(200, "Category updated successfully");
            }
            return srvRes(404, "Category not found or no changes made");
        } catch (e) {
            throw e;
        }
    },

    delete: async function (id) {
        try {
            // Check if any products are using this category
            const productCheckSql = `SELECT COUNT(*) as count FROM products WHERE category_id = ?`;
            const productResult = await queryRunner(productCheckSql, [id]);
            if (productResult && productResult[0].count > 0) {
                return srvRes(400, "Cannot delete category: It has associated products. Please reassign or delete the products first.");
            }

            // Check if any sub-categories exist for this category
            const subCategoryCheckSql = `SELECT COUNT(*) as count FROM category WHERE parent_id = ?`;
            const subCategoryResult = await queryRunner(subCategoryCheckSql, [id]);
            if (subCategoryResult && subCategoryResult[0].count > 0) {
                return srvRes(400, "Cannot delete category: It has sub-categories. Please delete or reassign them first.");
            }

            const sql = `DELETE FROM category WHERE id = ?`;
            const result = await queryRunner(sql, [id]);
            if (result && result.affectedRows > 0) {
                return srvRes(200, "Category deleted successfully");
            }
            return srvRes(404, "Category not found or already deleted");
        } catch (e) {
            throw e;
        }
    }
}

export default categoryService;