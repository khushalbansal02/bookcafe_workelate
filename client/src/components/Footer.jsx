import React from 'react';
import { Box, Typography, Link, Grid, Stack, Divider } from '@mui/material';

const footerLinks = [
  {
    title: 'Company',
    items: [
      { label: 'About us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Interest Based Ads', href: '#' },
      { label: 'Ad Preferences', href: '#' },
      { label: 'Help', href: '#' },
      { label: 'Work with us', href: '#' },
    ],
  },
  {
    title: 'Authors',
    items: [
      { label: 'Advertise', href: '#' },
      { label: 'Authors & ads blog', href: '#' },
    ],
  },
  {
    title: 'Connect',
    items: [
      { label: 'Goodreads on Facebook', href: '#' },
      { label: 'Goodreads on Twitter', href: '#' },
      { label: 'Goodreads on Instagram', href: '#' },
      { label: 'Goodreads on LinkedIn', href: '#' },
    ],
  },
  {
    title: 'Download',
    items: [
      { label: 'Download app for iOS', href: '#' },
      { label: 'Download app for Android', href: '#' },
    ],
  },
];

const Footer = () => (
  <Box
    component="footer"
    sx={{
      mt: 10,
      pt: 6,
      pb: 3,
      px: { xs: 2, md: 8 },
      background: 'linear-gradient(90deg, #b08968 70%, #ede0d4 100%)',
      color: '#2d1507',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      boxShadow: 6,
      zIndex: 10,
      position: 'relative',
      backdropFilter: 'blur(2px)',
    }}
  >
    <Grid container spacing={4} justifyContent="center">
      {footerLinks.map((section) => (
        <Grid item xs={12} sm={6} md={3} key={section.title}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, color: '#a98467', letterSpacing: 1 }}>
            {section.title}
          </Typography>
          <Stack spacing={0.5}>
            {section.items.map(link => (
              <Link key={link.label} href={link.href} underline="hover" color="#2d1507" fontSize={15} sx={{ opacity: 0.94, letterSpacing: 0.2, '&:hover': { color: '#6d4c41' } }}>
                {link.label}
              </Link>
            ))}
          </Stack>
        </Grid>
      ))}
    </Grid>
    <Divider sx={{ my: 3, bgcolor: 'rgba(78,52,46,0.15)' }} />
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
      <Typography variant="body2" sx={{ fontWeight: 700, opacity: 0.96, color: '#2d1507', letterSpacing: 0.2 }}>
        {new Date().getFullYear()} BookReview. All rights reserved by khushal bansal.
      </Typography>
      <Link href="#" underline="hover" color="#2d1507" fontWeight={700} fontSize={15} sx={{ opacity: 0.94, letterSpacing: 0.2, '&:hover': { color: '#b08968' } }}>
        Mobile version
      </Link>
    </Stack>
  </Box>
);

export default Footer;
