import React from "react";
import { ToggleButton, Fade, Menu, MenuItem } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "../../redux/reducers/themeSlice";
import {logout} from "../../redux/reducers/userSlice";
import "./index.scss";

function Header() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
  };

  return (
    <header className={`header ${theme.darkMode ? "dark" : "light"}`}>
      <div className="container">
        <div className="logo-container">
          <img
            src={`${theme.darkMode ? "/logo.svg" : "/logo-dark.svg"}`}
            alt="Marist Weather Dashboard Logo"
            className="logo"
          />
        </div>
        <div className="right-section">
          {/* {user.isAuthenticated && (
            <nav className="navigation">
              <ul>
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="/contact">Contact Us</a>
                </li>
              </ul>
            </nav>
          )} */}
          <div className="profile-and-theme">
            {user.isAuthenticated && (
              <>
                <AccountCircleIcon
                  onClick={handleMenu}
                  className="profile-icon"
                />
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
            <Fade in={true} timeout={500}>
              <ToggleButton
                value="check"
                selected={theme.darkMode}
                onChange={() => {
                  dispatch(
                    setDarkMode({
                      darkMode: !theme.darkMode,
                    })
                  );
                }}
              >
                {theme.darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </ToggleButton>
            </Fade>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
