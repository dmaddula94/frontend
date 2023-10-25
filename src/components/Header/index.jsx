import React, { useState } from "react";
import {
  ToggleButton,
  Fade,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close"; // Close icon
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; // Arrow icon
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "../../redux/reducers/themeSlice";
import { logout } from "../../redux/reducers/userSlice";
import "./index.scss";
import Search from "../Search";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const redirectToProfile = () => {
    setIsMenuOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    sessionStorage.clear();
    dispatch(logout());
  };

  const handleDashboard = () => {
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleShowRoutes = () => {
    setIsMenuOpen(false);
    navigate("/show-routes");
  };

  const redirectToHomePage = () => {
    navigate("/");
  };

  const isHomeRoute = routeLocation.pathname === "/";

  return (
    <header className={`header ${theme.darkMode ? "dark" : "light"}`}>
      <div className="container">
        <div className="logo-container">
          <img
            src={`${theme.darkMode ? "/logo.svg" : "/logo-dark.svg"}`}
            alt="Marist Weather Dashboard Logo"
            className="logo mou"
            onClick={!isHomeRoute ? redirectToHomePage : () => null}
            style={{
              cursor: isHomeRoute ? "auto" : "pointer",
            }}
          />
        </div>
        <div className="right-section">
          {user.isAuthenticated && (
            <div className="location-search mobile-hide">
              <Search />
            </div>
          )}
          <div className="profile-and-theme">
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
                style={{
                  borderRadius: "50%",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                {theme.darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </ToggleButton>
            </Fade>
            <>
              <IconButton onClick={toggleMenu} className="menu-icon">
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
              >
                <div
                  style={{ width: isMenuOpen ? "100%" : "15%" }}
                  className="menu"
                >
                  <div className="close-icon">
                    <IconButton onClick={() => setIsMenuOpen(false)}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                  <List>
                    {user.isAuthenticated && (
                      <>
                        <ListItem
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                          button
                          onClick={redirectToProfile}
                        >
                          <ListItemText primary="Profile" />
                          <ListItemIcon>
                            <ChevronRightIcon />
                          </ListItemIcon>
                        </ListItem>
                        <Divider />
                        <ListItem
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                          button
                          onClick={handleLogout}
                        >
                          <ListItemText primary="Logout" />
                          <ListItemIcon>
                            <ChevronRightIcon />
                          </ListItemIcon>
                        </ListItem>
                        <Divider />
                      </>
                    )}
                    <ListItem
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      button
                      onClick={handleDashboard}
                    >
                      <ListItemText primary="Dashboard" />
                      <ListItemIcon>
                        <ChevronRightIcon />
                      </ListItemIcon>
                    </ListItem>
                    <Divider />
                    <ListItem
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      button
                      onClick={handleShowRoutes}
                    >
                      <ListItemText primary="Show Routes" />
                      <ListItemIcon>
                        <ChevronRightIcon />
                      </ListItemIcon>
                    </ListItem>
                  </List>
                </div>
              </Drawer>
            </>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
