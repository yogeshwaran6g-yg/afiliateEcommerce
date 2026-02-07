import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 4001,
  // db
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_NAME: process.env.DB_NAME || 'afiliateecommerce',
  // jwt
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  ENABLE_LOGS: process.env.ENABLE_LOGS !== 'false',
};

