import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import { env } from '#config/env.js';
import { connectDB } from '#config/db.js';
import '#utils/passport.js';
import { rtnRes, log } from '#utils/helper.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = env.PORT;

// Connect to Database
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));
app.use('/uploads/kyc', express.static(path.join(__dirname, 'uploads/kyc')));
app.use('/uploads/payments', express.static(path.join(__dirname, 'uploads/payments')));
app.use('/uploads/tickets', express.static(path.join(__dirname, 'uploads/tickets')));

// Routes
import router from '#src/routes/appRoutes.js';
app.use('/api/v1', router);

app.get('/', (req, res) => {
  rtnRes(res, 200, 'Server is running!');
});

app.listen(port || 4000, () => {
  log(`Server running on http://localhost:${port}`, "success");
});
