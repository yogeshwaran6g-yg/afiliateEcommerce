import pool, { transactionRunner } from "../config/db.js";
import { log } from "../utils/helper.js";

const seedOrders = async (connection) => {
    log("Starting Dummy Orders Seeding...", "info");

    // 1. Get Admin User ID
    const [users] = await connection.query("SELECT id FROM users WHERE phone = '9000000000' LIMIT 1");
    if (users.length === 0) {
        throw new Error("Admin user not found. Please run setup-db.js first.");
    }
    const userId = users[0].id;

    // 2. Get some products
    const [products] = await connection.query("SELECT id, sale_price FROM products LIMIT 5");
    if (products.length === 0) {
        throw new Error("No products found to seed orders.");
    }

    const statuses = ['PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    const paymentStatuses = ['PENDING', 'PAID', 'FAILED'];
    const addresses = [
        { street: "123 Maple Ave", city: "Springfield", state: "IL", pincode: "62704" },
        { street: "456 Oak Dr", city: "Riverside", state: "CA", pincode: "92501" },
        { street: "789 Pine Ln", city: "Lakewood", state: "NJ", pincode: "08701" }
    ];

    log("Seeding 10 orders...", "info");

    for (let i = 1; i <= 10; i++) {
        const orderNumber = `ORD-SEED-${Date.now()}-${i}`;
        const status = statuses[i % statuses.length];
        const paymentStatus = paymentStatuses[i % paymentStatuses.length];
        const address = addresses[i % addresses.length];
        const totalAmount = (Math.random() * 500 + 50).toFixed(2);

        // Insert Order
        const [orderResult] = await connection.query(
            `INSERT INTO orders (order_number, user_id, total_amount, status, payment_status, shipping_address) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [orderNumber, userId, totalAmount, status, paymentStatus, JSON.stringify(address)]
        );

        const orderId = orderResult.insertId;

        // Insert random items for each order
        const numItems = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numItems; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 2) + 1;
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
                [orderId, product.id, quantity, product.sale_price]
            );
        }

        // Insert Tracking based on status
        const trackingSteps = [];
        trackingSteps.push(["Order Placed", "Your order has been received.", "2026-02-14 10:00:00"]);

        if (status !== 'CANCELLED') {
            if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status)) {
                trackingSteps.push(["Shipped", "Your package is on its way.", "2026-02-14 14:00:00"]);
            }
            if (status === 'OUT_FOR_DELIVERY' || status === 'DELIVERED') {
                trackingSteps.push(["Out for Delivery", "Driver is in your area.", "2026-02-15 09:00:00"]);
            }
            if (status === 'DELIVERED') {
                trackingSteps.push(["Delivered", "Package dropped at front door.", "2026-02-15 11:00:00"]);
            }
        } else {
            trackingSteps.push(["Cancelled", "Order was cancelled by the user.", "2026-02-14 11:30:00"]);
        }

        for (const [title, desc, time] of trackingSteps) {
            await connection.query(
                `INSERT INTO order_tracking (order_id, title, description, status_time) VALUES (?, ?, ?, ?)`,
                [orderId, title, desc, time]
            );
        }
    }

    log("Successfully seeded 10 dummy orders.", "success");
};

// Run the script
transactionRunner(seedOrders)
    .then(() => {
        log("Seeding script finished.", "success");
        process.exit(0);
    })
    .catch((err) => {
        log(`Seeding failed: ${err.message}`, "error");
        process.exit(1);
    });
