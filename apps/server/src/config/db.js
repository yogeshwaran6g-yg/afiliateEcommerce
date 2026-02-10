import mysql from 'mysql2/promise';
import { env } from './env.js';
import { log } from '../utils/helper.js';


const pool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    log("Connected to MySQL Database", "success");
    connection.release();
  } catch (err) {
    log(`Database Connection Failed: ${err.message}`, "error");
    process.exit(1);
  }
};

export const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (err) {
    log(`Database Connection Failed: ${err.message}`, "error");
    throw err;
  }
};



export const queryRunner = async (sql, params = []) => {
  let connection;
  try {
    connection = await getConnection();
    const [rows, fields] = await connection.execute(sql, params);
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    log(`Query Error: ${error.message}`, "error", { sql });
    throw error;
  } finally {
    if (connection) connection.release();
  }
};


export const callSP = async (procName, params = [], connection = null) => {
  try {
    const runner = connection || pool;
    const placeholders = params.map(() => '?').join(',');
    const sql = `CALL ${procName}(${placeholders})`;
    const [rows] = await runner.execute(sql, params);
    return rows[0]; // SPs usually return result sets in the first element
  } catch (error) {
    log(`SP Error: ${error.message}`, "error", { procName });
    throw error;
  }
};


export const transactionRunner = async (callback) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    log("Transaction Started", "debug");

    const result = await callback(connection);

    await connection.commit();
    log("Transaction Committed", "debug");
    return result;
  } catch (error) {
    await connection.rollback();
    log(`Transaction Rolled Back: ${error.message}`, "error");
    throw error;
  } finally {
    connection.release();
  }
};


export default pool;
