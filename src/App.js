import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setLocation, setError } from "./redux/reducers/locationSlice";
import { lightTheme, darkTheme } from "./theme";
import Header from "./components/Header";
import "./App.scss";
import { getLocation } from "./utils/location";
import CurrentWeather from "./components/CurrentWeather";

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
      <div
        style={{
          height: "100vh",
          backgroundImage: `url('/${weather.background}.gif')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
        }}
      >
        <div className="glassy-overlay"></div>
        <div
          style={{ position: "relative" }}
          className={`content ${theme.darkMode ? "dark-mode" : "light-mode"}`}
        >
          <Header />
          <div className="container">
            <CurrentWeather />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;