import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Book from './models/Book.js';

dotenv.config();

async function fixUserReviews() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookcafe', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const users = await User.find({});
  let changedCount = 0;
  for (const user of users) {
    let changed = false;
    const newReviews = [];
    for (const review of user.reviews) {
      // If already has bookId as ObjectId, just keep it
      if (review.bookId) {
        newReviews.push({
          bookId: review.bookId,
          rating: review.rating,
          comment: review.comment,
          date: review.date || new Date().toISOString(),
        });
        continue;
      }
      // Try to match by book title/author or id
      let book = null;
      if (review.book && typeof review.book === 'string' && review.book.length === 24) {
        // Looks like an ObjectId string
        book = await Book.findById(review.book);
      }
      if (!book && review.book && review.author) {
        book = await Book.findOne({
          title: review.book,
          author: review.author
        });
      }
      if (book) {
        newReviews.push({
          bookId: book._id,
          rating: review.rating,
          comment: review.comment,
          date: review.date || new Date().toISOString(),
        });
        changed = true;
      } else {
        // Could not find book, keep as is but mark as unknown
        newReviews.push({
          rating: review.rating,
          comment: review.comment,
          date: review.date || new Date().toISOString(),
        });
      }
    }
    if (changed) {
      user.reviews = newReviews;
      await user.save();
      changedCount++;
      console.log(`Updated reviews for user ${user._id}`);
    }
  }
  console.log(`Fix complete. Updated ${changedCount} user(s).`);
  mongoose.disconnect();
}

fixUserReviews();
