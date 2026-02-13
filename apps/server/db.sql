-- =============================================
-- Database Schema Extraction
-- Extracted from: apps/server/src/scripts/seed.js
-- =============================================

-- 1. Users Table
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(15) UNIQUE NOT NULL,
  `email` VARCHAR(255) NULL,
  `password` VARCHAR(255) NULL,
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `referral_id` VARCHAR(255) NOT NULL,
  `is_phone_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_blocked` BOOLEAN NOT NULL DEFAULT FALSE,
  --`activation_status` ENUM('NOT_STARTED', 'PAYMENT_PENDING', 'UNDER_REVIEW', 'ACTIVATED', 'REJECTED') DEFAULT 'NOT_STARTED',
  `account_activation_status` ENUM('PAYMENT_PENDING', 'UNDER_REVIEW', 'ACTIVATED', 'REJECTED') DEFAULT 'PAYMENT_PENDING',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- 1.2. Activation Payments Table
CREATE TABLE `activation_payments_details` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `payment_type` ENUM('UPI', 'BANK') NOT NULL,
  `proof_url` VARCHAR(255) NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
  `admin_comment` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_activation_payment_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 1.1. OTP Table
CREATE TABLE `otp` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `otp_hash` VARCHAR(255) NOT NULL,
  `purpose` ENUM('signup', 'login', 'forgot') NOT NULL DEFAULT 'login',
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_otp_user` (`user_id`),
  CONSTRAINT `fk_otp_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;


-- 2. Orders Table
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Referral Commission Config Table
CREATE TABLE `referral_commission_config` (
  `id` TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `level` TINYINT UNSIGNED NOT NULL,
  `percent` DECIMAL(5,2) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_level` (`level`),
  CONSTRAINT `chk_level_range` CHECK (`level` BETWEEN 1 AND 6),
  CONSTRAINT `chk_percent_range` CHECK (`percent` >= 0 AND `percent` <= 100)
) ENGINE=InnoDB;

-- 4. Referral Tree Table
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
  CONSTRAINT `fk_referral_upline` FOREIGN KEY (`upline_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_referral_downline` FOREIGN KEY (`downline_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_referral_level` CHECK (`level` BETWEEN 1 AND 6)
) ENGINE=InnoDB;

-- 5. Referral Commissions Distribution Table
CREATE TABLE `referral_commission_distribution` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `upline_id` BIGINT UNSIGNED NOT NULL,
  `downline_id` BIGINT UNSIGNED NOT NULL,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `payment_id` BIGINT UNSIGNED NULL,
  `level` TINYINT UNSIGNED NOT NULL,
  `percent` DECIMAL(5,2) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REVERSED') NOT NULL DEFAULT 'PENDING',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `approved_at` DATETIME NULL,
  
  UNIQUE KEY `uq_order_upline_level` (`order_id`, `upline_id`, `level`),
  KEY `idx_upline_status` (`upline_id`, `status`),
  KEY `idx_order` (`order_id`),
  KEY `idx_downline` (`downline_id`),
  CONSTRAINT `fk_comm_upline` FOREIGN KEY (`upline_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comm_downline` FOREIGN KEY (`downline_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comm_order` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_comm_level` CHECK (`level` BETWEEN 1 AND 6)
) ENGINE=InnoDB;

-- 6. Profiles Table
CREATE TABLE `profiles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `dob` DATE NULL,
  -- Identity Verification
  `id_type` VARCHAR(50) NULL,
  `id_number` VARCHAR(100) NULL,
  `id_document_url` TEXT NULL,
  `identity_status` ENUM('NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'NOT_SUBMITTED',
  -- Address Verification (Status related to address proof)
  `address_document_url` TEXT NULL,
  `address_status` ENUM('NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'NOT_SUBMITTED',
  -- Bank Details
  `bank_account_name` VARCHAR(255) NULL,
  `bank_name` VARCHAR(255) NULL,
  `bank_account_number` VARCHAR(100) NULL,
  `bank_ifsc` VARCHAR(20) NULL,
  `bank_document_url` TEXT NULL,
  `bank_status` ENUM('NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'NOT_SUBMITTED',
  -- Appearance
  `profile_image` MEDIUMTEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Addresses Table
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
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE category(
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `image` VARCHAR(255) NULL,
  `parent_id` BIGINT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE CASCADE
) ENGINE=InnoDB;



CREATE TABLE products (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `short_desc` VARCHAR(255) NOT NULL,
  `long_desc` TEXT NOT NULL,
  `category_id` BIGINT UNSIGNED NOT NULL,
  `original_price` DECIMAL(10,2) NOT NULL,
  `sale_price` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `stock_status` ENUM('IN_STOCK','OUT_OF_STOCK','BACKORDER') DEFAULT 'IN_STOCK',
  `low_stock_alert` INT DEFAULT 5,
  `images` JSON NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uk_products_slug UNIQUE (slug),
  CONSTRAINT chk_price_valid CHECK (
    original_price >= 0 AND
    sale_price >= 0 AND
    sale_price <= original_price
  ),

  CONSTRAINT fk_product_category
    FOREIGN KEY (category_id)
    REFERENCES category(id)
    ON DELETE RESTRICT,

  INDEX idx_category (category_id),
  INDEX idx_active (is_active),
  INDEX idx_price (sale_price)
) ENGINE=InnoDB;

-- 8. Carts Table
CREATE TABLE `carts` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('active', 'processed') NOT NULL DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_carts_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_status` (`user_id`, `status`)
) ENGINE=InnoDB;

-- 9. Cart Items Table
CREATE TABLE `cart_items` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `cart_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_items_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uq_cart_product` (`cart_id`, `product_id`)
) ENGINE=InnoDB;



