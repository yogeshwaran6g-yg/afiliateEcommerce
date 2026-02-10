import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const env = {
  PORT: Number(process.env.PORT) || 4001,

  // db
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  DB_NAME: process.env.DB_NAME || "afiliateecommerce",

  // jwt
  JWT_SECRET: process.env.JWT_SECRET,

  ENABLE_LOGS: process.env.ENABLE_LOGS !== "false",
};

