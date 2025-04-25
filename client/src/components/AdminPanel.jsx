import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, TextField, Grid, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookIcon from '@mui/icons-material/Book';
import Footer from './Footer';
import AnimatedBookBackground from './AnimatedBookBackground';
import { useNavigate } from 'react-router-dom';

// Updated admin credentials
const ADMIN_CREDENTIALS = { username: 'khus', password: 'khus' };

const adminPanelCardStyle = {
  borderRadius: 4,
  background: 'linear-gradient(100deg, #ede0d4 60%, #fffbe6 100%)',
  boxShadow: '0 4px 32px #b0896833',
  p: 4,
  position: 'relative',
  overflow: 'hidden',
  transition: '0.3s',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 8px 48px #ffb34766',
    background: 'linear-gradient(120deg, #ffb347 60%, #ffe5b4 100%)',
    transform: 'scale(1.04)',
  },
};

const AdminPanel = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [books, setBooks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', genre: '', rating: '', cover: '', summary: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/books')
      .then(res => res.json())
      .then(data => setBooks(data.books || []));
  }, []);

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === ADMIN_CREDENTIALS.username && loginForm.password === ADMIN_CREDENTIALS.password) {
      setLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleOpenDialog = (book = null) => {
    setEditBook(book);
    setForm(book ? { ...book, summary: book.summary || '' } : { title: '', author: '', genre: '', rating: '', cover: '', summary: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditBook(null);
    setForm({ title: '', author: '', genre: '', rating: '', cover: '', summary: '' });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrEditBook = async () => {
    if (editBook) {
      // Edit book: send PUT request to backend (not implemented here)
      // You can implement edit functionality as needed
      handleCloseDialog();
    } else {
      // Add book: POST to backend
      const res = await fetch('http://localhost:5000/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const newBook = await res.json();
        setBooks([newBook.book, ...books]);
      }
      handleCloseDialog();
    }
  };

  const handleDeleteBook = async (id) => {
    // Optionally, send DELETE request to backend
    setBooks(books.filter(b => b._id !== id));
  };

  if (!loggedIn) {
    return (
      <Box sx={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'transparent', pb: 0, overflow: 'hidden' }}>
        <AnimatedBookBackground />
        <Container maxWidth="xs" sx={{ mt: 8, position: 'relative', zIndex: 1 }}>
          <Paper elevation={4} sx={{ ...adminPanelCardStyle, p: 4 }}>
            <Typography variant="h5" align="center" gutterBottom sx={{ color: '#6d4c41', fontFamily: 'Merriweather, Georgia, serif', textShadow: '0 1px 4px #fffbe6' }}>Admin Login</Typography>
            <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField name="username" label="Username" value={loginForm.username} onChange={handleLoginChange} required fullWidth sx={{ bgcolor: '#fffbe6', borderRadius: 2 }} />
              <TextField name="password" label="Password" type="password" value={loginForm.password} onChange={handleLoginChange} required fullWidth sx={{ bgcolor: '#fffbe6', borderRadius: 2 }} />
              {loginError && <Typography color="error">{loginError}</Typography>}
              <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(90deg, #b08968 50%, #ffb347 100%)', color: '#fffbe6', fontWeight: 700, '&:hover': { background: 'linear-gradient(90deg, #ffb347 60%, #b08968 100%)', color: '#6d4c41' } }}>Login</Button>
            </Box>
          </Paper>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'transparent', pb: 0, overflow: 'hidden' }}>
      <AnimatedBookBackground />
      <Container maxWidth="md" sx={{ mt: 5, mb: 5, position: 'relative', zIndex: 1 }}>
        <Paper elevation={4} sx={adminPanelCardStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ color: '#6d4c41', fontFamily: 'Merriweather, Georgia, serif', textShadow: '0 1px 4px #fffbe6' }}>Admin Panel</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ background: 'linear-gradient(90deg, #b08968 50%, #ffb347 100%)', color: '#fffbe6', fontWeight: 700, '&:hover': { background: 'linear-gradient(90deg, #ffb347 60%, #b08968 100%)', color: '#6d4c41' } }}>Add Book</Button>
          </Box>
          <Grid container spacing={3}>
            {books.filter(book => book).map(book => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <Card sx={{ ...adminPanelCardStyle, borderRadius: 3, boxShadow: 4, background: 'linear-gradient(120deg, #fffbe6 70%, #ede0d4 100%)', color: '#6d4c41' }}
                  onClick={() => navigate(`/books/${book._id}`)}
                >
                  {(book.cover && book.cover !== '') ? (
                    <CardMedia component="img" height="140" image={book.cover} alt={book.title} sx={{ objectFit: 'cover', borderRadius: 3 }} />
                  ) : (
                    <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#ede0d4' }}>
                      <BookIcon sx={{ fontSize: 50, color: '#b08968' }} />
                    </Box>
                  )}
                  <CardContent>
                    <Typography variant="h6" sx={{ fontFamily: 'Merriweather, Georgia, serif', color: '#6d4c41', textShadow: '0 1px 4px #fffbe6' }}>{book.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#a98467', fontFamily: 'Merriweather, Georgia, serif', textShadow: '0 1px 4px #fffbe6' }}>{book.author}</Typography>
                    <Typography variant="caption">Genre: {book.genre}</Typography><br />
                    <Typography variant="caption">Rating: {book.rating}</Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: '#b08968' }} onClick={e => { e.stopPropagation(); handleOpenDialog(book); }}><EditIcon /></IconButton>
                      <IconButton size="small" sx={{ color: '#b08968' }} onClick={e => { e.stopPropagation(); handleDeleteBook(book._id); }}><DeleteIcon /></IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle sx={{ color: '#6d4c41', fontFamily: 'Merriweather, Georgia, serif', textShadow: '0 1px 4px #fffbe6' }}>{editBook ? 'Edit Book' : 'Add Book'}</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 320 }}>
              <TextField name="title" label="Title" value={form.title} onChange={handleFormChange} required fullWidth sx={{ bgcolor: '#fffbe6', borderRadius: 2 }} />
              <TextField name="author" label="Author" value={form.author} onChange={handleFormChange} required fullWidth sx={{ bgcolor: '#fffbe6', borderRadius: 2 }} />
              <TextField name="genre" label="Genre" value={form.genre} onChange={handleFormChange} required fullWidth sx={{ bgcolor: '#fffbe6', borderRadius: 2 }} />
              <TextField name="rating" label="Rating" type="number" value={form.rating} onChange={handleFormChange} required fullWidth inputProps={{ min: 0, max: 5, step: 0.1 }} sx={{ bgcolor: '#fffbe6', borderRadius: 2 }} />
              <TextField name="cover" label="Cover Image URL (optional)" value={form.cover} onChange={handleFormChange} fullWidth sx={{ bgcolor: '#fffbe6', borderRadius: 2 }} />
              <TextField name="summary" label="Summary" value={form.summary} onChange={handleFormChange} required fullWidth multiline minRows={2} sx={{ bgcolor: '#fffbe6', borderRadius: 2 }} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} sx={{ color: '#b08968', fontWeight: 700 }}>Cancel</Button>
              <Button onClick={handleAddOrEditBook} variant="contained" sx={{ background: 'linear-gradient(90deg, #b08968 50%, #ffb347 100%)', color: '#fffbe6', fontWeight: 700, '&:hover': { background: 'linear-gradient(90deg, #ffb347 60%, #b08968 100%)', color: '#6d4c41' } }}>{editBook ? 'Update' : 'Add'}</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default AdminPanel;
