import { transactionRunner } from '#config/db.js';
import { log } from '#utils/helper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createSchema = async (connection) => {
  log("Starting Database Schema Creation...", "info");

  // 1. Drop Tables (Reverse Order to handle Foreign Keys)
  await connection.query("SET FOREIGN_KEY_CHECKS = 0");
  const tables = [
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
  
  // Also drop stored procedures if they exist
  await connection.query("DROP PROCEDURE IF EXISTS sp_add_referral");
  await connection.query("DROP PROCEDURE IF EXISTS sp_distribute_commission");
  
  await connection.query("SET FOREIGN_KEY_CHECKS = 1");
  log("Dropped existing tables and procedures.", "success");

  // 2. Read and Execute db.sql (Tables)
  const dbSqlPath = path.resolve(__dirname, '../../db.sql');
  const sqlContent = fs.readFileSync(dbSqlPath, 'utf8');
  
  // Extract schema part (before stored procedures section)
  // Use a regex to catch the "Stored Procedures" header case-insensitively
  const schemaPart = sqlContent.split(/--\s*Stored Procedures/i)[0]; 
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
            await connection.query(cleanStmt);
        } catch (e) {
            log(`Error executing table statement: ${cleanStmt.substring(0, 50)}... - ${e.message}`, "error");
            throw e;
        }
    }
  }
  log("Created tables from db.sql.", "success");

  // 3. Read and Execute storedProcedure.sql
  const spSqlPath = path.resolve(__dirname, '../../storedProcedure.sql');
  const spContent = fs.readFileSync(spSqlPath, 'utf8');
  
  const spBlocks = spContent.split('//');
  for (const block of spBlocks) {
    let cleanBlock = block.trim();
    if (!cleanBlock) continue;
    
    // Remove "DELIMITER //" and "DELIMITER ;" and comments
    cleanBlock = cleanBlock
      .replace(/DELIMITER\s+\/\//gi, '')
      .replace(/DELIMITER\s+;/gi, '')
      .split('\n')
      .map(line => {
        const commentIndex = line.indexOf('--');
        return commentIndex >= 0 ? line.substring(0, commentIndex) : line;
      })
      .join('\n')
      .trim();
      
    if (cleanBlock.toUpperCase().startsWith('CREATE PROCEDURE')) {
      try {
        await connection.query(cleanBlock);
        log(`Created procedure: ${cleanBlock.split('(')[0]}`, "success");
      } catch (e) {
        log(`Error creating procedure: ${e.message}`, "error");
        throw e;
      }
    }
  }


  log("Database Schema Creation Completed!", "success");
};

// Execute
transactionRunner(createSchema)
  .then(() => {
    log("Seeding script finished successfully.", "success");
    process.exit(0);
  })
  .catch((err) => {
    log(`Seeding Script Failed: ${err.message}`, "error");
    process.exit(1);
  });
