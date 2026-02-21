import pool from '../config/db.js';
import { getOrCreateActiveCart } from '../services/cartService.js';
import { log } from '../utils/helper.js';

async function verifyFix() {
    log("Starting verification of cart service fix...", "info");
    
    // Use a user ID that definitely doesn't exist
    const nonExistentUserId = 99999999;
    
    try {
        log(`Attempting to get/create cart for non-existent user ID: ${nonExistentUserId}`, "info");
        const cart = await getOrCreateActiveCart(nonExistentUserId);
        
        if (cart === null) {
            log("SUCCESS: getOrCreateActiveCart returned null for non-existent user as expected.", "info");
        } else {
            log("FAILURE: getOrCreateActiveCart returned something other than null for non-existent user.", "error");
        }
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.errno === 1452) {
            log("FAILURE: Foreign key constraint error still occurs!", "error");
        } else {
            log(`FAILURE: Unexpected error: ${error.message}`, "error");
        }
        process.exit(1);
    } finally {
        await pool.end();
    }
}

verifyFix();
