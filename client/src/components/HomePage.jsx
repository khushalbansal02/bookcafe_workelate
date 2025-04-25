import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Avatar, Button, Fade, Tooltip, Chip } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import Footer from './Footer';
import AnimatedBookBackground from './AnimatedBookBackground';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useNavigate } from 'react-router-dom';

const bookAvatarAnim = {
  transition: 'transform 0.5s cubic-bezier(0.4,1.7,0.7,0.9)',
  boxShadow: 3,
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.08)',
    boxShadow: 8,
  },
};

const bookCardStyle = {
  borderRadius: 5,
  boxShadow: 8,
  cursor: 'pointer',
  transition: '0.3s',
  background: 'linear-gradient(120deg, #ede0d4 60%, #fffbe6 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 320,
  maxHeight: 320,
  minWidth: 240,
  maxWidth: 240,
  margin: 'auto',
  '&:hover': {
    boxShadow: 16,
    transform: 'scale(1.04)',
    background: 'linear-gradient(120deg, #ffb347 60%, #ffe5b4 100%)',
  },
  animation: 'fadeInUp 1.9s',
};

const bookAvatarCafe = {
  width: 90,
  height: 90,
  bgcolor: '#b08968',
  boxShadow: 4,
  ...bookAvatarAnim,
};

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/books')
      .then(res => res.json())
      .then(data => setBooks(data.books || []));
  }, []);

  const trendingBooks = [...books].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <Box sx={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'transparent', pb: 0, overflow: 'hidden' }}>
      <AnimatedBookBackground />
      <Container maxWidth="lg" sx={{ pt: 8, pb: 4, position: 'relative', zIndex: 1 }}>
        <Fade in timeout={700}>
          <Paper elevation={6} sx={{ p: { xs: 2, md: 6 }, borderRadius: 6, mb: 6, background: 'linear-gradient(100deg, #ede0d4 60%, #fffbe6 100%)', textAlign: 'center', boxShadow: '0 4px 32px #b0896833', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Tooltip title="Welcome to BookCafe!" placement="top" arrow>
                <Avatar sx={{ bgcolor: '#b08968', width: 70, height: 70, mb: 2, ...bookAvatarAnim }}>
                  <BookIcon sx={{ fontSize: 40, color: '#ffb347' }} />
                </Avatar>
              </Tooltip>
              <Typography variant="h3" fontWeight={900} color="#6d4c41" sx={{ mb: 1, letterSpacing: 1, fontFamily: 'Merriweather, Georgia, serif', animation: 'fadeInUp 1.1s', textShadow: '0 2px 8px #fffbe6, 0 1px 0 #b08968' }}>BookCafe</Typography>
              <Typography variant="h5" fontWeight={600} color="#a98467" sx={{ mb: 2, fontFamily: 'Merriweather, Georgia, serif', animation: 'fadeInUp 1.5s', textShadow: '0 1px 4px #fffbe6' }}>A Cozy Place to Read, Sip, and Share</Typography>
              <Button variant="contained" size="large" href="/books" sx={{ mt: 2, borderRadius: 3, fontWeight: 700, px: 4, py: 1.5, fontSize: 18, background: 'linear-gradient(90deg, #b08968 50%, #ffb347 100%)', color: '#fffbe6', boxShadow: 3, '&:hover': { background: 'linear-gradient(90deg, #ffb347 60%, #b08968 100%)', color: '#6d4c41', transform: 'scale(1.07)' }, animation: 'fadeInUp 1.8s', textShadow: '0 1px 4px #fffbe6' }}>Browse Books</Button>
            </Box>
            <style>{`
              @keyframes fadeInUp {
                0% { opacity: 0; transform: translateY(40px); }
                100% { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </Paper>
        </Fade>
        <Fade in timeout={1000}>
          <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 5, mb: 5, background: 'linear-gradient(90deg, #fffbe6 60%, #ede0d4 100%)', boxShadow: '0 2px 16px #b0896833', position: 'relative', overflow: 'hidden' }}>
            <Typography variant="h4" fontWeight={700} color="#6d4c41" sx={{ mb: 3, textAlign: 'center', fontFamily: 'Merriweather, Georgia, serif', animation: 'fadeInUp 1.2s', textShadow: '0 1px 4px #fffbe6' }}>Trending Books</Typography>
            <Grid container spacing={4} justifyContent="center">
              {trendingBooks.map(book => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={book._id} display="flex" justifyContent="center">
                  <Tooltip title={`Read more about ${book.title}`} arrow>
                    <Box sx={bookCardStyle} onClick={() => navigate(`/books/${book._id}`)}>
                      <Avatar sx={bookAvatarCafe}>
                        <BookIcon sx={{ fontSize: 60, color: '#ffb347' }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight={700} align="center" sx={{ fontFamily: 'Merriweather, Georgia, serif', color: '#6d4c41', mt: 2, mb: 1, textShadow: '0 1px 4px #fffbe6' }}>{book.title}</Typography>
                      <Typography variant="body2" color="#a98467" align="center" sx={{ fontFamily: 'Merriweather, Georgia, serif', mb: 1, fontSize: 16, textShadow: '0 1px 4px #fffbe6' }}>{book.author}</Typography>
                      <Typography variant="caption" color="#ffb347" sx={{ fontWeight: 600, fontSize: 15 }}>Rating: {book.rating}</Typography>
                    </Box>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Fade>
        <Fade in timeout={1200}>
          <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 5, background: 'linear-gradient(90deg, #ede0d4 60%, #fffbe6 100%)', boxShadow: '0 2px 16px #b0896833', position: 'relative', overflow: 'hidden' }}>
            <Typography variant="h4" fontWeight={700} color="#6d4c41" sx={{ mb: 3, textAlign: 'center', fontFamily: 'Merriweather, Georgia, serif', animation: 'fadeInUp 1.2s', textShadow: '0 1px 4px #fffbe6' }}>Featured Books</Typography>
            <Grid container spacing={4} justifyContent="center">
              {books.slice(0, 6).map(book => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={book._id} display="flex" justifyContent="center">
                  <Tooltip title={`Read more about ${book.title}`} arrow>
                    <Box sx={bookCardStyle} onClick={() => navigate(`/books/${book._id}`)}>
                      <Avatar sx={{ ...bookAvatarCafe, bgcolor: '#ffb347' }}>
                        <BookIcon sx={{ fontSize: 40, color: '#6d4c41' }} />
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#6d4c41', fontFamily: 'Merriweather, Georgia, serif', textShadow: '0 1px 4px #fffbe6', mt: 2 }}>
                        {book.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#a98467', fontFamily: 'Merriweather, Georgia, serif', textShadow: '0 1px 4px #fffbe6', mb: 1 }}>
                        {book.author}
                      </Typography>
                      <Chip label={book.genre} sx={{ mt: 1, fontWeight: 600, background: '#ffb347', color: '#6d4c41' }} />
                    </Box>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Fade>
      </Container>
      <Footer />
    </Box>
  );
};

export default HomePage;
