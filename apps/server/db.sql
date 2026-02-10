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
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `is_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 1.1. OTP Table
CREATE TABLE `otp` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `otp_hash` VARCHAR(255) NOT NULL,
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
  `kyc_pan` VARCHAR(20),
  `kyc_aadhar` VARCHAR(20),
  `profile_image` VARCHAR(255),
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

-- =============================================
-- Stored Procedures
-- Extracted from: apps/server/src/scripts/create_procedures.js
-- =============================================

DELIMITER //

-- Procedure: sp_add_referral
-- Adds a user to the referral tree
CREATE PROCEDURE `sp_add_referral`(
    IN p_referrer_id BIGINT UNSIGNED,
    IN p_new_user_id BIGINT UNSIGNED
)
BEGIN
    -- Level 1
    INSERT IGNORE INTO `referral_tree` (`upline_id`, `downline_id`, `level`)
    VALUES (p_referrer_id, p_new_user_id, 1);
    
    -- Levels 2-6
    INSERT IGNORE INTO `referral_tree` (`upline_id`, `downline_id`, `level`)
    SELECT 
        rt.`upline_id`,
        p_new_user_id,
        rt.`level` + 1
    FROM `referral_tree` rt
    WHERE rt.`downline_id` = p_referrer_id
      AND rt.`level` < 6;
END //

-- Procedure: sp_distribute_commission
-- Calculates and inserts commissions for an order
CREATE PROCEDURE `sp_distribute_commission`(
    IN p_order_id BIGINT UNSIGNED,
    IN p_payment_id BIGINT UNSIGNED,
    IN p_user_id BIGINT UNSIGNED,
    IN p_amount DECIMAL(10,2)
)
BEGIN
    INSERT IGNORE INTO `referral_commission_distribution`
    (`upline_id`, `downline_id`, `order_id`, `payment_id`, `level`, `percent`, `amount`, `status`)
    SELECT 
        rt.`upline_id`,
        p_user_id,
        p_order_id,
        p_payment_id,
        rt.`level`,
        rcc.`percent`,
        ROUND(p_amount * rcc.`percent` / 100, 2),
        'PENDING'
    FROM `referral_tree` rt
    JOIN `referral_commission_config` rcc 
        ON rt.`level` = rcc.`level`
    WHERE rt.`downline_id` = p_user_id
      AND rcc.`is_active` = 1;
END //

DELIMITER ;

