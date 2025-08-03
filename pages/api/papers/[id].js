import { getCurrentUserAPI } from '../../../lib/auth.js';
import connectDB from '../../../lib/mongodb.js';
import Paper from '../../../models/Paper.js';
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

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Paper ID is required' });
  }

  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const paper = await Paper.findOne({ _id: id, userId: user.id });
        if (!paper) {
          return res.status(404).json({ message: 'Paper not found' });
        }
        res.status(200).json(paper);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching paper' });
      }
      break;

    case 'POST':
      // Handle form submissions for PUT and DELETE
      const form = formidable();
      
      form.parse(req, async (err, fields) => {
        if (err) {
          return res.status(500).json({ message: 'Error parsing form data' });
        }

        const method = fields._method ? fields._method[0] : null;
        
        if (method === 'PUT') {
          try {
            const { title, authors, link, status, notes } = fields;

            if (!title || !authors) {
              return res.status(400).json({ message: 'Title and authors are required' });
            }

            const paper = await Paper.findOneAndUpdate(
              { _id: id, userId: user.id },
              { 
                title: title[0], 
                authors: authors[0], 
                link: link ? link[0] : '', 
                status: status ? status[0] : 'To Read', 
                notes: notes ? notes[0] : '' 
              },
              { new: true }
            );

            if (!paper) {
              return res.status(404).json({ message: 'Paper not found' });
            }

            res.redirect(302, '/dashboard');
          } catch (error) {
            console.error('Error updating paper:', error);
            res.status(500).json({ message: 'Error updating paper' });
          }
        } else if (method === 'DELETE') {
          try {
            const paper = await Paper.findOneAndDelete({ _id: id, userId: user.id });
            
            if (!paper) {
              return res.status(404).json({ message: 'Paper not found' });
            }

            res.redirect(302, '/dashboard');
          } catch (error) {
            console.error('Error deleting paper:', error);
            res.status(500).json({ message: 'Error deleting paper' });
          }
        } else {
          res.status(400).json({ message: 'Invalid method' });
        }
      });
      break;

    case 'PUT':
      try {
        const { title, authors, link, status, notes } = req.body;

        if (!title || !authors) {
          return res.status(400).json({ message: 'Title and authors are required' });
        }

        const paper = await Paper.findOneAndUpdate(
          { _id: id, userId: user.id },
          { title, authors, link, status, notes },
          { new: true }
        );

        if (!paper) {
          return res.status(404).json({ message: 'Paper not found' });
        }

        res.status(200).json(paper);
      } catch (error) {
        res.status(500).json({ message: 'Error updating paper' });
      }
      break;

    case 'DELETE':
      try {
        const paper = await Paper.findOneAndDelete({ _id: id, userId: user.id });
        
        if (!paper) {
          return res.status(404).json({ message: 'Paper not found' });
        }

        res.status(200).json({ message: 'Paper deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting paper' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
} 