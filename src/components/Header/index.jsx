import React, { useRef, useCallback, useState } from "react";
import {
  ToggleButton,
  Fade,
  Menu,
  MenuItem,
  // TextField,
  // InputAdornment,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
// import { useTheme } from "@mui/material/styles";
// import SearchIcon from "@mui/icons-material/Search";
// import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
// import { StandaloneSearchBox } from "@react-google-maps/api";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
// import { setLocation } from "../../redux/reducers/locationSlice";
import { setDarkMode } from "../../redux/reducers/themeSlice";
import { setBackground } from "../../redux/reducers/weatherSlice";
import { logout } from "../../redux/reducers/userSlice";
import "./index.scss";
import Search from "../Search";

function Header() {
  const dispatch = useDispatch();
  // const location = useSelector((state) => state.location);
  // const sys_theme = useTheme();
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [searchQuery, setSearchQuery] = useState("");
  // const searchBoxRef = useRef();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  // const onPlacesChanged = useCallback(() => {
  //   const places = searchBoxRef.current.getPlaces();
  //   const place = places[0];
  //   if (place) {
  //     const {
  //       name,
  //       geometry: { location },
  //     } = place;
  //     dispatch(
  //       setLocation({
  //         latitude: location.lat(),
  //         longitude: location.lng(),
  //         name: name,
  //       })
  //     );

  //     setSearchQuery(name);
  //   }
  // }, []);

  // const getCurrentLocation = () => {
  //   dispatch(setLocation(location.current));
  //   setSearchQuery(location.current.name);
  // };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const redirectToProfile = () => {
    dispatch(setBackground({ background: "default" }));
    handleClose();
    navigate("/profile");
  };

  const handleLogout = () => {
    setAnchorEl(null);
    sessionStorage.clear();
    dispatch(logout());
  };
  const handleDashboard = () => {
    dispatch(setBackground({ background: "default" }));
    handleClose();
    navigate("/");
  };
  const handleShowRoutes = () => {
    dispatch(setBackground({ background: "default" }));
    handleClose();
    navigate("/show-routes");
  };

  const redirectToHomePage = () => {
    navigate("/");
  };

  const isHomeRoute = routeLocation.pathname === "/";

  return (
    <header className={`header ${theme.darkMode ? "dark" : "light"}`}>
      <div className="container">
        <div className={!isDesktop ? "logo-container" : "logo-container"}>
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
            <div  className="location-search mobile-hide">
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
                }}
              >
                {theme.darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </ToggleButton>
            </Fade>
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
                  <MenuItem onClick={redirectToProfile}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
                  <MenuItem onClick={handleShowRoutes}>Show Routes</MenuItem>
                </Menu>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
