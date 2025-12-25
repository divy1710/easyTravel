import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../../../models/User';
import { config } from '../../../config';
import { authenticateJWT, AuthRequest } from '../middlewares/auth';

const router = Router();

// Cookie options for HTTP-only secure cookies
const cookieOptions = {
  httpOnly: true, // Prevents XSS attacks - JS can't access the cookie
  secure: true, // Always use HTTPS for cookies (required for sameSite: 'none')
  sameSite: config.nodeEnv === 'production' ? 'none' as const : 'lax' as const, // 'none' allows cross-origin cookies
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: '/',
};

// JWT sign options
const jwtSignOptions: SignOptions = {
  expiresIn: config.jwt.expiresIn as any,
};

// Signup
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hash, firstName, lastName, phone });
    const token = jwt.sign({ id: user._id, email: user.email }, config.jwt.secret, jwtSignOptions);
    
    // Set HTTP-only cookie
    res.cookie('authToken', token, cookieOptions);
    
    res.status(201).json({ 
      user: { email: user.email, firstName: user.firstName, lastName: user.lastName, createdAt: user.createdAt },
      message: 'Signup successful'
    });
  } catch (err) { next(err); }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, config.jwt.secret, jwtSignOptions);
    
    // Set HTTP-only cookie
    res.cookie('authToken', token, cookieOptions);
    
    res.json({ 
      user: { email: user.email, firstName: user.firstName, lastName: user.lastName, createdAt: user.createdAt },
      message: 'Login successful'
    });
  } catch (err) { next(err); }
});

// Logout - clear the cookie
router.post('/logout', (req, res) => {
  res.clearCookie('authToken', { path: '/' });
  res.json({ message: 'Logged out successfully' });
});

// Get current user (check if authenticated)
router.get('/me', authenticateJWT, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.clearCookie('authToken', { path: '/' });
      return res.status(401).json({ error: 'User not found' });
    }
    res.json({ 
      user: { 
        id: user._id,
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName,
        phone: user.phone,
        createdAt: user.createdAt 
      } 
    });
  } catch (err) {
    next(err);
  }
});

// Guest login (no DB record)
router.post('/guest', (req, res) => {
  const guestPayload = { guest: true };
  const token = jwt.sign(guestPayload, config.jwt.secret, jwtSignOptions);
  
  // Set HTTP-only cookie for guest
  res.cookie('authToken', token, cookieOptions);
  
  res.json({ user: { guest: true }, message: 'Guest session created' });
});

export default router;
