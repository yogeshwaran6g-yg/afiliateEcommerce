import upload from './src/middlewares/uploadMiddleware.js';
import fs from 'fs';
import path from 'path';

console.log("Upload directory exists:", fs.existsSync('./src/uploads/products'));
console.log("Middleware loaded correctly");
process.exit(0);
