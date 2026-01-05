import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../../../models/User';
import { config } from '../../../config';
import { authenticateJWT, AuthRequest } from '../middlewares/auth';

const router = Router();

// Initialize Google OAuth client
const googleClient = new OAuth2Client(config.googleClientId);

// Cookie options for HTTP-only secure cookies
const getCookieOptions = () => {
  const isProduction = config.nodeEnv === 'production';
  
  return {
    httpOnly: true, // Prevents XSS attacks - JS can't access the cookie
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'none' as const : 'lax' as const, // 'none' allows cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/',
    // Don't set domain - let it default to the request domain
  };
};

// JWT sign options
const jwtSignOptions: SignOptions = {
  expiresIn: config.jwt.expiresIn as any,
};

// Signup
router.post('/signup', async (req: any, res: any, next: any) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ 
      email, 
      password: hash, 
      firstName, 
      lastName, 
      phone
    });
    const token = jwt.sign({ id: user._id, email: user.email }, config.jwt.secret, jwtSignOptions);
    
    // Set HTTP-only cookie
    res.cookie('authToken', token, getCookieOptions());
    
    res.status(201).json({ 
      user: { 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName,
        createdAt: user.createdAt 
      },
      message: 'Signup successful'
    });
  } catch (err) { next(err); }
});

// Login
router.post('/login', async (req: any, res: any, next: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, config.jwt.secret, jwtSignOptions);
    
    // Set HTTP-only cookie
    res.cookie('authToken', token, getCookieOptions());
    
    res.json({ 
      user: { email: user.email, firstName: user.firstName, lastName: user.lastName, createdAt: user.createdAt },
      message: 'Login successful'
    });
  } catch (err) { next(err); }
});

// Logout - clear the cookie
router.post('/logout', (req: any, res: any) => {
  res.clearCookie('authToken', { path: '/' });
  res.json({ message: 'Logged out successfully' });
});

// Get current user (check if authenticated)
router.get('/me', authenticateJWT, async (req: AuthRequest, res: any, next: any) => {
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
router.post('/guest', (req: any, res: any) => {
  const guestPayload = { guest: true };
  const token = jwt.sign(guestPayload, config.jwt.secret, jwtSignOptions);
  
  // Set HTTP-only cookie for guest
  res.cookie('authToken', token, getCookieOptions());
  
  res.json({ user: { guest: true }, message: 'Guest session created' });
});

// Google OAuth Login/Signup
router.post('/google', async (req: any, res: any, next: any) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    const { email, sub: googleId, given_name, family_name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // Update existing user with Google info if not already set
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture;
        await user.save();
      }
    } else {
      // Create new user with Google info
      // Google users don't need a password, so generate a random one
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 12);
      
      user = await User.create({
        email,
        password: randomPassword,
        firstName: given_name || '',
        lastName: family_name || '',
        googleId,
        avatar: picture,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.jwt.secret,
      jwtSignOptions
    );

    // Set HTTP-only cookie
    res.cookie('authToken', token, getCookieOptions());

    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      message: 'Google login successful',
    });
  } catch (error: any) {
    console.error('Google OAuth error:', error);
    
    if (error.message?.includes('Token used too late')) {
      return res.status(401).json({ error: 'Google token expired. Please try again.' });
    }
    
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

export default router;
