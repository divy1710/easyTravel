import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './api/v1/middlewares/errorHandler';
import v1Routes from './api/v1/routes';

const app = express();

// Middleware
app.use(cors({
  origin: config.nodeEnv === 'production' 
    ? ['https://yourdomain.com', 'https://your-frontend.vercel.app', 'https://your-frontend.netlify.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Rate limiting - relaxed for development, stricter for production
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: config.nodeEnv === 'production' ? 30 : 100, // requests per window
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/v1/health', // Skip health checks
});

app.use(limiter);

// API Versioning
app.use('/api/v1', v1Routes);

// Centralized error handler
app.use(errorHandler);

export default app;
