import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import './index.scss';

function Footer() {
  return (
    <Box
      component="footer"
      className='footer'
      sx={{
        padding: '20px 0',
        mt: 'auto', // Push the footer to the bottom of the viewport
      }}
    >
      <Box
        className='footer-container'
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
        }}
      >
        <Typography variant="body2" color="textSecondary">
          &copy; {new Date().getFullYear()} Marist Weather Dashboard
        </Typography>
        <Box className='mobile-hide'>
          <Link href="/terms" color="inherit" sx={{ mx: 1 }}>
            Terms and Conditions
          </Link>
          <Link href="/privacy" color="inherit" sx={{ mx: 1 }}>
            Privacy
          </Link>
          <Link href="/contact" color="inherit" sx={{ mx: 1 }}>
            Contact
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
