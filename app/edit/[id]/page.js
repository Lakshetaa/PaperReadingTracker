import { getCurrentUser } from '../../../lib/auth.js';
import { redirect } from 'next/navigation';
import connectDB from '../../../lib/mongodb.js';
import Paper from '../../../models/Paper.js';
import Link from 'next/link';

export default async function EditPaperPage({ params }) {
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
    <div className="form-container">
      <h1 className="form-title">Edit Paper</h1>
      
      <form action={`/api/papers/${paper._id}`} method="post">
        <input type="hidden" name="_method" value="PUT" />
        
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-input"
            defaultValue={paper.title}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="authors" className="form-label">Authors *</label>
          <input
            type="text"
            id="authors"
            name="authors"
            className="form-input"
            defaultValue={paper.authors}
            placeholder="e.g., John Doe, Jane Smith"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="link" className="form-label">Paper Link</label>
          <input
            type="url"
            id="link"
            name="link"
            className="form-input"
            defaultValue={paper.link || ''}
            placeholder="https://..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status" className="form-label">Status</label>
          <select id="status" name="status" className="form-select" defaultValue={paper.status}>
            <option value="To Read">To Read</option>
            <option value="Reading">Reading</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes" className="form-label">Notes</label>
          <textarea
            id="notes"
            name="notes"
            className="form-textarea"
            defaultValue={paper.notes || ''}
            placeholder="Add any notes about this paper..."
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="form-button" style={{ flex: 1 }}>
            Update Paper
          </button>
          <Link href="/dashboard" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', lineHeight: '3rem' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
} 