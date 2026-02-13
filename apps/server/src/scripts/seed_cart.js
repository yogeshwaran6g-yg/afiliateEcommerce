import { transactionRunner } from '#config/db.js';
import { log } from '#utils/helper.js';

const seedCart = async (connection) => {
    log("Starting Cart Seeding...", "info");

    // 1. Categories
    const categories = [
        ['Electronics', 'electronics.jpg', null],
        ['Fashion', 'fashion.jpg', null],
        ['Home & Garden', 'home_garden.jpg', null]
    ];

    for (const [name, image, parentId] of categories) {
        await connection.execute(
            'INSERT INTO category (name, image, parent_id) VALUES (?, ?, ?)',
            [name, image, parentId]
        );
    }
    log("Seeded categories.", "success");

    // 2. Fetch Category IDs
    const [catRows] = await connection.execute('SELECT id, name FROM category');
    const catMap = catRows.reduce((acc, row) => ({ ...acc, [row.name]: row.id }), {});

    // 3. Products
    const products = [
        [
            'iPhone 15 Pro',
            'iphone-15-pro',
            'Latest Apple iPhone',
            'Powerful iPhone 15 Pro with Titanium design and A17 Pro chip.',
            catMap['Electronics'],
            99900.00,
            94900.00,
            50,
            'IN_STOCK',
            5,
            JSON.stringify(['iphone15.jpg']),
            100 // pv
        ],
        [
            'Samsung S24 Ultra',
            'samsung-s24-ultra',
            'Flagship Samsung Phone',
            'Galaxy S24 Ultra with AI features and 200MP camera.',
            catMap['Electronics'],
            124900.00,
            119900.00,
            30,
            'IN_STOCK',
            3,
            JSON.stringify(['s24ultra.jpg']),
            150 // pv
        ],
        [
            'Nike Air Max',
            'nike-air-max',
            'Comfortable running shoes',
            'Nike Air Max with superior cushioning for daily wear.',
            catMap['Fashion'],
            12000.00,
            8000.00,
            100,
            'IN_STOCK',
            10,
            JSON.stringify(['nikeair.jpg']),
            20 // pv
        ]
    ];

    for (const p of products) {
        await connection.execute(
            `INSERT INTO products (
                name, slug, short_desc, long_desc, category_id, 
                original_price, sale_price, stock, stock_status, 
                low_stock_alert, images, pv
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            p
        );
    }
    log("Seeded products.", "success");

    // 4. Carts and Cart Items for User 1
    // First ensure User 1 exists (Root User from main seed)
    const [userRows] = await connection.execute('SELECT id FROM users WHERE id = 1');
    if (userRows.length > 0) {
        const userId = 1;
        await connection.execute(
            'INSERT INTO carts (user_id, status) VALUES (?, ?)',
            [userId, 'active']
        );
        const [cartRows] = await connection.execute('SELECT id FROM carts WHERE user_id = ? AND status = ?', [userId, 'active']);
        const cartId = cartRows[0].id;

        const [productRows] = await connection.execute('SELECT id FROM products');
        if (productRows.length > 0) {
            await connection.execute(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                [cartId, productRows[0].id, 2]
            );
            await connection.execute(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                [cartId, productRows[1].id, 1]
            );
            log("Seeded cart and cart items for User 1.", "success");
        }
    }

    log("Cart Seeding Completed!", "success");
};

transactionRunner(seedCart)
    .then(() => process.exit(0))
    .catch((err) => {
        log(`Seeding Failed: ${err.message}`, "error");
        process.exit(1);
    });
