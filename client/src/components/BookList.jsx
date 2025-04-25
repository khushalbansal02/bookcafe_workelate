import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Box, TextField, InputAdornment, MenuItem, Paper, Avatar, Chip, Fade, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarIcon from '@mui/icons-material/Star';
import BookIcon from '@mui/icons-material/Book';
import Footer from './Footer';
import AnimatedBookBackground from './AnimatedBookBackground';
import { useNavigate } from 'react-router-dom';

const bookAvatarAnim = {
  transition: 'transform 0.5s cubic-bezier(0.4,1.7,0.7,0.9)',
  boxShadow: 3,
  cursor: 'pointer',
  '&:hover': {
    transform: 'rotate(-8deg) scale(1.13)',
    boxShadow: 8,
    filter: 'drop-shadow(0 0 16px #ffb34788)',
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

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [genres, setGenres] = useState(['All']);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data.books);
        // Extract genres dynamically from books
        const genreSet = new Set(['All']);
        data.books.forEach(book => genreSet.add(book.genre));
        setGenres(Array.from(genreSet));
      });
  }, []);

  const filteredBooks = books.filter(book => {
    if (genre !== 'All' && book.genre !== genre) return false;
    if (search && !book.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCardClick = (id) => {
    navigate(`/books/${id}`);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'transparent', pb: 0, overflow: 'hidden' }}>
      <AnimatedBookBackground />
      <Container maxWidth="lg" sx={{ pt: 6, pb: 4, position: 'relative', zIndex: 1 }}>
        <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 5, mb: 4, background: 'linear-gradient(100deg, #fffbe6 60%, #ede0d4 100%)', boxShadow: '0 4px 32px #b0896833' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <MenuBookIcon sx={{ mr: 2, fontSize: 38, color: '#b08968' }} />
            <Typography variant="h4" fontWeight={800} sx={{ color: '#6d4c41', fontFamily: 'Merriweather, Georgia, serif', animation: 'fadeInUp 1.1s', textShadow: '0 1px 4px #fffbe6' }}>Book Explorer</Typography>
          </Box>
          <Typography variant="h6" sx={{ color: '#a98467', mb: 3, fontFamily: 'Merriweather, Georgia, serif', animation: 'fadeInUp 1.5s', textShadow: '0 1px 4px #fffbe6' }}>
            Find your next read from our curated selection of trending, classic, and modern books.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              placeholder="Search by title or author"
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 2, minWidth: 200, bgcolor: '#ede0d4', borderRadius: 2, animation: 'fadeInUp 1.7s' }}
            />
            <TextField
              select
              label="Genre"
              value={genre}
              onChange={e => setGenre(e.target.value)}
              sx={{ flex: 1, minWidth: 120, bgcolor: '#ede0d4', borderRadius: 2, animation: 'fadeInUp 1.7s' }}
            >
              {genres.map(g => (
                <MenuItem value={g} key={g}>{g}</MenuItem>
              ))}
            </TextField>
            <Chip label={`${filteredBooks.length} books`} sx={{ fontWeight: 700, background: '#ffb347', color: '#6d4c41', animation: 'fadeInUp 1.7s' }} />
          </Box>
        </Paper>
        <Fade in timeout={700}>
          {filteredBooks.length === 0 ? (
            <Typography align="center" sx={{ mt: 8, color: '#b08968', fontSize: 24, fontWeight: 700 }}>
              No books found.
            </Typography>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {filteredBooks.map(book => (
                <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
                  <Card sx={bookCardStyle} onClick={() => handleCardClick(book._id)}>
                    <Avatar sx={bookAvatarCafe}>
                      <MenuBookIcon fontSize="large" />
                    </Avatar>
                    <CardContent>
                      <Typography variant="h5" sx={{ color: '#6d4c41', fontWeight: 700, fontFamily: 'Merriweather, Georgia, serif', mb: 1 }}>
                        {book.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#a98467', fontFamily: 'Merriweather, Georgia, serif', mb: 1, fontSize: 16, textShadow: '0 1px 4px #fffbe6' }}>
                        by {book.author}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1, mb: 0.5 }}>
                        <StarIcon sx={{ color: '#ffb347', mr: 0.5 }} />
                        <Typography variant="subtitle1" fontWeight={700}>{book.rating}</Typography>
                      </Box>
                      <Chip label={book.genre} sx={{ mt: 1, fontWeight: 600, background: '#ffb347', color: '#6d4c41' }} />
                      <Typography variant="body2" sx={{ color: '#a98467', fontFamily: 'Merriweather, Georgia, serif', mt: 2 }}>
                        {book.summary}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Fade>
      </Container>
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

export default BookList;
