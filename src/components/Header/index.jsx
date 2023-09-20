import React, { useEffect, useState } from 'react';
import {
    ToggleButton,
    Fade,
  } from "@mui/material";
  import Brightness4Icon from "@mui/icons-material/Brightness4";
  import Brightness7Icon from "@mui/icons-material/Brightness7";
  import { useDispatch, useSelector } from 'react-redux';
  import { setDarkMode } from '../../redux/reducers/themeSlice';
import './index.scss'; // Assuming you have a SCSS file for styling

function Header() {
    const dispatch = useDispatch();
    const theme = useSelector(state => state.theme);

    useEffect(() => {
        console.log(theme);
    }, [theme]);
  return (
    <header className={`header ${theme.darkMode ? 'dark' : 'light'}`}>
      <div className="logo-container">
        <img src={`${theme.darkMode ? '/logo.svg' : '/logo-dark.svg'}`} alt="Marist Weather Dashboard Logo" className="logo" />
      </div>
      <nav className="navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          {/* Add other navigation links as needed */}
        </ul>
      </nav>
      <div className="profile">
        <img src="/path-to-profile-pic.png" alt="Profile" className="profile-pic" />
        <span>Username</span> {/* Replace 'Username' with actual user's name or username */}
      </div>
      <Fade in={true} timeout={500}>
          <ToggleButton
            value="check"
            selected={theme.darkMode}
            onChange={() => {
              dispatch(setDarkMode({
                darkMode: !theme.darkMode
              }));
            }}
          >
            {theme.darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </ToggleButton>
        </Fade>
    </header>
  );
}

export default Header;
