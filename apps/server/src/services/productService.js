import { queryRunner } from "#src/config/db.js";
import { srvRes } from "#src/utils/helper.js";

const productService = {
    create: async function (productData) {
        try {
            const {
                name, slug, short_desc, long_desc, category_id,
                original_price, sale_price, stock, stock_status,
                low_stock_alert, images
            } = productData;

            // Validation: Check if category exists
            const categoryCheck = await queryRunner(`SELECT id FROM category WHERE id = ?`, [category_id]);
            if (!categoryCheck || categoryCheck.length === 0) {
                return srvRes(400, "Invalid category_id: Category does not exist");
            }

            // Validation: Check if slug is unique
            const slugCheck = await queryRunner(`SELECT id FROM products WHERE slug = ?`, [slug]);
            if (slugCheck && slugCheck.length > 0) {
                return srvRes(400, "Slug already exists: Choose a unique slug");
            }

            const sql = `
                INSERT INTO products (
                    name, slug, short_desc, long_desc, category_id, 
                    original_price, sale_price, stock, stock_status, 
                    low_stock_alert, images, pv, is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                name || null,
                slug || null,
                short_desc || null,
                long_desc || null,
                category_id || null,
                original_price || 0,
                sale_price || 0,
                stock || 0,
                stock_status || 'IN_STOCK',
                low_stock_alert || 5,
                JSON.stringify(images || []),
                pv || 0,
                is_active === undefined ? 1 : is_active
            ];

            const result = await queryRunner(sql, params);
            if (result && result.affectedRows > 0) {
                return srvRes(201, "Product created successfully", { id: result.insertId, ...productData });
            }
            return srvRes(400, "Failed to create product");
        } catch (e) {
            throw e;
        }
    },

    get: async function (filters = {}) {
        try {
            let sql = `SELECT p.*, c.name as category_name FROM products p 
                       LEFT JOIN category c ON p.category_id = c.id 
                       WHERE 1=1`;
            const params = [];

            if (filters.id) {
                sql += ` AND p.id = ?`;
                params.push(filters.id);
            }

            if (filters.category_id) {
                sql += ` AND p.category_id = ?`;
                params.push(filters.category_id);
            }

            if (filters.name) {
                sql += ` AND p.name LIKE ?`;
                params.push(`%${filters.name}%`);
            }

            if (filters.slug) {
                sql += ` AND p.slug = ?`;
                params.push(filters.slug);
            }

            if (filters.stock_status) {
                sql += ` AND p.stock_status = ?`;
                params.push(filters.stock_status);
            }

            if (filters.min_price) {
                sql += ` AND p.sale_price >= ?`;
                params.push(filters.min_price);
            }

            if (filters.max_price) {
                sql += ` AND p.sale_price <= ?`;
                params.push(filters.max_price);
            }

            if (filters.is_active !== undefined) {
                sql += ` AND p.is_active = ?`;
                params.push(filters.is_active);
            }

            // Implementation of sorting
            const sort = filters.sort || 'newest';
            switch (sort) {
                case 'price-low':
                    sql += ` ORDER BY p.sale_price ASC`;
                    break;
                case 'price-high':
                    sql += ` ORDER BY p.sale_price DESC`;
                    break;
                case 'pv':
                    sql += ` ORDER BY p.pv DESC`;
                    break;
                case 'newest':
                default:
                    sql += ` ORDER BY p.created_at DESC`;
                    break;
            }

            const result = await queryRunner(sql, params);
            if (result && result.length > 0) {
                return srvRes(200, "Successfully fetched products", result);
            }
            return srvRes(404, "No products found");
        } catch (e) {
            throw e;
        }
    },

    update: async function (id, productData) {
        try {
            // Validation: Check if product exists
            const productCheck = await queryRunner(`SELECT id FROM products WHERE id = ?`, [id]);
            if (!productCheck || productCheck.length === 0) {
                return srvRes(404, "Product not found");
            }

            // Validation: Check category if provided
            if (productData.category_id) {
                const categoryCheck = await queryRunner(`SELECT id FROM category WHERE id = ?`, [productData.category_id]);
                if (!categoryCheck || categoryCheck.length === 0) {
                    return srvRes(400, "Invalid category_id: Category does not exist");
                }
            }

            // Validation: Check slug if provided
            if (productData.slug) {
                const slugCheck = await queryRunner(`SELECT id FROM products WHERE slug = ? AND id != ?`, [productData.slug, id]);
                if (slugCheck && slugCheck.length > 0) {
                    return srvRes(400, "Slug already exists: Choose a unique slug");
                }
            }

            const fields = [];
            const params = [];

            const ALLOWED_COLUMNS = [
                'name', 'slug', 'short_desc', 'long_desc', 'category_id',
                'original_price', 'sale_price', 'stock', 'stock_status',
                'low_stock_alert', 'images', 'is_active', 'pv'
            ];

            for (const [key, value] of Object.entries(productData)) {
                if (!ALLOWED_COLUMNS.includes(key)) continue;

                if (key === 'images') {
                    fields.push(`${key} = ?`);
                    params.push(JSON.stringify(value));
                } else {
                    fields.push(`${key} = ?`);
                    params.push(value === undefined ? null : value);
                }
            }

            if (fields.length === 0) return srvRes(400, "No fields to update");

            const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
            params.push(id);

            const result = await queryRunner(sql, params);
            if (result) {
                return srvRes(200, "Product updated successfully");
            }
            return srvRes(400, "Failed to update product");
        } catch (e) {
            throw e;
        }
    },

    delete: async function (id) {
        try {
            const sql = `DELETE FROM products WHERE id = ?`;
            const result = await queryRunner(sql, [id]);
            if (result && result.affectedRows > 0) {
                return srvRes(200, "Product deleted successfully");
            }
            return srvRes(404, "Product not found or already deleted");
        } catch (e) {
            throw e;
        }
    }
};

export default productService;
