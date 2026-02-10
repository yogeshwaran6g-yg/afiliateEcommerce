import { queryRunner } from '#src/config/db.js';
import categoryService from '#src/services/categoryService.js';
import { log } from '#src/utils/helper.js';

const runTest = async () => {
    log("Starting Category Service Verification...", "info");

    try {
        // 1. Clean up and insert test data
        await queryRunner("DELETE FROM category");
        
        await queryRunner(`
            INSERT INTO category (id, name, image, parent_id) VALUES 
            (1, 'Electronics', 'elec.jpg', NULL),
            (2, 'Laptops', 'laptops.jpg', 1),
            (3, 'Smartphones', 'phones.jpg', 1),
            (4, 'Clothing', 'clothing.jpg', NULL)
        `);
        log("Inserted test categories.", "success");

        // 2. Test Get All
        const all = await categoryService.get();
        if (all.success && all.data.length === 4) {
            log("Test Get All: PASSED", "success");
        } else {
            log(`Test Get All: FAILED (Count: ${all.data?.length})`, "error");
        }

        // 3. Test Get by ID
        const byId = await categoryService.get({ id: 2 });
        if (byId.success && byId.data[0].name === 'Laptops') {
            log("Test Get by ID: PASSED", "success");
        } else {
            log(`Test Get by ID: FAILED (${byId.msg})`, "error");
        }

        // 4. Test Get by Name
        const byName = await categoryService.get({ name: 'phone' });
        if (byName.success && byName.data[0].name === 'Smartphones') {
            log("Test Get by Name: PASSED", "success");
        } else {
            log(`Test Get by Name: FAILED (${byName.msg})`, "error");
        }

        // 5. Test Get by Parent ID
        const byParent = await categoryService.get({ parent_id: 1 });
        if (byParent.success && byParent.data.length === 2) {
            log("Test Get by Parent ID: PASSED", "success");
        } else {
            log(`Test Get by Parent ID: FAILED (Count: ${byParent.data?.length})`, "error");
        }

        // 6. Test Not Found
        const notFound = await categoryService.get({ id: 999 });
        if (!notFound.success && notFound.code === 404) {
            log("Test Not Found: PASSED", "success");
        } else {
            log(`Test Not Found: FAILED (Code: ${notFound.code})`, "error");
        }

        log("Category Service Verification Completed!", "success");
        process.exit(0);
    } catch (err) {
        log(`Verification Failed: ${err.message}`, "error");
        process.exit(1);
    }
};

runTest();
