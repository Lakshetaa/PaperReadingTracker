import bcrypt from 'bcryptjs';
import connectDB from '../../lib/mongodb.js';
import User from '../../models/User.js';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable();
    
    form.parse(req, async (err, fields) => {
      if (err) {
        return res.status(500).json({ message: 'Error parsing form data' });
      }

      const { name, email, password } = fields;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (password[0].length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      await connectDB();

      // Check if user already exists
      const existingUser = await User.findOne({ email: email[0] });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password[0], 12);

      // Create user
      const user = new User({
        name: name[0],
        email: email[0],
        password: hashedPassword
      });

      await user.save();

      // Redirect to login page after successful registration
      res.redirect(302, '/login');
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 