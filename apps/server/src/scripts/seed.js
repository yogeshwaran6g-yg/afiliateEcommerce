import { queryRunner, transactionRunner } from '#config/db.js';
import { log } from '#utils/helper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = async (connection) => {
  log("Starting Database Seed...", "info");

  // 1. Drop Tables (Reverse Order to handle Foreign Keys)
  await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
  const tables = [
    'addresses',
    'profiles',
    'otp',
    'referral_commission_distribution',
    'referral_tree',
    'referral_commission_config',
    'orders',
    'users'
  ];
  for (const table of tables) {
    await connection.execute(`DROP TABLE IF EXISTS ${table}`);
  }
  await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
  log("Dropped existing tables.", "success");

  // 2. Read and Execute db.sql
  const dbSqlPath = path.resolve(__dirname, '../../db.sql');
  const sqlContent = fs.readFileSync(dbSqlPath, 'utf8');
  
  // Split by semicolon, but be careful with stored procedures if they were in the file.
  // The current db.sql seems to have stored procedures at the end with DELIMITER //
  // We need to parse this carefully.
  // Simple strategy: Remove comments, split by ';', but ignore delimiters for now if we can or just run the table creates.
  // The db.sql contains "DELIMITER //" blocks. simple splitting by ';' might break procedures.
  // However, the main goal is to create tables.
  
  // Let's split by statement. 
  // A better way for this specific file structure:
  // 1. Extract content before "Stored Procedures" section or just run everything?
  // If we run everything, we need a smarter parser.
  // For now, let's assume standard statements separated by ; 
  // But wait, the file has DELIMITER // which means we need to handle that.
  
  // Actually, the seed.js is mostly about setting up data. 
  // Stored procedures might be handled by `create_procedures.js`.
  // Let's inspect db.sql availability. It has procedures at the end.
  // We should probably only run the CREATE TABLE parts if create_procedures.js handles the rest.
  // Or we can try to run it all.
  
  // Robust approach: Split by `;\n` or `;\r\n` generally works for tables.
  // But procedures use `END //`.
  
  // Let's try to just read the file and execute statements that are not empty.
  // We will simple-split by `;` for now, assuming the CREATE TABLEs are standard.
  
  // Alternative: Read until "Stored Procedures" comment and only execute that part.
  const schemaPart = sqlContent.split('Stored Procedures')[0]; 
  
  const rawStatements = schemaPart.split(';');

  for (const rawStmt of rawStatements) {
    const stmt = rawStmt.trim();
    if (!stmt) continue;

    // Remove comments
    const cleanStmt = stmt
      .split('\n')
      .map(line => {
        const commentIndex = line.indexOf('--');
        return commentIndex >= 0 ? line.substring(0, commentIndex) : line;
      })
      .join('\n')
      .trim();

    if (cleanStmt && !cleanStmt.startsWith('DELIMITER')) {
        try {
            await connection.execute(cleanStmt);
        } catch (e) {
            log(`Error executing statement: ${cleanStmt.substring(0, 50)}... - ${e.message}`, "error");
            throw e;
        }
    }
  }
  log("Executed db.sql schema (Tables).", "success");

  // 3. Seed Data
  // Referral Config
  const configs = [
    [1, 10.00], [2, 5.00], [3, 2.50], [4, 1.25], [5, 0.75], [6, 0.50]
  ];

  for (const [lvl, pct] of configs) {
    await connection.execute(
      'INSERT INTO referral_commission_config (level, percent) VALUES (?, ?)',
      [lvl, pct]
    );
  }
  log("Seeded referral levels.", "success");

  // Users (Root + Downlines)
  // Updated for new schema: name, phone, email, password, role, is_active
  const users = [
    ['Root User', '9000000001', 'root@example.com'],          // ID 1
  ];

  for (const [name, phone, email] of users) {
    await connection.execute(
        'INSERT INTO users (name, phone, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [name, phone, email, 'password123', 'ADMIN']
    );
  }
  log("Seeded users.", "success");

  // Build Tree (Linear Chain for simplicity: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8)
  // We need more users to build this tree.
  const downlines = [
      ['User 2', '9000000002', 'user2@example.com'],
      ['User 3', '9000000003', 'user3@example.com'],
      ['User 4', '9000000004', 'user4@example.com'],
      ['User 5', '9000000005', 'user5@example.com'],
      ['User 6', '9000000006', 'user6@example.com'],
      ['User 7', '9000000007', 'user7@example.com'],
      ['User 8', '9000000008', 'user8@example.com'],
  ];

  for (const [name, phone, email] of downlines) {
    await connection.execute(
        'INSERT INTO users (name, phone, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [name, phone, email, 'password123', 'USER']
    );
  }

  // Tree Logic
  // For User 2 (Ref by 1): (1, 2, 1)
  // For User 3 (Ref by 2): (2, 3, 1), (1, 3, 2)
  // ...
  const treeEntries = [
    // Downline 2 (ID 2 ref by 1)
    [1, 2, 1],
    // Downline 3 (ID 3 ref by 2)
    [2, 3, 1], [1, 3, 2],
    // Downline 4 (ID 4 ref by 3)
    [3, 4, 1], [2, 4, 2], [1, 4, 3],
    // Downline 5 (ID 5 ref by 4)
    [4, 5, 1], [3, 5, 2], [2, 5, 3], [1, 5, 4],
    // Downline 6 (ID 6 ref by 5)
    [5, 6, 1], [4, 6, 2], [3, 6, 3], [2, 6, 4], [1, 6, 5],
    // Downline 7 (ID 7 ref by 6)
    [6, 7, 1], [5, 7, 2], [4, 7, 3], [3, 7, 4], [2, 7, 5], [1, 7, 6],
    // Downline 8 (ID 8 ref by 7)
    [7, 8, 1], [6, 8, 2], [5, 8, 3], [4, 8, 4], [3, 8, 5], [2, 8, 6] 
  ];

  for (const [up, down, lvl] of treeEntries) {
    await connection.execute(
      'INSERT INTO referral_tree (upline_id, downline_id, level) VALUES (?, ?, ?)',
      [up, down, lvl]
    );
  }
  log("Seeded referral_tree.", "success");

  // Create an Order for User 8 (Should trigger commissions for 2..7, and 1)
  // user_id=8
  await connection.execute(
    'INSERT INTO orders (user_id, amount, status) VALUES (?, ?, ?)',
    [8, 1000.00, 'COMPLETED']
  );
  log("Seeded order for User 8.", "success");

  log("Database Seed Verified and Completed!", "success");
};

// Execute
transactionRunner(seed)
  .then(() => process.exit(0))
  .catch((err) => {
    log(`Seed Failed: ${err.message}`, "error");
    process.exit(1);
  });

