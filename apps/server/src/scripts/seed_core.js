import { log } from "../utils/helper.js";

export const seedCore = async (connection) => {
  log("Seeding core system data (configs, categories, products)...", "info");

  // 1. Referral configs
  const configs = [
    [1, 10.0],
    [2, 5.0],
    [3, 2.5],
    [4, 1.25],
    [5, 0.75],
    [6, 0.5],
  ];
  for (const [lvl, pct] of configs) {
    await connection.execute(
      "INSERT INTO referral_commission_config (level, percent) VALUES (?, ?)",
      [lvl, pct],
    );
  }
  log("Seeded referral commission levels.", "success");

  // 2. Categories
  const categories = [
    ["Electronics"],
    ["Fashion"],
    ["Home & Living"],
    ["Beauty"],
    ["Health"],
    ["Books"],
    ["Sports"],
    ["Home Appliances"],
    ["Toys"],
    ["Furniture"],
  ];
  const categoryMap = {};
  for (const [name] of categories) {
    const [result] = await connection.execute(
      "INSERT INTO category (name) VALUES (?)",
      [name],
    );
    categoryMap[name] = result.insertId;
  }
  log("Seeded categories.", "success");

  // 3. Mock Products
  const mockProducts = [
    {
      name: "Smartphone X1",
      slug: "smartphone-x1",
      short_desc: "Latest flagship smartphone with 108MP camera.",
      long_desc:
        "Experience the power of Smartphone X1 with its advanced 108MP camera, 120Hz OLED display, and the fastest chip in a smartphone.",
      category_name: "Electronics",
      original_price: 999.0,
      sale_price: 899.0,
      stock: 50,
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      name: "Wireless Earbuds Pro",
      slug: "wireless-earbuds-pro",
      short_desc: "Active noise cancelling wireless earbuds.",
      long_desc:
        "Wireless Earbuds Pro feature active noise cancellation for immersive sound. Better transparency mode and comfort.",
      category_name: "Electronics",
      original_price: 249.0,
      sale_price: 199.0,
      stock: 100,
      images: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      name: "Classic Leather Jacket",
      slug: "classic-leather-jacket",
      short_desc: "Premium quality genuine leather jacket.",
      long_desc:
        "This classic leather jacket is crafted from high-quality genuine leather. Timeless design.",
      category_name: "Fashion",
      original_price: 199.0,
      sale_price: 149.0,
      stock: 30,
      images: [
        "https://images.unsplash.com/photo-1551028150-64b9f398f678?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      name: "Ergonomic Office Chair",
      slug: "ergonomic-office-chair",
      short_desc: "High-back mesh chair with lumbar support.",
      long_desc:
        "Stay comfortable with this ergonomic office chair featuring a high-back mesh design, adjustable lumbar support, and smooth-rolling casters.",
      category_name: "Furniture",
      original_price: 349.0,
      sale_price: 289.0,
      stock: 25,
      images: [
        "https://images.unsplash.com/photo-1505843490701-515a007bc463?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      name: "Modern Coffee Table",
      slug: "modern-coffee-table",
      short_desc: "Minimalist oak wood coffee table.",
      long_desc:
        "Add a touch of elegance to your living room with this minimalist oak wood coffee table. Sturdy and stylish.",
      category_name: "Furniture",
      original_price: 159.0,
      sale_price: 129.0,
      stock: 15,
      images: [
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      name: "Building Blocks Set",
      slug: "building-blocks-set",
      short_desc: "Creative building blocks for kids.",
      long_desc:
        "Inspire creativity with this 500-piece building blocks set. Safe, durable, and fun for children of all ages.",
      category_name: "Toys",
      original_price: 49.0,
      sale_price: 39.0,
      stock: 200,
      images: [
        "https://images.unsplash.com/photo-1587654711722-5420578a8bc7?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      name: "Robotic Vacuum Cleaner",
      slug: "robotic-vacuum-cleaner",
      short_desc: "Smart vacuum for effortless cleaning.",
      long_desc:
        "This smart robotic vacuum cleaner features advanced mapping technology and powerful suction for a spotless home.",
      category_name: "Home Appliances",
      original_price: 499.0,
      sale_price: 399.0,
      stock: 40,
      images: [
        "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      name: "Air Purifier Pro",
      slug: "air-purifier-pro",
      short_desc: "HEPA air purifier for clean indoor air.",
      long_desc:
        "Breathe easier with the Air Purifier Pro. Features a 3-stage filtration system including a HEPA filter to remove 99.97% of airborne particles.",
      category_name: "Home Appliances",
      original_price: 179.0,
      sale_price: 149.0,
      stock: 60,
      images: [
        "https://images.unsplash.com/photo-1585776245991-cf89dd7fc5c2?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      name: "Yoga Mat Non-Slip",
      slug: "yoga-mat-non-slip",
      short_desc: "Premium eco-friendly yoga mat.",
      long_desc:
        "Practice with confidence on this non-slip, eco-friendly yoga mat. Provides excellent cushioning and support.",
      category_name: "Sports",
      original_price: 59.0,
      sale_price: 45.0,
      stock: 120,
      images: [
        "https://images.unsplash.com/photo-1592432678886-da337b51e06c?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      name: "Dumbbell Set 10kg",
      slug: "dumbbell-set-10kg",
      short_desc: "Pair of adjustable dumbbells.",
      long_desc:
        "Perfect for home workouts, this pair of adjustable dumbbells allows you to customize your strength training.",
      category_name: "Sports",
      original_price: 89.0,
      sale_price: 69.0,
      stock: 80,
      images: [
        "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      name: "Skin Care Serum",
      slug: "skin-care-serum",
      short_desc: "Vitamin C serum for radiant skin.",
      long_desc:
        "Brighten your complexion with this potent Vitamin C serum. Hydrates and rejuvenates for a youthful glow.",
      category_name: "Beauty",
      original_price: 39.0,
      sale_price: 29.0,
      stock: 150,
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143af7be?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      name: "Mystery Novel: The Lost Key",
      slug: "mystery-novel-lost-key",
      short_desc: "Thrilling mystery that keeps you guessing.",
      long_desc:
        "Follow the clues in 'The Lost Key', a gripping mystery novel filled with suspense and unexpected twists.",
      category_name: "Books",
      original_price: 19.0,
      sale_price: 14.0,
      stock: 300,
      images: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop",
      ],
    },
  ];

  for (const prod of mockProducts) {
    await connection.execute(
      `INSERT INTO products (name, slug, short_desc, long_desc, category_id, original_price, sale_price, stock, images) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prod.name,
        prod.slug,
        prod.short_desc,
        prod.long_desc,
        categoryMap[prod.category_name],
        prod.original_price,
        prod.sale_price,
        prod.stock,
        JSON.stringify(prod.images),
      ],
    );
  }
  log("Seeded mock products.", "success");
};
