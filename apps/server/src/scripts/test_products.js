import { queryRunner } from '#src/config/db.js';
import productService from '#src/services/productService.js';
import { log } from '#src/utils/helper.js';

const runProductTest = async () => {
    log("Starting Product Service Verification...", "info");

    try {
        // 1. Setup - Ensure we have a category
        await queryRunner("SET FOREIGN_KEY_CHECKS = 0");
        await queryRunner("DELETE FROM products");
        await queryRunner("DELETE FROM category");
        await queryRunner("INSERT INTO category (id, name) VALUES (1, 'Test Category')");
        await queryRunner("SET FOREIGN_KEY_CHECKS = 1");
        log("Setup category for product testing.", "success");

        // 2. Test Create
        const productData = {
            name: 'Test Product',
            slug: 'test-product',
            short_desc: 'Short description',
            long_desc: 'Long description',
            category_id: 1,
            original_price: 1000.00,
            sale_price: 800.00,
            stock: 10,
            stock_status: 'IN_STOCK',
            low_stock_alert: 2,
            images: ['img1.jpg', 'img2.jpg']
        };

        const createRes = await productService.create(productData);
        if (createRes.success) {
            log("Test Product Create: PASSED", "success");
        } else {
            log(`Test Product Create: FAILED (${createRes.msg})`, "error");
        }

        const productId = createRes.data.id;

        // 3. Test Get
        const getRes = await productService.get({ id: productId });
        if (getRes.success && getRes.data[0].name === 'Test Product') {
            log("Test Product Get by ID: PASSED", "success");
        } else {
            log("Test Product Get by ID: FAILED", "error");
        }

        // 4. Test Update
        const updateRes = await productService.update(productId, { name: 'Updated Product Name', stock: 15 });
        if (updateRes.success) {
            log("Test Product Update: PASSED", "success");
        } else {
            log("Test Product Update: FAILED", "error");
        }

        // Verify Update
        const verifyUpdate = await productService.get({ id: productId });
        if (verifyUpdate.success && verifyUpdate.data[0].name === 'Updated Product Name' && verifyUpdate.data[0].stock === 15) {
            log("Verification of Product Update: PASSED", "success");
        } else {
            log("Verification of Product Update: FAILED", "error");
        }

        // 5. Test Delete
        const deleteRes = await productService.delete(productId);
        if (deleteRes.success) {
            log("Test Product Delete: PASSED", "success");
        } else {
            log("Test Product Delete: FAILED", "error");
        }

        // Verify Delete
        const verifyDelete = await productService.get({ id: productId });
        if (!verifyDelete.success && verifyDelete.code === 404) {
            log("Verification of Product Delete: PASSED", "success");
        } else {
            log("Verification of Product Delete: FAILED", "error");
        }

        log("Product Service Verification Completed!", "success");
        process.exit(0);
    } catch (err) {
        log(`Product Verification Failed: ${err.message}`, "error");
        process.exit(1);
    }
};

runProductTest();
