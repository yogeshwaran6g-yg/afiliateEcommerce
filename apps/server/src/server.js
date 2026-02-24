import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import { env } from '#config/env.js';
import { connectDB } from '#config/db.js';
import '#utils/passport.js';
import { rtnRes, log } from '#utils/helper.js';
import { globalRateLimiter } from '#middlewares/rateLimiter.js';
import { errorHandler, notFoundHandler } from '#middlewares/errorHandler.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global Error Handlers (Before app initialization to catch early errors)
process.on('uncaughtException', (err) => {
  log(`UNCAUGHT EXCEPTION! 💥 Shutting down...`, "error");
  log(err.name + ': ' + err.message, "error");
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  log(`UNHANDLED REJECTION! 💥 Shutting down...`, "error");
  log(err.name + ': ' + err.message, "error");
  console.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

const app = express();
const port = env.PORT;

// Connect to Database
await connectDB();

// Middleware
app.use(globalRateLimiter); // Apply global rate limit
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));
app.use('/uploads/categories', express.static(path.join(__dirname, 'uploads/categories')));
app.use('/uploads/kyc', express.static(path.join(__dirname, 'uploads/kyc')));
app.use('/uploads/payments', express.static(path.join(__dirname, 'uploads/payments')));
app.use('/uploads/tickets', express.static(path.join(__dirname, 'uploads/tickets')));

// Routes
import router from '#src/routes/appRoutes.js';
app.use('/api/v1', router);

app.get('/', (req, res) => {
  rtnRes(res, 200, 'Server is running!');
});

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler (Must be last)
app.use(errorHandler);

const server = app.listen(port || 4000, () => {
  log(`Server running on http://localhost:${port}`, "success");
});

// Graceful Shutdown
const shutdown = async (signal) => {
  log(`\nReceived ${signal}. Shutting down gracefully...`, "info");

  server.close(() => {
    log('HTTP server closed.', "info");
    process.exit(0);
  });

  // Force close after 10s
  setTimeout(() => {
    log('Could not close connections in time, forcefully shutting down', "error");
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
