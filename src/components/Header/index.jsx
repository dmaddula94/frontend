import React, { useRef, useState, useCallback } from "react";
import {
  ToggleButton,
  Fade,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { StandaloneSearchBox } from "@react-google-maps/api";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../redux/reducers/locationSlice";
import { setDarkMode } from "../../redux/reducers/themeSlice";
import { setBackground } from "../../redux/reducers/weatherSlice";
import { logout } from "../../redux/reducers/userSlice";
import "./index.scss";

function Header() {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location);
  const sys_theme = useTheme();
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchBoxRef = useRef();

  const onPlacesChanged = useCallback(() => {
    const places = searchBoxRef.current.getPlaces();
    const place = places[0];
    if (place) {
      const {
        name,
        geometry: { location },
      } = place;
      dispatch(
        setLocation({
          latitude: location.lat(),
          longitude: location.lng(),
          name: name,
        })
      );

      setSearchQuery(name);
    }
  }, []);

  const getCurrentLocation = () => {
    dispatch(setLocation(location.current));
    setSearchQuery(location.current.name);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const redirectToProfile = () => {
    dispatch(setBackground({ background: 'default' }));
    handleClose();
    navigate("/profile");
  };

  const handleLogout = () => {
    setAnchorEl(null);
    sessionStorage.clear();
    dispatch(logout());
  };


  const redirectToHomePage = () => {
    navigate("/")
  }

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
              cursor: isHomeRoute ? "auto" : "pointer"
            }}
          />
        </div>
        <div className="right-section">
          {user.isAuthenticated && (
            <div className="location-search">
              <StandaloneSearchBox
                onLoad={(ref) => (searchBoxRef.current = ref)}
                onPlacesChanged={onPlacesChanged}
              >
                <TextField
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Location"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          style={{ color: sys_theme.palette.text.primary }}
                        />
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="end">
                        <LocationSearchingIcon
                          style={{
                            cursor: "pointer",
                            color: sys_theme.palette.text.primary,
                          }}
                          onClick={getCurrentLocation}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </StandaloneSearchBox>
            </div>
          )}
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
                  <MenuItem onClick={redirectToProfile}>Profile</MenuItem>
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
                style={{
                  borderRadius: "50%",
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
