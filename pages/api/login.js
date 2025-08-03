import { authenticateUser, createUserSessionAPI } from '../../lib/auth.js';
import formidable from 'formidable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable();
    
    const { fields } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields) => {
        if (err) reject(err);
        else resolve({ fields });
      });
    });

    const { email, password } = fields;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await authenticateUser(email[0], password[0]);
    console.log('Login API - User authenticated:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create session using API method
    const token = createUserSessionAPI(user, res);
    console.log('Login API - Session created, token length:', token ? token.length : 0);

    // Redirect to dashboard
    res.redirect(302, '/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 