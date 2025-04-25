console.log('SERVER.JS STARTED');
import dotenv from 'dotenv';
dotenv.config();
console.log('Loaded OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Joi from 'joi';
import Book from './models/Book.js';
import Review from './models/Review.js';
import User from './models/User.js';
import { refineReviewWithAI } from './openai.js';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookcafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  genre: Joi.string().required(),
  rating: Joi.number().min(0).max(5),
  summary: Joi.string().allow(''),
  cover: Joi.string().allow(''),
});

const reviewSchema = Joi.object({
  bookId: Joi.string().required(),
  userId: Joi.string().required(),
  rating: Joi.number().min(0).max(5).required(),
  comment: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
  name: Joi.string().allow(''),
  bio: Joi.string().allow(''),
  avatar: Joi.string().allow(''),
  email: Joi.string().email(),
});

const userCreateSchema = Joi.object({
  name: Joi.string().required(),
  bio: Joi.string().allow(''),
});

// --- Endpoints ---

// GET /books (with pagination)
app.get('/books', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Book.countDocuments();
    res.json({ books, total, page, limit });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books.' });
  }
});

// GET /books/:id
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    const reviews = await Review.find({ bookId: book._id }).populate('userId', 'name');
    res.json({ ...book.toObject(), reviews });
  } catch (err) {
    res.status(400).json({ error: 'Invalid book ID.' });
  }
});

// POST /books (admin only, demo: no auth)
app.post('/books', async (req, res) => {
  const { error } = bookSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json({ book });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add book.' });
  }
});

// GET /reviews?bookId=xxx
app.get('/reviews', async (req, res) => {
  try {
    const { bookId } = req.query;
    if (!bookId) return res.status(400).json({ error: 'bookId is required.' });
    const reviews = await Review.find({ bookId: mongoose.Types.ObjectId(bookId) }).populate('userId', 'name');
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

// POST /reviews
app.post('/reviews', async (req, res) => {
  console.log('POST /reviews body:', req.body); 
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.error('Review validation error:', error.details[0].message); 
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error('Error saving review:', err); 
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

// GET /users/:id
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const userReviews = await Review.find({ userId: req.params.id }).populate('bookId', 'title author');
    res.json({ ...user.toObject(), reviews: userReviews });
  } catch (err) {
    res.status(400).json({ error: 'Invalid user ID.' });
  }
});

// POST /users
app.post('/users', async (req, res) => {
  const { error } = userCreateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const userData = {
      name: req.body.name,
      bio: req.body.bio,
      reviews: []
    };
    const user = await User.create(userData);
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// PUT /users/:id
app.put('/users/:id', async (req, res) => {
  const { error } = userUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Invalid user ID.' });
  }
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error.' });
});

const DEFAULT_PORT = process.env.PORT || 5000;
function startServer(port) {
  app.listen(port, () => {
    console.log(`Book Cafe backend running on port ${port}`);
  }).on('error', err => {
    if (err.code === 'EADDRINUSE') {
      if (port < 5010) {
        console.warn(`Port ${port} in use, trying port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('All tested ports are in use (5000-5010). Please free a port and try again.');
        process.exit(1);
      }
    } else {
      throw err;
    }
  });
}

startServer(Number(DEFAULT_PORT));
