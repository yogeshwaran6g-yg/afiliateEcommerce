import pool from './src/config/db.js';

const run = async () => {
    try {
        const [rows] = await pool.query("DESCRIBE users");
        console.log("Users table structure:", rows);
        
        const [payments] = await pool.query("SHOW TABLES LIKE 'activation_payments'");
        console.log("Activation payments table exists:", payments.length > 0);
        
        process.exit(0);
    } catch (error) {
        console.error("Error checking table structure:", error);
        process.exit(1);
    }
};

run();
