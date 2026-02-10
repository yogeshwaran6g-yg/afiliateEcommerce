import productService from '#src/services/productService.js';
import { queryRunner } from '#src/config/db.js';
import { log } from '#src/utils/helper.js';

const runValidationTest = async () => {
    log("Starting Product Validation Verification...", "info");

    try {
        // Setup
        await queryRunner("DELETE FROM products");
        await queryRunner("DELETE FROM category");
        await queryRunner("INSERT INTO category (id, name) VALUES (1, 'Test Category')");
        log("Setup complete.", "success");

        // 1. Test invalid category_id
        const res1 = await productService.create({
            name: 'P1', slug: 's1', short_desc: 'd', long_desc: 'ld', 
            category_id: 999, original_price: 100, sale_price: 80
        });
        if (!res1.success && res1.code === 400 && res1.msg.includes("category_id")) {
            log("Invalid category_id check: PASSED", "success");
        } else {
            log("Invalid category_id check: FAILED", "error", res1);
        }

        // 2. Test duplicate slug
        await productService.create({
            name: 'P1', slug: 'same-slug', short_desc: 'd', long_desc: 'ld', 
            category_id: 1, original_price: 100, sale_price: 80
        });
        const res2 = await productService.create({
            name: 'P2', slug: 'same-slug', short_desc: 'd', long_desc: 'ld', 
            category_id: 1, original_price: 100, sale_price: 80
        });
        if (!res2.success && res2.code === 400 && res2.msg.includes("Slug already exists")) {
            log("Duplicate slug check: PASSED", "success");
        } else {
            log("Duplicate slug check: FAILED", "error", res2);
        }

        log("Product Validation Verification Completed!", "success");
        process.exit(0);
    } catch (err) {
        log(`Validation Verification Failed: ${err.message}`, "error");
        process.exit(1);
    }
};

runValidationTest();
