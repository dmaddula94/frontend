import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close'; // Close icon
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; // Arrow icon
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from '../../redux/reducers/themeSlice';
import { logout } from '../../redux/reducers/userSlice';
import './index.scss';
import Search from '../Search';
import {
  getHourlyData,
  getWeatherAlertsHTML,
  getWeatherInsightsHTML,
} from '../../utils/openmeteo';

let alertIntervalId = null;
let insightIntervalId = null;
function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [alertTxt, setAlertTxt] = useState('Enable Alerts');
  const [isAlertsEnabled, setIsAlertsEnabled] = useState(false);
  const [alertPref, setAlertPref] = useState(null);
  const [insightTxt, setInsightTxt] = useState('Enable Insights');
  const [isInsightsEnabled, setIsInsightsEnabled] = useState(false);
  const WEATHER_ALERTS_INTERVAL_MILLIS = 900000; // 10 sec
  const WEATHER_INSIGHTS_INTERVAL_MILLIS = 300000; // 10 sec
  const location = useSelector((state) => {
    return state.location;
  });
  const fetchWeatherAlerts = async () => {
    let weatherHTML = await getWeatherAlertsHTML(location);
    let preferences = window.localStorage.getItem("preferences");
    if(preferences) {
      preferences = JSON.parse(preferences);
    }
    if(!weatherHTML || weatherHTML?.toLocaleLowerCase().indexOf(preferences?.eap?.toLocaleLowerCase()) == -1){
      return;
    }
    const message = {
      type: 'weather-alert',
      data: weatherHTML,
    };
    window.postMessage(message, '*');
  };
  const fetchWeatherInsights = async () => {
    // let hourlyWeatherData = await getHourlyData(location);
    // console.log(hourlyWeatherData);
    let weatherHTML = await getWeatherInsightsHTML(location);
    const message = {
      type: 'weather-insight',
      data: weatherHTML,
    };

    window.postMessage(message, '*');
  };
  React.useEffect(() => {
    return () => {
      clearInterval(alertIntervalId);
      clearInterval(insightIntervalId);
    };
  }, []);
  React.useEffect(() => {
    console.log('user preferences changed');
    const handleMessage = (event) => {
      const message = event.data;
      if (message?.type === 'preferences') {
        let preferences = message.data;
        setAlertPref(preferences.eap)
        setIsAlertsEnabled(preferences.ea);
        if(preferences.ea){
          handleEnableAlerts(true);
        } else {
          handleEnableAlerts(false);
        }
        setIsInsightsEnabled(preferences.ei);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  const handleEnableAlerts = (forceStart, eap) => {
    if(forceStart === false){
      setIsAlertsEnabled(false);
      clearInterval(alertIntervalId);
      setAlertTxt('Enable Alerts');
      return;
    }
    if(forceStart === true) {
      setIsAlertsEnabled(true);
      setAlertTxt('Disable Alerts');
      clearInterval(alertIntervalId);
      alertIntervalId = setInterval(() => {
        fetchWeatherAlerts();
      }, WEATHER_ALERTS_INTERVAL_MILLIS);
      return;
    }
    if (isAlertsEnabled) {
      setIsAlertsEnabled(false);
      clearInterval(alertIntervalId);
      setAlertTxt('Enable Alerts');
    } else {
      setIsAlertsEnabled(true);
      setAlertTxt('Disable Alerts');
      clearInterval(alertIntervalId);
      alertIntervalId = setInterval(() => {
        fetchWeatherAlerts();
      }, WEATHER_ALERTS_INTERVAL_MILLIS);
    }
  };

  const handleEnableInsights = () => {
    if (isInsightsEnabled) {
      setIsInsightsEnabled(false);
      clearInterval(insightIntervalId);
      setInsightTxt('Enable Insights');
    } else {
      setIsInsightsEnabled(true);
      setInsightTxt('Disable Insights');
      clearInterval(insightIntervalId);
      insightIntervalId = setInterval(() => {
        fetchWeatherInsights();
      }, WEATHER_INSIGHTS_INTERVAL_MILLIS);
    }
  };

  useEffect(() => {
    if (user?.user?.insights) {
      clearInterval(insightIntervalId);
      insightIntervalId = setInterval(() => {
        fetchWeatherInsights();
      }, WEATHER_INSIGHTS_INTERVAL_MILLIS);
    } else {
      clearInterval(insightIntervalId);
    }
  }, [user?.user?.insights])

  useEffect(() => {
    if (user?.user?.alerts) {
      clearInterval(alertIntervalId);
      alertIntervalId = setInterval(() => {
        fetchWeatherAlerts();
      }, WEATHER_ALERTS_INTERVAL_MILLIS);
    } else {
      clearInterval(alertIntervalId);
    }
  }, [user?.user?.alerts])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const redirectToProfile = () => {
    setIsMenuOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    sessionStorage.clear();
    dispatch(logout());
  };

  const handleDashboard = () => {
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleShowRoutes = () => {
    setIsMenuOpen(false);
    navigate('/show-routes');
  };

  const redirectToHomePage = () => {
    navigate('/');
  };

  const isHomeRoute = routeLocation.pathname === '/';

  return (
    <header className={`header ${theme.darkMode ? 'dark' : 'light'}`}>
      <div className="container">
        <div className="logo-container">
          <img
            src={`${theme.darkMode ? '/logo.svg' : '/logo-dark.svg'}`}
            alt="Marist Weather Dashboard Logo"
            className="logo mou"
            onClick={!isHomeRoute ? redirectToHomePage : () => null}
            style={{
              cursor: isHomeRoute ? 'auto' : 'pointer',
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
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  border: 'none',
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
                  style={{ width: isMenuOpen ? '100%' : '15%' }}
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      button
                      onClick={handleShowRoutes}
                    >
                      <ListItemText primary="Show Routes" />
                      <ListItemIcon>
                        <ChevronRightIcon />
                      </ListItemIcon>
                    </ListItem>
                    <Divider />
                    <ListItem
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      button
                      onClick={() => navigate('/weather-history')}
                    >
                      <ListItemText primary="Weather History" />
                      <ListItemIcon>
                        <ChevronRightIcon />
                      </ListItemIcon>
                    </ListItem>
                    {/* <Divider />
                    <ListItem
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      button
                      onClick={handleEnableAlerts}
                    >
                      <ListItemText primary={alertTxt} />
                      <ListItemIcon>
                        <ChevronRightIcon />
                      </ListItemIcon>
                    </ListItem>
                    <Divider /> */}
                    {/* <ListItem
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      button
                      onClick={handleEnableInsights}
                    >
                      <ListItemText primary={insightTxt} />
                      <ListItemIcon>
                        <ChevronRightIcon />
                      </ListItemIcon>
                    </ListItem> */}
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
