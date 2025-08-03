import { getCurrentUser } from '../../lib/auth.js';
import Link from 'next/link';

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          Paper Tracker
        </Link>
        
        <div className="nav-menu">
          {user ? (
            <>
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
              <Link href="/add" className="nav-link">Add Paper</Link>
              <Link href="/profile" className="nav-link">Profile</Link>
              <form action="/api/logout" method="post" style={{ display: 'inline' }}>
                <button type="submit" className="nav-link logout-btn">Logout</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">Login</Link>
              <Link href="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 