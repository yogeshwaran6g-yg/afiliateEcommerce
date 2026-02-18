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
      long_desc: "Experience the power of Smartphone X1 with its advanced 108MP camera, 120Hz OLED display, and the fastest chip in a smartphone.",
      category_name: "Electronics",
      original_price: 999.0,
      sale_price: 899.0,
      stock: 50,
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop"],
    },
    {
      name: "Wireless Earbuds Pro",
      slug: "wireless-earbuds-pro",
      short_desc: "Active noise cancelling wireless earbuds.",
      long_desc: "Wireless Earbuds Pro feature active noise cancellation for immersive sound. Better transparency mode and comfort.",
      category_name: "Electronics",
      original_price: 249.0,
      sale_price: 199.0,
      stock: 100,
      images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=500&auto=format&fit=crop"],
    },
    {
      name: "Classic Leather Jacket",
      slug: "classic-leather-jacket",
      short_desc: "Premium quality genuine leather jacket.",
      long_desc: "This classic leather jacket is crafted from high-quality genuine leather. Timeless design.",
      category_name: "Fashion",
      original_price: 199.0,
      sale_price: 149.0,
      stock: 30,
      images: ["https://images.unsplash.com/photo-1551028150-64b9f398f678?q=80&w=500&auto=format&fit=crop"],
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
