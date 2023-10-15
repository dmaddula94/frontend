/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from "react";
import Realtime from "./Realtime";
import Hourly from "./Hourly";
import Daily from "./Daily";
import PlaceIcon from "@mui/icons-material/Place";
import { getWeatherData } from "../../../utils/openmeteo";
import IconButton from "@mui/material/IconButton";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OpacityIcon from "@mui/icons-material/Opacity";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import { Typography } from "@mui/material";
import api from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { setFavoriteLocationsList } from "../../../redux/reducers/weatherSlice";
import { updateLocations } from "../../../redux/reducers/userSlice";
import { Box } from "@mui/material";
import { animated, useSpring } from "react-spring";

const now = new Date();

function FavoriteButton() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const location = useSelector((state) => state.location);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  const isLocationAddedToList = () => {
    const { locations } = user.user;
    const isLocationAdded = locations.find((list) => {
      if (list.name === location.name) {
        return true;
      }
    });
    return isLocationAdded ? true : false;
  };

  const addToFavoriteList = async () => {
    const { name, latitude, longitude } = location;
    const response = await api.post("/userLocation", {
      email: user.user.email,
      location: {
        name,
        latitude,
        longitude,
      },
    });
    setIsFavorite(!isFavorite);
    setIsButtonDisabled(true);
    dispatch(updateLocations({ user: response.data }));
    dispatch(
      setFavoriteLocationsList({
        favoriteLocationsList: {
          name,
          latitude,
          longitude,
        },
      })
    );
  };

  React.useEffect(() => {
    const isAdded = isLocationAddedToList();
    setIsFavorite(isAdded);
    setIsButtonDisabled(isAdded);
  }, [location.latitude, location.longitude]);

  return (
    <IconButton disabled={isButtonDisabled}>
      {isFavorite ? (
        <FavoriteIcon />
      ) : (
        <FavoriteBorderIcon onClick={addToFavoriteList} />
      )}
    </IconButton>
  );
}

function Weather({ lat, lon, location }) {
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });
  const [realtimeResponse, setRealtimeResponse] = React.useState(null);
  const [dailyResponse, setDailyResponse] = React.useState(null);
  const [hourlyResponse, setHourlyResponse] = React.useState(null);
  const [currentHourData, setCurrentHourData] = React.useState({});

  function getCurrentHourlyData(data) {
    // Get the current date and hour
    const currentDate = new Date();
    const currentHour = currentDate.toISOString().substring(0, 13) + ":00";

    // Search for the hourly data for the current hour
    for (let i = 0; i < data.length; i++) {
      if (data[i].time === currentHour) {
        return data[i];
      }
    }

    // If no data is found for the current hour, return null
    return null;
  }

  const weatherData = async (lat, lon) => {
    try {
      const response = await getWeatherData({ latitude: lat, longitude: lon });
      setRealtimeResponse(response.current_weather);
      setHourlyResponse(response.hourly);
      setDailyResponse(response.daily);
      setCurrentHourData(getCurrentHourlyData(response.hourly));
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  useEffect(() => {
    if (lat && lon) {
      weatherData(lat, lon);
    }
  }, [lat, lon]);

  function metersToMiles(meters) {
    const conversionFactor = 1 / 1609.344;
    return Math.round(meters * conversionFactor);
  }

  const getUVIndexLabel = (uvIndex) => {
    if (uvIndex <= 3) {
      return "Low";
    } else if (uvIndex <= 6) {
      return "Moderate";
    } else if (uvIndex <= 9) {
      return "High";
    } else {
      return "Very High / Extreme";
    }
  };

  return (
    <>
      <div className="weather">
        {/* {realtimeResponse && hourlyResponse && dailyResponse && (
          <>
            <div className="glassbackground current-weather col-5">
              <div className="time">{now.toDateString()}</div>
              <div
                className="location"
                style={{ display: "flex", alignItems: "center" }}
              >
                <PlaceIcon
                  width="16"
                  height="16"
                  style={{ marginRight: "4px" }}
                />
                {location}
              </div>
              <Realtime
                realtime={realtimeResponse}
                isDay={realtimeResponse?.is_day}
              />
              <div className="divider" />
              <Hourly
                hourly={hourlyResponse}
                isDay={realtimeResponse?.is_day}
              />
            </div>
            <div className="glassbackground current-weather col-5">
              <Daily daily={dailyResponse} isDay={realtimeResponse?.is_day} />
            </div>
          </>
        )} */}

        {realtimeResponse && hourlyResponse && dailyResponse && (
          <Box className="weather row">
            <div className="left-section col-5">
              <div className="glassbackground current-weather">
                <div
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  className="d-flex"
                >
                  <div className="time">{now.toDateString()}</div>
                  <FavoriteButton />
                </div>
                <div
                  className="location"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <PlaceIcon
                    width="16"
                    height="16"
                    style={{ marginRight: "4px" }}
                  />
                  {location}
                </div>
                <Realtime
                  realtime={realtimeResponse}
                  isDay={realtimeResponse?.is_day}
                />
                <div className="divider" />
                <div className="forcast">
                  <ScheduleIcon style={{ marginRight: "5px" }} />
                  12-hour forcast
                </div>
                <Hourly
                  hourly={hourlyResponse}
                  isDay={realtimeResponse?.is_day}
                />
              </div>

              <div style={{ display: "flex", gap: "4px", textAlign: "center" }}>
                <div className="glassbackground current-weather col-4">
                  <Typography
                    variant="h6"
                    style={{ marginBottom: "12px", textAlign: "center" }}
                  >
                    <Brightness5Icon />
                    <p>UV Index</p>
                  </Typography>
                  <animated.div style={props}>
                    <Typography>{`${
                      currentHourData?.uv_index
                    } - ${getUVIndexLabel(
                      currentHourData?.uv_index
                    )}`}</Typography>
                    <Typography variant="subtitle1"></Typography>
                  </animated.div>
                </div>
                <div className="glassbackground current-weather col-4">
                  <Typography
                    variant="h6"
                    style={{ marginBottom: "12px", textAlign: "center" }}
                  >
                    <VisibilityIcon />
                    <p>Visibility</p>
                  </Typography>
                  <animated.div style={props}>
                    <Typography>{`${metersToMiles(
                      currentHourData?.visibility
                    )} mi`}</Typography>
                  </animated.div>
                </div>
                <div className="glassbackground current-weather col-4">
                  <Typography
                    variant="h6"
                    style={{ marginBottom: "12px", textAlign: "center" }}
                  >
                    <OpacityIcon />
                    <p>Percipitation</p>
                  </Typography>
                  <animated.div style={props}>
                    <Typography>{currentHourData?.precipitation}</Typography>
                  </animated.div>
                </div>
              </div>
            </div>
            <div className="right-section col-5">
              <div className="glassbackground current-weather">
                <Daily daily={dailyResponse} hourly={hourlyResponse} isDay={realtimeResponse?.is_day} />
              </div>
            </div>
          </Box>
        )}
      </div>
    </>
  );
}

export default Weather;
