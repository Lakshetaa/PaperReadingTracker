import { getCurrentUser } from '../../../lib/auth.js';
import { redirect } from 'next/navigation';
import connectDB from '../../../lib/mongodb.js';
import Paper from '../../../models/Paper.js';
import Link from 'next/link';
export const dynamic = "force-dynamic";

export default async function PaperDetailPage({ params }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  await connectDB();
  
  const paper = await Paper.findOne({ 
    _id: params.id, 
    userId: user.id 
  });

  if (!paper) {
    redirect('/dashboard');
  }

  return (
    <div className="paper-detail-container">
      <div className="paper-detail-header">
        <Link href="/dashboard" className="btn btn-secondary">
          ← Back to Dashboard
        </Link>
        <div className="paper-actions">
          <Link href={`/edit/${paper._id}`} className="btn btn-primary">
            Edit Paper
          </Link>
          <form action={`/api/papers/${paper._id}`} method="post" style={{ display: 'inline' }}>
            <input type="hidden" name="_method" value="DELETE" />
            <button type="submit" className="btn btn-danger">
              Delete Paper
            </button>
          </form>
        </div>
      </div>

      <div className="paper-detail-card">
        <div className="paper-detail-title">
          <h1>{paper.title}</h1>
          <span className={`paper-status status-${paper.status.toLowerCase().replace(' ', '-')}`}>
            {paper.status}
          </span>
        </div>

        <div className="paper-detail-info">
          <div className="info-section">
            <h3>Authors</h3>
            <p>{paper.authors}</p>
          </div>

          {paper.link && (
            <div className="info-section">
              <h3>Paper Link</h3>
              <a href={paper.link} target="_blank" rel="noopener noreferrer" className="paper-link">
                {paper.link}
              </a>
            </div>
          )}

          <div className="info-section">
            <h3>Added On</h3>
            <p>{new Date(paper.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>

          {paper.notes && (
            <div className="info-section">
              <h3>Notes</h3>
              <div className="paper-notes">
                {paper.notes.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 