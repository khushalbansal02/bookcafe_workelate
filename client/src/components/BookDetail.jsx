import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Divider, TextField, Button, Rating, Avatar, Chip, Fade } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import StarIcon from '@mui/icons-material/Star';
import Footer from './Footer';
import AnimatedBookBackground from './AnimatedBookBackground';

const bookAvatarCafe = {
  width: 120,
  height: 120,
  bgcolor: '#b08968',
  boxShadow: 4,
  margin: '0 auto',
  mt: 2,
  mb: 2,
  fontSize: 48,
  color: '#fffbe6',
};

const reviewCardStyle = {
  p: 2,
  mb: 2,
  borderRadius: 3,
  background: 'linear-gradient(100deg, #fffbe6 60%, #ede0d4 100%)',
  boxShadow: '0 2px 12px #b0896833',
};

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/books/${id}`)
      .then(res => res.json())
      .then(data => {
        setBook(data);
        setReviews(data.reviews || []);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const userId = localStorage.getItem('userId');
    const res = await fetch('http://localhost:5000/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: id, rating: newReview.rating, comment: newReview.comment, userId })
    });
    if (res.ok) {
      const review = await res.json();
      setReviews([...reviews, review]);
      setNewReview({ rating: 0, comment: '' });
    }
    setSubmitting(false);
  };

  if (!book) return (
    <Box sx={{ minHeight: '100vh', background: 'transparent', position: 'relative' }}>
      <AnimatedBookBackground />
      <Box sx={{ pt: 12, textAlign: 'center' }}>
        <Typography variant="h5">Loading...</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'transparent', pb: 0, overflow: 'hidden' }}>
      <AnimatedBookBackground />
      <Fade in timeout={700}>
        <Box sx={{ pt: 8, pb: 4, maxWidth: 800, mx: 'auto', position: 'relative', zIndex: 1 }}>
          <Paper elevation={6} sx={{ p: { xs: 2, md: 6 }, borderRadius: 6, mb: 4, background: 'linear-gradient(100deg, #ede0d4 60%, #fffbe6 100%)', boxShadow: '0 4px 32px #b0896833', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <Avatar sx={bookAvatarCafe}>
              <BookIcon sx={{ fontSize: 60, color: '#ffb347' }} />
            </Avatar>
            <Typography variant="h4" fontWeight={700} color="#6d4c41" sx={{ mb: 1, fontFamily: 'Merriweather, Georgia, serif', textShadow: '0 1px 4px #fffbe6' }}>{book.title}</Typography>
            <Typography variant="h6" color="#a98467" sx={{ fontFamily: 'Merriweather, Georgia, serif', mb: 1 }}>{book.author}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <StarIcon sx={{ color: '#ffb347', mr: 0.5 }} />
              <Typography variant="subtitle1" fontWeight={700}>{book.rating}</Typography>
            </Box>
            <Chip label={book.genre} sx={{ mt: 1, fontWeight: 600, background: '#ffb347', color: '#6d4c41' }} />
            <Typography variant="body1" sx={{ color: '#a98467', fontFamily: 'Merriweather, Georgia, serif', mt: 2 }}>{book.summary}</Typography>
          </Paper>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2, color: '#b08968', fontFamily: 'Merriweather, Georgia, serif', textShadow: '0 1px 4px #fffbe6' }}>Reviews</Typography>
          {reviews.length === 0 ? <Typography>No reviews yet.</Typography> : (
            reviews.map((review, idx) => (
              <Paper key={idx} sx={reviewCardStyle}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Rating value={review.rating} readOnly max={5} sx={{ color: '#ffb347' }} />
                  <Typography variant="subtitle2" color="#b08968">{review.userId?.name || 'Anonymous'}</Typography>
                </Box>
                <Typography sx={{ color: '#6d4c41', fontFamily: 'Merriweather, Georgia, serif' }}>{review.comment}</Typography>
              </Paper>
            ))
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, background: 'rgba(255,251,230,0.9)', borderRadius: 4, p: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#b08968', mb: 1, fontFamily: 'Merriweather, Georgia, serif' }}>Add a Review</Typography>
            <Rating
              name="rating"
              value={newReview.rating}
              onChange={(_, value) => setNewReview(r => ({ ...r, rating: value }))}
              max={5}
              sx={{ mb: 1, color: '#ffb347' }}
            />
            <TextField
              label="Comment"
              multiline
              minRows={2}
              value={newReview.comment}
              onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}
              fullWidth
              sx={{ mb: 1, background: '#fffbe6', borderRadius: 2 }}
            />
            <Button type="submit" variant="contained" disabled={submitting || !newReview.rating || !newReview.comment} sx={{ background: 'linear-gradient(90deg, #b08968 50%, #ffb347 100%)', color: '#fffbe6', fontWeight: 700, '&:hover': { background: 'linear-gradient(90deg, #ffb347 60%, #b08968 100%)', color: '#6d4c41' } }}>Submit Review</Button>
          </Box>
        </Box>
      </Fade>
      <Footer />
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
};

export default BookDetail;
