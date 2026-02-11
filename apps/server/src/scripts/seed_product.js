import pool from '../config/db.js';
import { log } from '../utils/helper.js';

const seedProduct = async () => {
    try {
        log("Seeding test product and category...", "info");

        // 1. Create Category
        const [catResult] = await pool.query(
            'INSERT INTO category (name, parent_id) VALUES (?, ?)',
            ['Test Category', null]
        );
        const catId = catResult.insertId;

        // 2. Create Product
        await pool.query(
            'INSERT INTO products (name, slug, short_desc, long_desc, category_id, original_price, sale_price, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            ['Test Product', 'test-product', 'Short desc', 'Long desc', catId, 100, 80, 50]
        );

        log("Product seeded successfully.", "success");
        process.exit(0);
    } catch (error) {
        log(`Seeding Product Failed: ${error.message}`, "error");
        process.exit(1);
    }
};

seedProduct();
