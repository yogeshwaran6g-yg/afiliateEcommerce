import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'afiliateecommerce',
  port: 3306
});

try {
  await conn.execute(`ALTER TABLE wallet_transactions MODIFY COLUMN status ENUM('SUCCESS','PENDING','FAILED','REVERSED') NOT NULL DEFAULT 'SUCCESS'`);
  console.log('✅ wallet_transactions.status ENUM updated successfully (added PENDING)');
} catch (e) {
  console.error('❌ Failed to update ENUM:', e.message);
} finally {
  await conn.end();
}
