import pool, { queryRunner } from '../config/db.js';
import { log } from '../utils/helper.js';

const syncDB = async () => {
    try {
        log("Checking for missing columns in 'orders' table...", "info");
        
        // 1. Add order_type column to orders
        log("Adding 'order_type' to 'orders' table...", "info");
        try {
            await queryRunner(`
                ALTER TABLE orders 
                ADD COLUMN IF NOT EXISTS order_type ENUM('ACTIVATION', 'PRODUCT_PURCHASE') NOT NULL AFTER status
            `);
            log("'order_type' added or already exists.", "success");
        } catch (err) {
            log(`Error adding order_type: ${err.message}`, "error");
        }

        // 2. Add payment_method column to orders
        log("Adding 'payment_method' to 'orders' table...", "info");
        try {
            await queryRunner(`
                ALTER TABLE orders 
                ADD COLUMN IF NOT EXISTS payment_method ENUM('WALLET', 'MANUAL') NULL AFTER payment_status
            `);
            log("'payment_method' added or already exists.", "success");
        } catch (err) {
            log(`Error adding payment_method: ${err.message}`, "error");
        }

        // 3. Update payment_status enum
        log("Updating 'payment_status' enum in 'orders' table...", "info");
        try {
            await queryRunner(`
                ALTER TABLE orders 
                MODIFY COLUMN payment_status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PENDING'
            `);
            log("'payment_status' enum updated.", "success");
        } catch (err) {
            log(`Error updating payment_status enum: ${err.message}`, "error");
        }

        // 4. Create order_payments table
        log("Creating 'order_payments' table if not exists...", "info");
        try {
            await queryRunner(`
                CREATE TABLE IF NOT EXISTS order_payments (
                    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    order_id BIGINT UNSIGNED NOT NULL,
                    payment_type ENUM('UPI', 'BANK') NOT NULL,
                    transaction_reference VARCHAR(255) NULL,
                    proof_url VARCHAR(255) NOT NULL,
                    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
                    admin_comment TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    PRIMARY KEY (id),
                    KEY idx_op_order_id (order_id),
                    CONSTRAINT fk_op_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
                ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4
            `);
            log("'order_payments' table created or already exists.", "success");
        } catch (err) {
            log(`Error creating order_payments: ${err.message}`, "error");
        }

        // 5. Update wallet_transactions transaction_type enum
        log("Updating 'transaction_type' enum in 'wallet_transactions' table...", "info");
        try {
            await queryRunner(`
                ALTER TABLE wallet_transactions 
                MODIFY COLUMN transaction_type ENUM(
                    'RECHARGE_REQUEST',
                    'WITHDRAWAL_REQUEST',
                    'REFERRAL_COMMISSION',
                    'ACTIVATION_PURCHASE',
                    'PRODUCT_PURCHASE',
                    'ADMIN_ADJUSTMENT',
                    'REVERSAL'
                ) NOT NULL
            `);
            log("'transaction_type' enum updated.", "success");
        } catch (err) {
            log(`Error updating transaction_type enum: ${err.message}`, "error");
        }

        // 6. Update user's account_activation_status enum and remove selected_product_id
        log("Updating 'users' table schema...", "info");
        try {
            await queryRunner(`
                ALTER TABLE users 
                MODIFY COLUMN account_activation_status ENUM(
                    'NOT_STARTED',
                    'PENDING_PAYMENT',
                    'UNDER_REVIEW',
                    'ACTIVATED',
                    'REJECTED'
                ) DEFAULT 'NOT_STARTED'
            `);
            log("'account_activation_status' enum updated.", "success");
            
            // Try to drop selected_product_id (only if it exists)
            try {
                await queryRunner(`ALTER TABLE users DROP FOREIGN KEY fk_users_selected_product`);
                await queryRunner(`ALTER TABLE users DROP COLUMN selected_product_id`);
                log("'selected_product_id' column removed.", "success");
            } catch (e) {
                log("'selected_product_id' already removed or mismatch.", "info");
            }

        } catch (err) {
            log(`Error updating users table: ${err.message}`, "error");
        }

        log("Database synchronization completed successfully!", "success");

    } catch (error) {
        log(`Synchronization failed: ${error.message}`, "error");
    } finally {
        process.exit(0);
    }
};

syncDB();
