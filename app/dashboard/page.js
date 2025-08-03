import { getCurrentUser } from '../../lib/auth.js';
import { redirect } from 'next/navigation';
import connectDB from '../../lib/mongodb.js';
import Paper from '../../models/Paper.js';
import Link from 'next/link';
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  await connectDB();
  
  const papers = await Paper.find({ userId: user.id })
    .sort({ createdAt: -1 });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Papers</h1>
        <Link href="/add" className="btn btn-primary">
          Add New Paper
        </Link>
      </div>

      <div className="grid">
        {papers.map((paper) => (
          <Link key={paper._id} href={`/paper/${paper._id}`} className="card-link">
            <div className="card clickable-card">
              <h3 className="card-title">{paper.title}</h3>
              <p className="card-authors">By: {paper.authors}</p>
              <span className={`card-status status-${paper.status.toLowerCase().replace(' ', '-')}`}>
                {paper.status}
              </span>
              <p className="card-date">
                Added on {new Date(paper.createdAt).toLocaleDateString()}
              </p>
              {paper.notes && (
                <p style={{ marginBottom: '1rem', color: '#666' }}>
                  {paper.notes.length > 100 ? `${paper.notes.substring(0, 100)}...` : paper.notes}
                </p>
              )}
              {paper.link && (
                <div className="card-link-indicator">
                  <span className="link-icon">🔗</span> Link available
                </div>
              )}
              <div className="card-hover-text">
                Click to view details
              </div>
            </div>
          </Link>
        ))}
      </div>

      {papers.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>You haven&apos;t added any papers yet.</p>
          <Link href="/add" className="btn btn-primary">
            Add Your First Paper
          </Link>
        </div>
      )}
    </div>
  );
} 