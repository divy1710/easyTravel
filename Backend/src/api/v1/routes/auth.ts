import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../../../models/User';
import { OTP } from '../../../models/OTP';
import { config } from '../../../config';
import { authenticateJWT, AuthRequest } from '../middlewares/auth';
import { generateOTP, sendOTPEmail } from '../../../services/emailService';

const router = Router();

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
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, isVerified } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ 
      email, 
      password: hash, 
      firstName, 
      lastName, 
      phone,
      isVerified: isVerified || false 
    });
    const token = jwt.sign({ id: user._id, email: user.email }, config.jwt.secret, jwtSignOptions);
    
    // Set HTTP-only cookie
    res.cookie('authToken', token, getCookieOptions());
    
    res.status(201).json({ 
      user: { 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        isVerified: user.isVerified,
        createdAt: user.createdAt 
      },
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
    res.cookie('authToken', token, getCookieOptions());
    
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
  res.cookie('authToken', token, getCookieOptions());
  
  res.json({ user: { guest: true }, message: 'Guest session created' });
});

// Send OTP for email verification
router.post('/send-otp', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({ email, otp, expiresAt });

    // Send OTP via email
    try {
      await sendOTPEmail(email, otp);
      res.json({ message: 'OTP sent successfully to your email' });
    } catch (emailError: any) {
      // OTP is saved in DB, but email failed - still allow user to continue
      console.error('Email sending failed, but OTP saved:', emailError.message);
      
      // Return success but with a warning
      res.json({ 
        message: 'OTP generated. If you don\'t receive the email, please contact support.',
        warning: 'Email service temporarily unavailable'
      });
    }
  } catch (err) {
    next(err);
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(401).json({ error: 'OTP has expired' });
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
