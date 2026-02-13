
DELIMITER //

-- Procedure: sp_add_referral
-- Adds a user to the referral tree
CREATE PROCEDURE sp_add_referral(
    IN p_referrer_id BIGINT UNSIGNED,
    IN p_new_user_id BIGINT UNSIGNED
)
BEGIN
    START TRANSACTION;
    
    -- Level 1
    INSERT IGNORE INTO referral_tree (upline_id, downline_id, level)
    VALUES (p_referrer_id, p_new_user_id, 1);
    
    -- Levels 2-6
    INSERT IGNORE INTO referral_tree (upline_id, downline_id, level)
    SELECT 
        rt.upline_id,
        p_new_user_id,
        rt.level + 1
    FROM referral_tree rt
    WHERE rt.downline_id = p_referrer_id
      AND rt.level < 6;
    
    COMMIT;
END //



-- Procedure: sp_distribute_commission
-- Calculates and inserts commissions for an order
CREATE PROCEDURE sp_distribute_commission(
    IN p_order_id BIGINT UNSIGNED,
    IN p_payment_id BIGINT UNSIGNED,
    IN p_user_id BIGINT UNSIGNED,
    IN p_amount DECIMAL(10,2)
)
BEGIN
    START TRANSACTION;

    INSERT IGNORE INTO referral_commission_distribution
    (upline_id, downline_id, order_id, payment_id, level, percent, amount, status)
    SELECT 
        rt.upline_id,
        p_user_id,
        p_order_id,
        p_payment_id,
        rt.level,
        rcc.percent,
        ROUND(p_amount * rcc.percent / 100, 2),
        'PENDING'
    FROM referral_tree rt
    JOIN referral_commission_config rcc 
        ON rt.level = rcc.level
    JOIN users u_upline
        ON rt.upline_id = u_upline.id
    WHERE rt.downline_id = p_user_id
      AND rcc.is_active = 1
      AND u_upline.is_phone_verified = TRUE
      AND u_upline.is_blocked = FALSE
      AND u_upline.account_activation_status = 'ACTIVATED';

    COMMIT;
END //

DELIMITER ;

