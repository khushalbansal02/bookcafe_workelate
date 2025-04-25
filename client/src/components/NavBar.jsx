import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Books', path: '/books' },
  { label: 'Profile', path: '/profile' },
  { label: 'Admin', path: '/admin' },
];

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{
      background: 'linear-gradient(90deg, #6d4c41 70%, #b08968 100%)',
      color: 'white',
      boxShadow: '0 4px 32px #6d4c4133',
      zIndex: 1200,
      backdropFilter: 'blur(2px)',
    }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, display: { md: 'none' } }} onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
        <MenuBookIcon sx={{ fontSize: 32, color: '#ffb347', mr: 1 }} />
        <Typography variant="h5" fontWeight={700} sx={{ flexGrow: 1, fontFamily: 'Merriweather, Georgia, serif', letterSpacing: 1, color: '#ffb347' }}>
          BookCafe
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {navItems.map((item) => (
            <Button key={item.label} color="inherit" sx={{ fontWeight: 700, fontSize: 16, fontFamily: 'Merriweather, Georgia, serif', color: 'white', '&:hover': { color: '#b08968', bgcolor: 'transparent' } }} onClick={() => handleNav(item.path)}>
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 220, background: '#6d4c41', height: '100%', color: 'white' }} role="presentation">
          <List>
            {navItems.map((item) => (
              <ListItem button key={item.label} onClick={() => handleNav(item.path)}>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default NavBar;
