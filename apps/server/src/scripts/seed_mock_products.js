import pool from '../config/db.js';
import { log } from '../utils/helper.js';

const mockCategories = [
    { name: 'Electronics', parent_id: null },
    { name: 'Fashion', parent_id: null },
    { name: 'Home & Living', parent_id: null },
    { name: 'Beauty', parent_id: null },
    { name: 'Health', parent_id: null },
    { name: 'Books', parent_id: null },
    { name: 'Sports', parent_id: null }
];

const mockProducts = [
    {
        name: 'Smartphone X1',
        slug: 'smartphone-x1',
        short_desc: 'Latest flagship smartphone with 108MP camera.',
        long_desc: 'Experience the power of Smartphone X1 with its advanced 108MP camera, 120Hz OLED display, and the fastest chip in a smartphone. Perfect for photography enthusiasts and gamers alike.',
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
        long_desc: 'Wireless Earbuds Pro feature active noise cancellation for immersive sound. Transparency mode for hearing what’s happening around you. A customizable fit for all-day comfort.',
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
        long_desc: 'This classic leather jacket is crafted from high-quality genuine leather. It features a timeless design that never goes out of style. Durable, comfortable, and stylish.',
        category_name: 'Fashion',
        original_price: 199.00,
        sale_price: 149.00,
        stock: 30,
        images: ['https://images.unsplash.com/photo-1551028150-64b9f398f678?q=80&w=500&auto=format&fit=crop']
    },
    {
        name: 'Running Shoes 5.0',
        slug: 'running-shoes-5-0',
        short_desc: 'Lightweight and breathable running shoes.',
        long_desc: 'Lightweight running shoes designed for ultimate comfort and performance. Featuring a breathable mesh upper and a responsive cushioned midsole.',
        category_name: 'Fashion',
        original_price: 120.00,
        sale_price: 89.00,
        stock: 75,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop']
    },
    {
        name: 'Smart Coffee Maker',
        slug: 'smart-coffee-maker',
        short_desc: 'App-controlled coffee maker with built-in grinder.',
        long_desc: 'Start your mornings with the Smart Coffee Maker. Grind your beans and brew your coffee exactly how you like it, all from your smartphone.',
        category_name: 'Home & Living',
        original_price: 299.00,
        sale_price: 249.00,
        stock: 20,
        images: ['https://images.unsplash.com/photo-1520970014086-2208d157c9e2?q=80&w=500&auto=format&fit=crop']
    },
    {
        name: 'Ergonomic Office Chair',
        slug: 'ergonomic-office-chair',
        short_desc: 'High-back ergonomic chair with lumbar support.',
        long_desc: 'Work in comfort with our Ergonomic Office Chair. Featuring adjustable height, lumbar support, and breathable mesh back for a better working experience.',
        category_name: 'Home & Living',
        original_price: 350.00,
        sale_price: 299.00,
        stock: 15,
        images: ['https://images.unsplash.com/photo-1505797149-43b00766ea16?q=80&w=500&auto=format&fit=crop']
    },
    {
        name: 'Anti-Aging Facial Cream',
        slug: 'anti-aging-facial-cream',
        short_desc: 'Hydrating facial cream for youthful skin.',
        long_desc: 'Our Anti-Aging Facial Cream is enriched with vitamins and minerals to help reduce the appearance of fine lines and wrinkles, leaving your skin feeling soft and rejuvenated.',
        category_name: 'Beauty',
        original_price: 55.00,
        sale_price: 45.00,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop']
    },
    {
        name: 'Matte Lipstick Set',
        slug: 'matte-lipstick-set',
        short_desc: 'Set of 6 vibrant matte lipsticks.',
        long_desc: 'A collection of 6 long-lasting matte lipsticks in essential shades. Smooth application with a non-drying formula that stays on all day.',
        category_name: 'Beauty',
        original_price: 40.00,
        sale_price: 32.00,
        stock: 150,
        images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=500&auto=format&fit=crop']
    },
    {
        name: 'Yoga Mat Premium',
        slug: 'yoga-mat-premium',
        short_desc: 'Eco-friendly non-slip yoga mat.',
        long_desc: 'Experience superior grip and cushioning with our Premium Yoga Mat. Made from eco-friendly materials, it provides the perfect surface for your daily practice.',
        category_name: 'Sports',
        original_price: 60.00,
        sale_price: 49.00,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1518611012118-296048d08658?q=80&w=500&auto=format&fit=crop']
    }
];

const seedMockData = async () => {
    try {
        log("Starting mock data seeding...", "info");

        // Disable foreign key checks for easy cleanup
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        await pool.query('DELETE FROM products');
        await pool.query('DELETE FROM category');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        log("Cleaned existing products and categories.", "info");

        const categoryMap = {};

        // 1. Seed Categories
        for (const cat of mockCategories) {
            const [result] = await pool.query(
                'INSERT INTO category (name, parent_id) VALUES (?, ?)',
                [cat.name, cat.parent_id]
            );
            categoryMap[cat.name] = result.insertId;
        }
        log(`Seeded ${mockCategories.length} categories.`, "success");

        // 2. Seed Products
        for (const prod of mockProducts) {
            const catId = categoryMap[prod.category_name];
            await pool.query(
                `INSERT INTO products (
                    name, slug, short_desc, long_desc, category_id, 
                    original_price, sale_price, stock, images
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    prod.name, 
                    prod.slug, 
                    prod.short_desc, 
                    prod.long_desc, 
                    catId, 
                    prod.original_price, 
                    prod.sale_price, 
                    prod.stock, 
                    JSON.stringify(prod.images)
                ]
            );
        }
        log(`Seeded ${mockProducts.length} products.`, "success");

        log("Mock data seeding completed successfully!", "success");
        process.exit(0);
    } catch (error) {
        log(`Seeding failed: ${error.message}`, "error");
        process.exit(1);
    }
};

seedMockData();
