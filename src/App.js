import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lightTheme, darkTheme } from "./theme";
import Header from "./components/Header";
import "./App.scss";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Loader from "./Loader";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ChatBot from "./components/ChatBot";
import GoogleMapRoutes from "./components/GoogleMapRoutes";
import Notification from "./components/Notification";

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const theme = useSelector((state) => state.theme);
  const weather = useSelector((state) => state.weather);
  const [showChatbot, setShowChatbot] = React.useState(false);
  React.useEffect(() => {
    console.log("adding listener for weather alerts");
    const handleMessage = (event) => {
      const message = event.data;
      if(message?.type === "weather-alert"){
        setWeatherAlert(message.data);
        setShowWeatherAlert(true);
      }
      if(message?.type === "weather-insight"){
        setWeatherInsight(message.data);
        setShowWeatherInsight(true);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  

  React.useEffect(() => {
    document.body.className = ''; // Clear any existing classes
    document.body.classList.add(`${theme.darkMode ? "dark-mode" : "light-mode"}`); // Add the current theme as a class
  }, [theme]);
  const [showWeatherAlert, setShowWeatherAlert] = useState(false);
  const [showWeatherInsight, setShowWeatherInsight] = useState(false);
  const [weatherAlert, setWeatherAlert] = useState("");
  const [weatherInsight, setWeatherInsight] = useState("");
  const handleWeatherAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowWeatherAlert(false);
  };
  const handleWeatherInsightClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowWeatherInsight(false);
  };


  return (
    <ThemeProvider theme={theme.darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Loader />
        <div
          style={{
            height: "100vh",
            backgroundImage: `url('/backgrounds/${weather.background}.gif')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
          className={`${theme.darkMode ? "dark-mode" : "light-mode"}`}
        >
          <div className="glassy-overlay"></div>
          <div style={{ position: "relative" }} className={`content`}>
            <Header />
            {/* <ChatBot /> */}
            <div className="container">
            <Notification message={weatherAlert} open={showWeatherAlert} onClose={handleWeatherAlertClose}></Notification>
            <Notification message={weatherInsight} open={showWeatherInsight} onClose={handleWeatherInsightClose}></Notification>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/show-routes"
                  element={
                    <ProtectedRoute>
                     
                      <GoogleMapRoutes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
