import { getCurrentUser } from '../../lib/auth.js';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="form-container">
      <h1 className="form-title">Login</h1>
      
      <form action="/api/login" method="post">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            required
          />
        </div>
        
        <button type="submit" className="form-button">
          Login
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p>Don't have an account? <Link href="/register">Register here</Link></p>
      </div>
    </div>
  );
} 