import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Avatar, Grid, Paper, Divider, List, ListItem, ListItemAvatar, ListItemText, Chip, Button, Rating, TextField, Autocomplete
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Footer from './Footer';
import AnimatedBookBackground from './AnimatedBookBackground';
import { useNavigate } from 'react-router-dom';

const profileCardStyle = {
  borderRadius: 4,
  background: 'linear-gradient(100deg, #ede0d4 60%, #fffbe6 100%)',
  boxShadow: '0 4px 32px #b0896833',
  p: { xs: 2, md: 5 },
  position: 'relative',
  overflow: 'hidden',
};

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [newReview, setNewReview] = useState({ bookId: '', book: '', author: '', rating: 0, comment: '' });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', bio: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [books, setBooks] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/books')
      .then(res => res.json())
      .then(data => setBooks(data.books || []));
  }, []);

  useEffect(() => {
    if (!userId) {
      setCreatingProfile(true);
      setUser(null);
      setUserReviews([]);
      setProfileForm({ name: '', bio: '', email: '' });
      return;
    }
    fetch(`http://localhost:5000/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!data || data.error) {
          setCreatingProfile(true);
          setUser(null);
          setUserReviews([]);
          setProfileForm({ name: '', bio: '', email: '' });
        } else {
          setUser(data);
          let enrichedReviews = Array.isArray(data.reviews) ? data.reviews.map(r => {
            if (r.bookId && r.bookId.title) {
              return r;
            } else {
              const bookInfo = books.find(b => b._id === (r.bookId?._id || r.bookId));
              return {
                ...r,
                bookId: bookInfo ? { _id: bookInfo._id, title: bookInfo.title, author: bookInfo.author } : r.bookId
              };
            }
          }) : [];
          setUserReviews(enrichedReviews);
          setProfileForm({
            name: data?.name || '',
            bio: data?.bio || '',
            email: data?.email || ''
          });
          setCreatingProfile(false);
        }
      });
  }, [userId, editingProfile, books]);

  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (e, value) => {
    setNewReview({ ...newReview, rating: value });
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async () => {
    setSubmitting(true);
    let response, data, newUserId;
    if (creatingProfile) {
      response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileForm.name, bio: profileForm.bio, email: profileForm.email })
      });
      data = await response.json();
      if (data && data.user && data.user._id) {
        localStorage.setItem('userId', data.user._id);
        newUserId = data.user._id;
        setUser(data.user);
        setUserReviews([]);
        setCreatingProfile(false);
      }
    } else {
      response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      data = await response.json();
      setUser(data);
      setProfileForm({ name: data.name, bio: data.bio, email: data.email });
    }
    setEditingProfile(false);
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('http://localhost:5000/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId: newReview.bookId,
        rating: newReview.rating,
        comment: newReview.comment,
        userId
      })
    });
    if (res.ok) {
      const review = await res.json();
      setUserReviews([review, ...userReviews]);
      setNewReview({ bookId: '', book: '', author: '', rating: 0, comment: '' });
    }
    setSubmitting(false);
  };

  function getFavoriteGenre(reviews) {
    if (!reviews.length) return null;
    const genreCount = {};
    reviews.forEach(r => {
      if (r.bookId && r.bookId.genre) {
        genreCount[r.bookId.genre] = (genreCount[r.bookId.genre] || 0) + 1;
      }
    });
    let max = 0, fav = null;
    for (const g in genreCount) if (genreCount[g] > max) { max = genreCount[g]; fav = g; }
    return fav;
  }

  function getAverageRating(reviews) {
    if (!reviews.length) return 0;
    return (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(2);
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'transparent', pb: 0, overflow: 'hidden' }}>
      <AnimatedBookBackground />
      <Container maxWidth="md" sx={{ mt: 5, mb: 5, position: 'relative', zIndex: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2, color: '#b08968', fontWeight: 700, background: 'rgba(255, 235, 205, 0.7)', borderRadius: 2 }}>
          Back
        </Button>
        {creatingProfile ? (
          <Paper elevation={4} sx={profileCardStyle}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#b08968', fontFamily: 'Merriweather, Georgia, serif' }}>Create Your Profile</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                name="name"
                label="Name"
                value={profileForm.name}
                onChange={handleProfileChange}
                required
                fullWidth
                sx={{ bgcolor: '#fffbe6', borderRadius: 2 }}
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                required
                fullWidth
                sx={{ bgcolor: '#fffbe6', borderRadius: 2 }}
              />
              <TextField
                name="bio"
                label="Bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                multiline
                minRows={2}
                fullWidth
                sx={{ bgcolor: '#fffbe6', borderRadius: 2 }}
              />
              <Button variant="contained" onClick={handleProfileSave} disabled={submitting} sx={{ background: 'linear-gradient(90deg, #b08968 50%, #ffb347 100%)', color: '#fffbe6', fontWeight: 700 }}>
                {submitting ? 'Creating...' : 'Create Profile'}
              </Button>
            </Box>
          </Paper>
        ) : user && (
          <Paper elevation={4} sx={profileCardStyle}>
            {/* Profile Header Section */}
            <Paper elevation={4} sx={{
              background: 'linear-gradient(90deg, #b08968 70%, #ede0d4 100%)',
              borderTopLeftRadius: 24, borderTopRightRadius: 24,
              boxShadow: 6, mb: 2, pt: 4, pb: 4, px: { xs: 2, md: 6 },
              color: '#fffbe6',
            }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={user?.avatar}
                      alt={user?.name || ''}
                      sx={{ width: 120, height: 120, margin: '0 auto', mb: 2, bgcolor: '#fffbe6', color: '#b08968', fontSize: 48, boxShadow: 4 }}
                    >
                      {user?.name && user.name.length > 0 ? user.name[0] : <BookIcon />}
                    </Avatar>
                  </Box>
                  {editingProfile ? (
                    <>
                      <TextField name="name" label="Name" value={profileForm.name} onChange={handleProfileChange} required fullWidth sx={{ bgcolor: '#fffbe6', borderRadius: 2, mb: 1 }} />
                      <TextField name="email" label="Email" type="email" value={profileForm.email} onChange={handleProfileChange} required fullWidth sx={{ bgcolor: '#fffbe6', borderRadius: 2, mb: 1 }} />
                      <TextField name="bio" label="Bio" value={profileForm.bio} onChange={handleProfileChange} multiline minRows={2} fullWidth sx={{ bgcolor: '#fffbe6', borderRadius: 2, mb: 2 }} />
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1 }}>
                        <Button variant="contained" onClick={handleProfileSave} disabled={submitting} sx={{ background: 'linear-gradient(90deg, #b08968 50%, #ffb347 100%)', color: '#fffbe6', fontWeight: 700 }}>
                          {submitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button variant="outlined" onClick={() => setEditingProfile(false)} sx={{ borderColor: '#fffbe6', color: '#fffbe6', fontWeight: 700 }}>
                          Cancel
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#6d4c41', fontFamily: 'Merriweather, Georgia, serif', textShadow: '0 1px 4px #fffbe6' }}>{user.name}</Typography>
                      <Typography variant="body2" sx={{ color: '#fffbe6', fontFamily: 'Merriweather, Georgia, serif', textShadow: '0 1px 4px #b08968' }}>{user.email || 'No email set'}</Typography>
                      <Typography variant="body2" sx={{ color: '#fffbe6', fontFamily: 'Merriweather, Georgia, serif', textShadow: '0 1px 4px #b08968', mt: 1 }}>{user.bio}</Typography>
                      <Chip label={`Joined ${user.joined || ''}`} sx={{ mt: 1, background: '#ffb347', color: '#6d4c41', fontWeight: 600 }} />
                      <Box sx={{ mt: 2 }}>
                        <Button variant="outlined" startIcon={<EditIcon />} sx={{ borderColor: '#fffbe6', color: '#fffbe6', fontWeight: 700, '&:hover': { borderColor: '#ffb347', color: '#ffb347' } }} onClick={() => setEditingProfile(true)}>
                          Edit Profile
                        </Button>
                      </Box>
                    </>
                  )}
                </Grid>
                <Grid item xs={12} md={8}>
                  {/* Profile Stats */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Chip icon={<BookmarkIcon />} label={`Reviews: ${userReviews.length}`} sx={{ fontWeight: 600, background: '#ede0d4', color: '#6d4c41' }} />
                    <Chip icon={<StarIcon />} label={`Avg Rating: ${getAverageRating(userReviews)}`} sx={{ fontWeight: 600, background: '#fffbe6', color: '#b08968' }} />
                    {getFavoriteGenre(userReviews) && <Chip icon={<FavoriteIcon />} label={`Fav Genre: ${getFavoriteGenre(userReviews)}`} sx={{ fontWeight: 600, background: '#ffb347', color: '#6d4c41' }} />}
                    {userReviews.length >= 10 && <Chip icon={<EmojiEventsIcon />} label="Top Reviewer" sx={{ fontWeight: 600, background: '#b08968', color: '#fffbe6' }} />}
                  </Box>
                  <Divider sx={{ mb: 2, bgcolor: 'rgba(176,137,104,0.15)' }} />
                </Grid>
              </Grid>
            </Paper>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#b08968', fontFamily: 'Merriweather, Georgia, serif', textShadow: '0 1px 4px #fffbe6' }}>
              Your Review History
            </Typography>
            {/* Enhanced Review History */}
            <List dense sx={{ mb: 3, maxHeight: 300, overflowY: 'auto', border: '1px solid #ede0d4', borderRadius: 2, background: '#fffbe6' }}>
              {userReviews.length === 0 && <Typography>No reviews yet. Add your first review below!</Typography>}
              {userReviews.map((review, idx) => (
                <ListItem alignItems="flex-start" key={idx} secondaryAction={
                  review.bookId && review.bookId._id ? (
                    <Button variant="text" size="small" sx={{ color: '#b08968', fontWeight: 600 }} onClick={() => navigate(`/books/${review.bookId._id}`)}>View Book</Button>
                  ) : null
                }>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#ffb347', color: '#6d4c41' }}>{user?.name ? user.name[0] : <BookIcon />}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography fontWeight={600} sx={{ color: '#6d4c41', fontFamily: 'Merriweather, Georgia, serif', textShadow: '0 1px 4px #fffbe6' }}>{review.bookId && review.bookId.title ? review.bookId.title : 'Unknown Book'}</Typography>
                        <Typography variant="caption" sx={{ color: '#a98467', fontFamily: 'Merriweather, Georgia, serif', ml: 1 }}>{review.bookId && review.bookId.author ? review.bookId.author : ''}</Typography>
                        <Rating value={review.rating} readOnly size="small" sx={{ ml: 1, color: '#ffb347' }} icon={<StarIcon fontSize="inherit" />} />
                        <Typography variant="caption" sx={{ color: '#a98467', fontFamily: 'Merriweather, Georgia, serif', ml: 1 }}>{review.date ? (new Date(review.date)).toLocaleDateString() : ''}</Typography>
                      </Box>
                    }
                    secondary={<span style={{ color: '#6d4c41', fontFamily: 'Merriweather, Georgia, serif' }}>{review.comment}</span>}
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2, bgcolor: 'rgba(176,137,104,0.15)' }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#b08968', fontFamily: 'Merriweather, Georgia, serif' }}>Submit a New Review</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, background: 'rgba(255,251,230,0.9)', borderRadius: 4, p: 3, boxShadow: 2 }}>
              <Autocomplete
                options={books}
                getOptionLabel={option => option.title + ' - ' + option.author}
                value={books.find(b => b._id === newReview.bookId) || null}
                onChange={(e, value) => setNewReview({ ...newReview, bookId: value ? value._id : '', book: value ? value.title : '', author: value ? value.author : '' })}
                renderInput={(params) => (
                  <TextField {...params} label="Book" required fullWidth variant="outlined" sx={{ bgcolor: '#fffbe6', borderRadius: 2 }} />
                )}
              />
              <Rating
                name="rating"
                value={newReview.rating}
                onChange={handleRatingChange}
                icon={<StarIcon fontSize="inherit" />} sx={{ color: '#ffb347' }} />
              <TextField
                name="comment"
                label="Your review"
                multiline
                minRows={2}
                value={newReview.comment}
                onChange={handleReviewChange}
                required
                fullWidth
                variant="outlined"
                sx={{ bgcolor: '#fffbe6', borderRadius: 2 }}
              />
              <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(90deg, #b08968 50%, #ffb347 100%)', color: '#fffbe6', fontWeight: 700, '&:hover': { background: 'linear-gradient(90deg, #ffb347 60%, #b08968 100%)', color: '#6d4c41' } }} disabled={submitting || !newReview.rating || !newReview.comment || !newReview.bookId}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </Box>
          </Paper>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default UserProfile;
