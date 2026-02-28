-- =============================================
-- Database Schema Extraction
-- Extracted from: apps/server/src/scripts/seed.js
-- =============================================

-- 1. Category Table
CREATE TABLE `category` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NULL,
    `parent_id` BIGINT UNSIGNED DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_category_parent` FOREIGN KEY (`parent_id`) REFERENCES `category` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 2. Products Table
CREATE TABLE `products` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `short_desc` VARCHAR(255) NOT NULL,
    `long_desc` TEXT NOT NULL,
    `category_id` BIGINT UNSIGNED NOT NULL,
    `original_price` DECIMAL(10, 2) NOT NULL,
    `sale_price` DECIMAL(10, 2) NOT NULL,
    `stock` INT NOT NULL DEFAULT 0,
    `stock_status` ENUM(
        'IN_STOCK',
        'OUT_OF_STOCK',
        'BACKORDER'
    ) DEFAULT 'IN_STOCK',
    `low_stock_alert` INT DEFAULT 5,
    `images` JSON NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `uk_products_slug` UNIQUE (`slug`),
    CONSTRAINT `chk_price_valid` CHECK (
        `original_price` >= 0
        AND `sale_price` >= 0
        AND `sale_price` <= `original_price`
    ),
    CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT,
    INDEX `idx_category` (`category_id`),
    INDEX `idx_active` (`is_active`),
    INDEX `idx_price` (`sale_price`)
) ENGINE = InnoDB;

-- 3. Users Table
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(15) UNIQUE NOT NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `referral_id` VARCHAR(255) NOT NULL,
    `is_phone_verified` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_active` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_blocked` BOOLEAN NOT NULL DEFAULT FALSE,
    `account_activation_status` ENUM(
        'NOT_STARTED',
        'PENDING_PAYMENT',
        'UNDER_REVIEW',
        'ACTIVATED',
        'REJECTED'
    ) DEFAULT 'NOT_STARTED',
    `referred_by` BIGINT UNSIGNED NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_referrer` FOREIGN KEY (`referred_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_users_created` (`created_at`)
) ENGINE = InnoDB;

-- Activation Payments table removed in favor of unified order flow

-- 5. OTP Table
CREATE TABLE `otp` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `otp_hash` VARCHAR(255) NOT NULL,
    `purpose` ENUM('signup', 'login', 'forgot') NOT NULL DEFAULT 'login',
    `expires_at` DATETIME NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_otp_user` (`user_id`),
    CONSTRAINT `fk_otp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 6. Orders Table
CREATE TABLE orders (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_number` VARCHAR(50) NOT NULL UNIQUE,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `shipping_cost` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `status` ENUM(
        'PROCESSING',
        'SHIPPED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PROCESSING',
    `order_type` ENUM(
        'ACTIVATION',
        'PRODUCT_PURCHASE'
    ) NOT NULL,
    `payment_status` ENUM(
        'PENDING',
        'PAID',
        'FAILED',
        'REFUNDED'
    ) DEFAULT 'PENDING',
    `payment_method` ENUM('WALLET', 'MANUAL') NULL,
    `shipping_address` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_orders_user_id (user_id),
    KEY idx_orders_user_created (user_id, created_at),
    KEY idx_orders_user_status (user_id, status),
    KEY idx_orders_status (status),
    KEY idx_orders_stats (
        user_id,
        payment_status,
        created_at
    ),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 6b. Order Payments Table (Manual verification)
CREATE TABLE order_payments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    payment_type ENUM('UPI', 'BANK') NOT NULL,
    transaction_reference VARCHAR(255) NULL,
    proof_url VARCHAR(255) NOT NULL,
    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED'
    ) DEFAULT 'PENDING',
    admin_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_op_order_id (order_id),
    CONSTRAINT fk_op_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE order_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_order_items_order_id (order_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
);

CREATE TABLE order_tracking (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_tracking_order_id (order_id),
    CONSTRAINT fk_tracking_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
);

-- 7. Referral Commission Config Table
CREATE TABLE `referral_commission_config` (
    `id` TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `level` TINYINT UNSIGNED NOT NULL,
    `percent` DECIMAL(5, 2) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_level` (`level`),
    CONSTRAINT `chk_level_range` CHECK (`level` BETWEEN 1 AND 6),
    CONSTRAINT `chk_percent_range` CHECK (
        `percent` >= 0
        AND `percent` <= 100
    )
) ENGINE = InnoDB;

-- 8. Referral Tree Table
CREATE TABLE `referral_tree` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `upline_id` BIGINT UNSIGNED NOT NULL,
    `downline_id` BIGINT UNSIGNED NOT NULL,
    `level` TINYINT UNSIGNED NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_upline_downline` (`upline_id`, `downline_id`),
    KEY `idx_downline_level` (`downline_id`, `level`),
    KEY `idx_referral_upline_level` (`upline_id`, `level`),
    KEY `idx_downline` (`downline_id`),
    KEY `idx_referral_upline` (`upline_id`),
    CONSTRAINT `fk_referral_upline` FOREIGN KEY (`upline_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_referral_downline` FOREIGN KEY (`downline_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_referral_level` CHECK (`level` BETWEEN 1 AND 6)
) ENGINE = InnoDB;

-- 9. Referral Commissions Distribution Table
CREATE TABLE `referral_commission_distribution` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `upline_id` BIGINT UNSIGNED NOT NULL,
    `downline_id` BIGINT UNSIGNED NOT NULL,
    `order_id` BIGINT UNSIGNED NOT NULL,
    `payment_id` BIGINT UNSIGNED NULL,
    `level` TINYINT UNSIGNED NOT NULL,
    `percent` DECIMAL(5, 2) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `status` ENUM(
        'PENDING',
        'APPROVED',
        'REVERSED'
    ) NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `approved_at` DATETIME NULL,
    UNIQUE KEY `uq_order_upline_level` (
        `order_id`,
        `upline_id`,
        `level`
    ),
    KEY `idx_upline_status` (`upline_id`, `status`),
    KEY `idx_order` (`order_id`),
    KEY `idx_downline` (`downline_id`),
    CONSTRAINT `fk_comm_upline` FOREIGN KEY (`upline_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_comm_downline` FOREIGN KEY (`downline_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_comm_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_comm_level` CHECK (`level` BETWEEN 1 AND 6)
) ENGINE = InnoDB;

-- 10. Profiles Table
CREATE TABLE `profiles` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `dob` DATE NULL,
    -- Identity Verification
    `id_type` VARCHAR(50) NULL,
    `id_number` VARCHAR(100) NULL,
    `id_document_url` TEXT NULL,
    `identity_status` ENUM(
        'NOT_SUBMITTED',
        'PENDING',
        'VERIFIED',
        'REJECTED'
    ) DEFAULT 'NOT_SUBMITTED',
    -- Address Verification (Status related to address proof)
    `address_document_url` TEXT NULL,
    `address_status` ENUM(
        'NOT_SUBMITTED',
        'PENDING',
        'VERIFIED',
        'REJECTED'
    ) DEFAULT 'NOT_SUBMITTED',
    -- Bank Details
    `bank_account_name` VARCHAR(255) NULL,
    `bank_name` VARCHAR(255) NULL,
    `bank_account_number` VARCHAR(100) NULL,
    `bank_ifsc` VARCHAR(20) NULL,
    `bank_document_url` TEXT NULL,
    `bank_status` ENUM(
        'NOT_SUBMITTED',
        'PENDING',
        'VERIFIED',
        'REJECTED'
    ) DEFAULT 'NOT_SUBMITTED',
    -- Appearance
    `profile_image` MEDIUMTEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 11. Addresses Table
CREATE TABLE `addresses` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `address_line1` VARCHAR(255) NOT NULL,
    `address_line2` VARCHAR(255),
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `pincode` VARCHAR(20) NOT NULL,
    `is_default` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 12. Carts Table
CREATE TABLE `carts` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `status` ENUM('active', 'processed') NOT NULL DEFAULT 'active',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_carts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_user_status` (`user_id`, `status`)
) ENGINE = InnoDB;

-- 13. Cart Items Table
CREATE TABLE `cart_items` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `cart_id` BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_cart_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uq_cart_product` (`cart_id`, `product_id`)
) ENGINE = InnoDB;

-- 14. Notifications Table
CREATE TABLE `notifications` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `heading` VARCHAR(255) NOT NULL,
    `short_description` VARCHAR(255) NOT NULL,
    `long_description` TEXT NOT NULL,
    `image_url` VARCHAR(255) NULL,
    `advertisement_end_time` DATETIME NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- 15. User Notifications Table
CREATE TABLE `user_notifications` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `type` ENUM(
        'ORDER',
        'PAYMENT',
        'WALLET',
        'ACCOUNT',
        'OTHER'
    ) NOT NULL,
    `description` TEXT NULL,
    `is_read` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_type` (`type`),
    CONSTRAINT `fk_user_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 16. Wallets Table
CREATE TABLE `wallets` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `balance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `locked_balance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `version` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_wallet_user` (`user_id`),
    INDEX `idx_wallet_user` (`user_id`),
    CONSTRAINT `fk_wallet_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 17. Wallet Transactions Table
CREATE TABLE `wallet_transactions` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `wallet_id` BIGINT UNSIGNED NOT NULL,
    `entry_type` ENUM('CREDIT', 'DEBIT') NOT NULL,
    `transaction_type` ENUM(
        'RECHARGE_REQUEST',
        'WITHDRAWAL_REQUEST',
        'REFERRAL_COMMISSION',
        'ACTIVATION_PURCHASE',
        'PRODUCT_PURCHASE',
        'ADMIN_ADJUSTMENT',
        'REVERSAL'
    ) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL CHECK (`amount` > 0),
    `balance_after` DECIMAL(10, 2) NOT NULL,
    `balance_before` DECIMAL(10, 2) NOT NULL,
    `locked_after` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `locked_before` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `reference_table` VARCHAR(50) NULL,
    `reference_id` BIGINT UNSIGNED NULL,
    `reversal_of` BIGINT UNSIGNED NULL,
    `status` ENUM(
        'SUCCESS',
        'PENDING',
        'FAILED',
        'REVERSED'
    ) NOT NULL DEFAULT 'SUCCESS',
    `description` VARCHAR(500) NULL,
    `metadata` JSON NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_wallet` (`wallet_id`),
    INDEX `idx_reference_pair` (
        `reference_table`,
        `reference_id`
    ),
    INDEX `idx_reversal_of` (`reversal_of`),
    INDEX `idx_wallet_stats` (
        `wallet_id`,
        `transaction_type`,
        `status`,
        `created_at`
    ),
    CONSTRAINT `fk_transaction_wallet` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_reversal` FOREIGN KEY (`reversal_of`) REFERENCES `wallet_transactions` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB;

-- 18. Withdrawal Requests Table
CREATE TABLE `withdrawal_requests` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `platform_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `net_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `status` ENUM(
        'REVIEW_PENDING',
        'APPROVED',
        'REJECTED'
    ) DEFAULT 'REVIEW_PENDING',
    `bank_details` JSON NULL,
    `admin_comment` TEXT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_withdrawal_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 19. Recharge Requests Table
CREATE TABLE `recharge_requests` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_reference` VARCHAR(100) NULL,
    `proof_image` VARCHAR(255) NOT NULL,
    `status` ENUM(
        'REVIEW_PENDING',
        'APPROVED',
        'REJECTED'
    ) DEFAULT 'REVIEW_PENDING',
    `admin_comment` TEXT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_recharge_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 20. Tickets Table
CREATE TABLE `tickets` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `category` ENUM(
        'ORDER',
        'PAYMENT',
        'WALLET',
        'ACCOUNT',
        'OTHER'
    ) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `image` VARCHAR(255) NULL,
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'LOW',
    `status` ENUM(
        'OPEN',
        'IN_REVIEW',
        'COMPLETED',
        'CLOSED'
    ) NOT NULL DEFAULT 'OPEN',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_tickets_user_id` (`user_id`),
    KEY `idx_tickets_status` (`status`),
    CONSTRAINT `fk_tickets_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 21. Settings Table
CREATE TABLE `settings` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(255) UNIQUE NOT NULL,
    `value` TEXT NOT NULL,
    `description` VARCHAR(500) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- transaction_type ENUM(
--     'ACTIVATION_PURCHASE',
--     'PRODUCT_PURCHASE',
--     'REFERRAL_COMMISSION',
--     'WITHDRAWAL_REQUEST',
--     'RECHARGE_REQUEST',
--     'ADMIN_ADJUSTMENT',
--     'REVERSAL'
-- )

-- 22. Popup Banners Table
CREATE TABLE `popup_banners` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `logo` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,
    `short_description` VARCHAR(255) NULL,
    `long_description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;