import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  authors: {
    type: String,
    required: [true, 'Authors are required'],
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['To Read', 'Reading', 'Completed'],
    default: 'To Read'
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate model initialization
const Paper = mongoose.models.Paper || mongoose.model('Paper', paperSchema);

export default Paper; 