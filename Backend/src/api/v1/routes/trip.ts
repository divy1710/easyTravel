import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateJWT, optionalAuth } from '../middlewares/auth';
import { validateBody } from '../middlewares/validate';
import { createTripSchema, updateTripSchema } from '../validators/tripSchemas';
import { createTripWithAISchema } from '../validators/createTripSchemas';
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip
} from '../controllers/tripController';
import { createTripWithAI } from '../controllers/createTripController';

const router = Router();

// Stricter rate limit for AI endpoint (uses external API with its own limits)
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute per IP
  message: { error: 'Too many trip generation requests. Please wait a minute and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI-powered trip creation - works for guests and authenticated users
router.post('/create', aiRateLimiter, optionalAuth, validateBody(createTripWithAISchema), createTripWithAI);

// Protected routes - require authentication
router.use(authenticateJWT);

// Standard CRUD
router.post('/', validateBody(createTripSchema), createTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.put('/:id', validateBody(updateTripSchema), updateTrip);
router.delete('/:id', deleteTrip);

export default router;
