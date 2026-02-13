import pool from './src/config/db.js';

const run = async () => {
    try {
        console.log("Applying database changes...");
        const alterQueries = [
            "ALTER TABLE users ADD COLUMN is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE",
            "ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT FALSE",
            "ALTER TABLE users ADD COLUMN is_blocked BOOLEAN NOT NULL DEFAULT FALSE",
            "ALTER TABLE users ADD COLUMN activation_status ENUM('NOT_STARTED', 'PAYMENT_PENDING', 'UNDER_REVIEW', 'ACTIVATED', 'REJECTED') DEFAULT 'NOT_STARTED' AFTER is_phone_verified"
        ];

        for (const query of alterQueries) {
            try {
                await pool.query(query);
                console.log(`Executed: ${query}`);
            } catch (err) {
                if (err.code === 'ER_DUP_COLUMN_NAME') {
                    console.log(`Column already exists: ${query.split(' ')[4]}`);
                } else {
                    console.error(`Error executing ${query}: ${err.message}`);
                }
            }
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS activation_payments (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT UNSIGNED NOT NULL,
                payment_type ENUM('UPI', 'BANK') NOT NULL,
                proof_url VARCHAR(255) NOT NULL,
                status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
                admin_comment TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_activation_payment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `);
        console.log("Database changes applied successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error applying database changes:", error);
        process.exit(1);
    }
};

run();
