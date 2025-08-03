import { getCurrentUser } from '../../lib/auth.js';
import { redirect } from 'next/navigation';
export const dynamic = "force-dynamic";

export default async function AddPaperPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="form-container">
      <h1 className="form-title">Add New Paper</h1>
      
      <form action="/api/papers" method="post">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-input"
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
            placeholder="https://..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status" className="form-label">Status</label>
          <select id="status" name="status" className="form-select">
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
            placeholder="Add any notes about this paper..."
          />
        </div>
        
        <button type="submit" className="form-button">
          Add Paper
        </button>
      </form>
    </div>
  );
} 