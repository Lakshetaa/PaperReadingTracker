import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb.js';
import User from '../models/User.js';
import crypto from 'crypto';

const SECRET = process.env.AUTH_SECRET || 'your-secret-key-change-in-production';

// For Server Components (pages)
export async function createUserSession(user) {
  const cookieStore = await cookies();
  
  // Create a simple token with user info
  const token = Buffer.from(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    exp: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
  })).toString('base64');
  
  // Sign the token
  const signature = crypto.createHmac('sha256', SECRET).update(token).digest('hex');
  const signedToken = `${token}.${signature}`;
  
  cookieStore.set('auth', signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  });
  
  return signedToken;
}

// For API routes
export function createUserSessionAPI(user, res) {
  console.log('CreateSession API - Creating session for user:', user.id);
  
  // Create a simple token with user info
  const token = Buffer.from(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    exp: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
  })).toString('base64');
  
  // Sign the token
  const signature = crypto.createHmac('sha256', SECRET).update(token).digest('hex');
  const signedToken = `${token}.${signature}`;
  
  console.log('CreateSession API - Full signed token length:', signedToken.length);
  
  // Set cookie in response
  res.setHeader('Set-Cookie', `auth=${signedToken}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  
  return signedToken;
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const signedToken = cookieStore.get('auth')?.value;
    
    if (!signedToken) {
      return null;
    }
    
    return verifyToken(signedToken);
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// For API routes - Simplified approach
export function getCurrentUserAPI(req) {
  try {
    const cookies = req.headers.cookie;
    
    if (!cookies) {
      return null;
    }
    
    // Find the auth cookie
    const authMatch = cookies.match(/auth=([^;]+)/);
    if (!authMatch) {
      return null;
    }
    
    const signedToken = authMatch[1];
    console.log('Auth API - Token found, length:', signedToken.length);
    
    return verifyToken(signedToken);
  } catch (error) {
    console.error('Auth API error:', error);
    return null;
  }
}

function verifyToken(signedToken) {
  try {
    const [token, signature] = signedToken.split('.');
    
    if (!token || !signature) {
      console.log('VerifyToken - Missing token or signature');
      return null;
    }
    
    // Verify signature
    const expectedSignature = crypto.createHmac('sha256', SECRET).update(token).digest('hex');
    
    if (signature !== expectedSignature) {
      console.log('VerifyToken - Signature mismatch');
      return null;
    }
    
    // Decode token
    const userData = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check if token is expired
    if (userData.exp < Date.now()) {
      console.log('VerifyToken - Token expired');
      return null;
    }
    
    console.log('VerifyToken - Token verified successfully for user:', userData.name);
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email
    };
  } catch (error) {
    console.error('VerifyToken - Error:', error);
    return null;
  }
}

export async function destroyUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete('auth');
}

// For API routes
export function destroyUserSessionAPI(res) {
  res.setHeader('Set-Cookie', 'auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
}

export async function authenticateUser(email, password) {
  try {
    await connectDB();
    
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }
    
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
} 