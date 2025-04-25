import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  summary: { type: String },
  cover: { type: String },
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
