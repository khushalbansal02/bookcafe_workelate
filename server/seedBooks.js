import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';

dotenv.config();

const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    rating: 4.5,
    summary: 'A novel set in the 1920s about Jay Gatsby and the American Dream.',
    cover: ''
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic',
    rating: 4.8,
    summary: 'A story of racial injustice in the Deep South.',
    cover: ''
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    rating: 4.6,
    summary: 'A chilling prophecy about the future.',
    cover: ''
  },
  // Add more books as needed
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookcafe', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Book.deleteMany({});
  await Book.insertMany(books);
  console.log('Books seeded!');
  mongoose.disconnect();
}

seed();
