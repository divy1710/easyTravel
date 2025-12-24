import { Router } from 'express';
import authRoutes from './auth';
import tripRoutes from './trip';
import placesRoutes from './places';

const router = Router();

router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/places', placesRoutes);

// Example: Protect routes with JWT middleware
// import { authenticateJWT } from '../middlewares/auth';
// router.get('/protected', authenticateJWT, (req, res) => res.json({ ok: true }));

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
