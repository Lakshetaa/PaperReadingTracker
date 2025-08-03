import { getCurrentUser } from '../../lib/auth.js';
import { redirect } from 'next/navigation';
import connectDB from '../../lib/mongodb.js';
import Paper from '../../models/Paper.js';
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  await connectDB();
  
  const papers = await Paper.find({ userId: user.id });
  
  const stats = {
    total: papers.length,
    toRead: papers.filter(p => p.status === 'To Read').length,
    reading: papers.filter(p => p.status === 'Reading').length,
    completed: papers.filter(p => p.status === 'Completed').length
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Papers</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.toRead}</div>
          <div className="stat-label">To Read</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.reading}</div>
          <div className="stat-label">Reading</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>
    </div>
  );
} 