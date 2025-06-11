import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          UR Fit
        </Typography>
        <Box sx={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography>Home</Typography>
          </Link>
          <Link to="/challenges" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography>Challenges</Typography>
          </Link>
          {user ? (
            <Button onClick={onLogout} variant="outlined" size="small">
              Logout
            </Button>
          ) : location.pathname === '/signup' ? (
            <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>
              <Typography fontWeight="bold">Sign In</Typography>
            </Link>
          ) : location.pathname === '/login' ? (
            <Link to="/signup" style={{ textDecoration: 'none', color: 'black' }}>
              <Typography fontWeight="bold">Sign Up</Typography>
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>
                <Typography fontWeight="bold">Sign In</Typography>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none', color: 'black' }}>
                <Typography fontWeight="bold">Sign Up</Typography>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;