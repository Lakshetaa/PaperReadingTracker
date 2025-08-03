import { getCurrentUser } from '../../lib/auth.js';
import { redirect } from 'next/navigation';
import Link from 'next/link';
export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="form-container">
      <h1 className="form-title">Register</h1>
      
      <form action="/api/register" method="post">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            required
          />
        </div>
        
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
            minLength="6"
            required
          />
        </div>
        
        <button type="submit" className="form-button">
          Register
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p>Already have an account? <Link href="/login">Login here</Link></p>
      </div>
    </div>
  );
} 