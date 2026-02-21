import pool, { queryRunner } from '../config/db.js';
import authController from '../controllers/authController.js';
import * as orderService from '../services/orderService.js';
import { log } from '../utils/helper.js';

async function testShippingAddress() {
    log("Starting test for shipping address in activation flow...", "info");

    // 1. Setup mock request
    const mockUser = { id: 1 }; // Assuming user with ID 1 exists and is verified
    const mockShippingAddress = {
        address: "123 Test St",
        city: "Test City",
        state: "Test State",
        pincode: "123456"
    };

    const req = {
        user: mockUser,
        body: {
            name: "Test User",
            email: "test@example.com",
            password: "password123",
            selectedProductId: 1, // Assuming product with ID 1 exists
            paymentMethod: 'MANUAL',
            paymentType: 'UPI',
            transactionReference: 'TXN123456',
            shippingAddress: mockShippingAddress
        },
        file: { filename: 'test-proof.png' }
    };

    const res = {
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        json: function(data) {
            this.data = data;
            return this;
        }
    };

    try {
        log("Calling completeRegistration...", "info");
        await authController.completeRegistration(req, res);

        if (res.statusCode === 201) {
            log("SUCCESS: completeRegistration returned 201", "info");
            const orderId = res.data.data.orderId;
            
            log(`Checking order ${orderId} in database...`, "info");
            const [orders] = await pool.query('SELECT shipping_address FROM orders WHERE id = ?', [orderId]);
            
            if (orders.length > 0) {
                const storedAddress = JSON.parse(orders[0].shipping_address);
                log(`Stored Address: ${JSON.stringify(storedAddress)}`, "info");
                
                if (storedAddress.address === mockShippingAddress.address && 
                    storedAddress.pincode === mockShippingAddress.pincode) {
                    log("SUCCESS: Shipping address correctly stored in database!", "info");
                } else {
                    log("FAILURE: Stored address does not match mock address", "error");
                }
            } else {
                log("FAILURE: Order not found in database", "error");
            }
        } else {
            log(`FAILURE: completeRegistration returned ${res.statusCode}: ${JSON.stringify(res.data)}`, "error");
        }
    } catch (error) {
        log(`FAILURE: Unexpected error: ${error.message}`, "error");
    } finally {
        await pool.end();
        process.exit(0);
    }
}

testShippingAddress();
