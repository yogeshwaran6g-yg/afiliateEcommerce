import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import { env } from '#config/env.js';
import { connectDB } from '#config/db.js';
import '#utils/passport.js';
import { rtnRes, log } from '#utils/helper.js';

const app = express();
const port = env.PORT;

// Connect to Database
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());

// Routes
import router from '#routes/routes.js';
app.use('/api', router);

app.get('/', (req, res) => {
  rtnRes(res, 200, 'Server is running!');
});

app.listen(port || 4000, () => {
  log(`Server running on http://localhost:${port}`, "success");
});
