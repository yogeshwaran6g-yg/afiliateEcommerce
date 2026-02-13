import pool, { transactionRunner } from '../config/db.js';
import { log } from '../utils/helper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupDB = async (connection) => {
    log("Starting Consolidated Database Setup...", "info");

    // 1. Drop stored procedures (as requested)
    log("Dropping existing stored procedures...", "info");
    const dropProcs = [
        'DROP PROCEDURE IF EXISTS sp_add_referral',
        'DROP PROCEDURE IF EXISTS sp_distribute_commission'
    ];
    for (const dropSql of dropProcs) {
        await connection.query(dropSql);
    }
    log("Dropped existing stored procedures.", "success");

    // 2. Drop all tables
    log("Dropping existing tables...", "info");
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    const tables = [
        'notifications',
        'activation_payments_details',
        'cart_items',
        'carts',
        'addresses',
        'profiles',
        'otp',
        'referral_commission_distribution',
        'referral_tree',
        'referral_commission_config',
        'products',
        'category',
        'orders',
        'users'
    ];
    for (const table of tables) {
        await connection.query(`DROP TABLE IF EXISTS ${table}`);
    }
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    log("Dropped all existing tables.", "success");

    // 3. Create schema from db.sql
    log("Creating schema from db.sql...", "info");
    const dbSqlPath = path.resolve(__dirname, '../../db.sql');
    const dbSqlContent = fs.readFileSync(dbSqlPath, 'utf8');
    
    // Split by statement, but handle potential comments and whitespace
    const dbStatements = dbSqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    for (const stmt of dbStatements) {
        // Basic comment cleaning for multiline statements
        const cleanStmt = stmt.split('\n')
            .filter(line => !line.trim().startsWith('--'))
            .join('\n')
            .trim();
            
        if (cleanStmt) {
            try {
                await connection.query(cleanStmt);
            } catch (err) {
                log(`Error executing db.sql statement: ${err.message}`, "error");
                log(`Full statement: ${cleanStmt}`, "error");
                throw err;
            }
        }
    }
    log("Schema created successfully.", "success");

    // 4. Create stored procedures from storedProcedure.sql
    log("Creating stored procedures from storedProcedure.sql...", "info");
    const spSqlPath = path.resolve(__dirname, '../../storedProcedure.sql');
    const spSqlContent = fs.readFileSync(spSqlPath, 'utf8');

    // Stored procedures use DELIMITER //
    // We'll extract only the CREATE PROCEDURE blocks
    const spBlocks = spSqlContent.split('//').filter(block => block.trim().toLowerCase().includes('create procedure'));

    for (let block of spBlocks) {
        let cleanBlock = block.trim();
        // Remove DELIMITER keywords if they somehow got in
        cleanBlock = cleanBlock.replace(/DELIMITER\s+\/\//gi, '').replace(/DELIMITER\s+;/gi, '');
        
        if (cleanBlock) {
            try {
                await connection.query(cleanBlock);
                const procName = cleanBlock.match(/CREATE PROCEDURE\s+(\w+)/i)?.[1];
                log(`Procedure ${procName} created successfully.`, "success");
            } catch (err) {
                log(`Error creating stored procedure: ${err.message}`, "error");
                throw err;
            }
        }
    }
    log("Stored procedures created successfully.", "success");

    // 5. Seed initial data
    log("Seeding initial data...", "info");

    // 5.1 Referral configs
    const configs = [
        [1, 10.00], [2, 5.00], [3, 2.50], [4, 1.25], [5, 0.75], [6, 0.50]
    ];
    for (const [lvl, pct] of configs) {
        await connection.execute(
            'INSERT INTO referral_commission_config (level, percent) VALUES (?, ?)',
            [lvl, pct]
        );
    }
    log("Seeded referral commission levels.", "success");

    // 5.2 Categories
    const categories = [
        ['Electronics'], ['Fashion'], ['Home & Living'], ['Beauty'], ['Health'], ['Books'], ['Sports']
    ];
    const categoryMap = {};
    for (const [name] of categories) {
        const [result] = await connection.execute('INSERT INTO category (name) VALUES (?)', [name]);
        categoryMap[name] = result.insertId;
    }
    log("Seeded categories.", "success");

    // 5.3 Mock Products
    const mockProducts = [
        {
            name: 'Smartphone X1',
            slug: 'smartphone-x1',
            short_desc: 'Latest flagship smartphone with 108MP camera.',
            long_desc: 'Experience the power of Smartphone X1 with its advanced 108MP camera, 120Hz OLED display, and the fastest chip in a smartphone.',
            category_name: 'Electronics',
            original_price: 999.00,
            sale_price: 899.00,
            stock: 50,
            images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop']
        },
        {
            name: 'Wireless Earbuds Pro',
            slug: 'wireless-earbuds-pro',
            short_desc: 'Active noise cancelling wireless earbuds.',
            long_desc: 'Wireless Earbuds Pro feature active noise cancellation for immersive sound. Better transparency mode and comfort.',
            category_name: 'Electronics',
            original_price: 249.00,
            sale_price: 199.00,
            stock: 100,
            images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=500&auto=format&fit=crop']
        },
        {
            name: 'Classic Leather Jacket',
            slug: 'classic-leather-jacket',
            short_desc: 'Premium quality genuine leather jacket.',
            long_desc: 'This classic leather jacket is crafted from high-quality genuine leather. Timeless design.',
            category_name: 'Fashion',
            original_price: 199.00,
            sale_price: 149.00,
            stock: 30,
            images: ['https://images.unsplash.com/photo-1551028150-64b9f398f678?q=80&w=500&auto=format&fit=crop']
        }
    ];

    for (const prod of mockProducts) {
        await connection.execute(
            `INSERT INTO products (name, slug, short_desc, long_desc, category_id, original_price, sale_price, stock, images) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                prod.name, prod.slug, prod.short_desc, prod.long_desc, 
                categoryMap[prod.category_name], prod.original_price, prod.sale_price, 
                prod.stock, JSON.stringify(prod.images)
            ]
        );
    }
    log("Seeded mock products.", "success");

    // 5.4 Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    await connection.execute(
        'INSERT INTO users (name, phone, email, password, role, referral_id, is_active, is_phone_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ['Admin', '9000000000', 'admin@example.com', adminPassword, 'ADMIN', 'ADMINREF', true, true]
    );
    log("Seeded admin user (9000000000 / admin123).", "success");

    // 5.5 Sample Notifications
    const notifications = [
        ['Welcome to AffiliateEcom', 'Start your journey with us today.', 'We are happy to have you here. Explore our wide range of products!', null, '2026-12-31 23:59:59'],
        ['Big Sale!', 'Up to 50% off on all items.', 'Grab the best deals of the season. Limited time offer.', null, '2026-12-31 23:59:59']
    ];
    for (const [heading, sDesc, lDesc, img, endTime] of notifications) {
        await connection.execute(
            `INSERT INTO notifications (heading, short_description, long_description, image_url, advertisement_end_time) 
             VALUES (?, ?, ?, ?, ?)`,
            [heading, sDesc, lDesc, img, endTime]
        );
    }
    log("Seeded sample notifications.", "success");

    log("Database setup and seeding completed successfully!", "success");
};

// Run the script
transactionRunner(setupDB)
    .then(() => {
        log("Setup script finished.", "success");
        process.exit(0);
    })
    .catch((err) => {
        log(`Setup failed: ${err.message}`, "error");
        process.exit(1);
    });
