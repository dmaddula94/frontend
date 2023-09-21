import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { setLocation, setError } from "./redux/reducers/locationSlice";
import { lightTheme, darkTheme } from "./theme";
import Header from "./components/Header";
import "./App.scss";
import { getLocation } from "./utils/location";
import CurrentWeather from "./components/CurrentWeather";
import Login from "./components/Login";
import Signup from "./components/Signup";

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const dispatch = useDispatch();
  // const location = useSelector(state => state.location);
  const theme = useSelector((state) => state.theme);
  const weather = useSelector((state) => state.weather);

  // const getLocationName = async (latitude, longitude, apiKey) => {
  //   if(!latitude || !longitude) {
  //     return;
  //   };
  //   const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  //   const response = await fetch(endpoint);
  //   const data = await response.json();

  //   if (data.status === "OK") {
  //     if (data.results && data.results.length > 0) {
  //       // Return the formatted address of the first result
  //       return data.results[0].formatted_address;
  //     }
  //   } else {
  //     throw new Error(data.error_message || "Failed to fetch location name");
  //   }
  // }

  // useEffect(() => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         getLocationName(latitude, longitude, process.env.MAP_KEY || 'AIzaSyCm8tykVzUw05yjP4qfvO9Qx69VH6miAAw').then((name) => {
  //           if (latitude && longitude && name) {
  //             dispatch(setLocation({
  //               latitude: latitude,
  //               longitude: longitude,
  //               name: name?.split(",")[1].trim()
  //             }));
  //           }
  //         }).then((error) => {
  //           console.log(error);
  //         });
  //       },
  //       (error) => {
  //         dispatch(setError(error.message));
  //       }
  //     );
  //   } else {
  //     dispatch(setError("Geolocation is not supported by this browser."));
  //   }
  // }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getLocation().then((loc) => {
      dispatch(setLocation(loc));
    });
  }, []);

  return (
    <ThemeProvider theme={theme.darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <div
          style={{
            height: "100vh",
            backgroundImage: `url('/${weather.background}.gif')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
          className={`${theme.darkMode ? "dark-mode" : "light-mode"}`}
        >
          <div className="glassy-overlay"></div>
          <div style={{ position: "relative" }} className={`content`}>
            <Header />
            <div className="container">
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <CurrentWeather />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
