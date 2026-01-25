import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../../config';

export interface AuthRequest extends Request {
  user?: any;
}

// Helper to extract token from cookie or Authorization header
function getToken(req: Request): string | null {
  // First check for HTTP-only cookie
  if (req.cookies?.authToken) {
    return req.cookies.authToken;
  }
  
  // Fallback to Authorization header for backward compatibility
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  return null;
}

// Strict auth - rejects if no valid token
export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const token = getToken(req);
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    // Clear invalid cookie if present
    res.clearCookie('authToken');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Optional auth - allows guests, attaches user if token valid
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = getToken(req);
  
  if (!token) {
    req.user = null;
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }
  next();
}
