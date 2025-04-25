import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String, default: '' },
  email: { type: String, required: false, default: '' },
  reviews: { type: [Object], default: [] }
  // You can add more fields as needed (e.g., avatar, etc.)
});

const User = mongoose.model('User', userSchema);
export default User;
