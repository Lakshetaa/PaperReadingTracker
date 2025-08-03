import { getCurrentUserAPI } from '../../lib/auth.js';
import connectDB from '../../lib/mongodb.js';
import Paper from '../../models/Paper.js';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const user = getCurrentUserAPI(req);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const papers = await Paper.find({ userId: user.id }).sort({ createdAt: -1 });
        res.status(200).json(papers);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching papers' });
      }
      break;

    case 'POST':
      try {
        const form = formidable();
        
        form.parse(req, async (err, fields) => {
          if (err) {
            return res.status(500).json({ message: 'Error parsing form data' });
          }

          const { title, authors, link, status, notes } = fields;

          if (!title || !authors) {
            return res.status(400).json({ message: 'Title and authors are required' });
          }

          const paper = new Paper({
            userId: user.id,
            title: title[0],
            authors: authors[0],
            link: link ? link[0] : '',
            status: status ? status[0] : 'To Read',
            notes: notes ? notes[0] : ''
          });

          await paper.save();
          
          // Redirect to dashboard after successful creation
          res.redirect(302, '/dashboard');
        });
      } catch (error) {
        console.error('Error creating paper:', error);
        res.status(500).json({ message: 'Error creating paper' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
} 