import connectDB from '../lib/mongodb.js';
import Paper from '../models/Paper.js';
import User from '../models/User.js';
import Link from 'next/link';
export const dynamic = "force-dynamic";


export default async function Home() {
  await connectDB();
  
  const papers = await Paper.find()
    .populate('userId', 'name')
    .sort({ createdAt: -1 })
    .limit(20);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Paper Reading Tracker</h1>
        <p>Track and manage your academic paper reading progress</p>
      </div>

      <div className="grid">
        {papers.map((paper) => (
          <div key={paper._id} className="card">
            <h3 className="card-title">{paper.title}</h3>
            <p className="card-authors">By: {paper.authors}</p>
            <span className={`card-status status-${paper.status.toLowerCase().replace(' ', '-')}`}>
              {paper.status}
            </span>
            <p className="card-date">
              Added by {paper.userId?.name || 'Unknown'} on{' '}
              {new Date(paper.createdAt).toLocaleDateString()}
            </p>
            {paper.link && (
              <a href={paper.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                View Paper
              </a>
            )}
          </div>
        ))}
      </div>

      {papers.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>No papers have been added yet.</p>
          <Link href="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
}
