/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
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
import { animated, useSpring } from "@react-spring/web";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import { DateTime } from "luxon";
import tzlookup from "tz-lookup";
import { update } from "../../../redux/reducers/userSlice";
import { useSnackbar } from "notistack";

function FavoriteButton() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const location = useSelector((state) => state.location);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();


  // const [jiggleProps, setJiggle] = useSpring(() => ({
  //   rotation: 0,
  //   config: {
  //     tension: 2500,
  //     friction: 20
  //   }
  // }));

  // const startJiggle = () => {
  //   setJiggle({ rotation: 4, immediate: false });
  // };

  // const stopJiggle = () => {
  //   setJiggle({ rotation: 0, immediate: true });
  // };

  const [pulseProps, setPulse] = useSpring(() => ({
    scale: 1,
    config: {
      tension: 500, 
      friction: 20,   
    }
  }));

  React.useEffect(() => {
    if (pulseProps.scale.get() === 1.2) {
      setTimeout(() => {
        setPulse({ scale: 1 });
      }, 100);
    }
  }, [pulseProps.scale]);

  const triggerPulse = () => {
    setPulse({ scale: 1.2 });
  };

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
    try {
      const response = await api.post("/userLocation", {
        email: user.user.email,
        location: {
          name,
          latitude,
          longitude,
        },
      });
      enqueueSnackbar('Location Added!', { variant: 'success' });
      setIsFavorite(!isFavorite);
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
    } catch (error) {
      enqueueSnackbar('Error Adding Location', { variant: 'error' });
      console.error("Error Adding Location:", error);
    }
  };

  const getSelectedLocation = () => {
    const { locations } = user.user;
    const id = locations.find((list) => {
      if (list.name === location.name) {
        return list._id;
      }
    });
    return id ?? null;
  };

  const deleteLocation = async (location) => {
    const loc = getSelectedLocation();
    if (loc && loc._id) {
      try {
        const { data } = await api.patch("/userLocation", {
          _id: loc._id,
        });
        enqueueSnackbar('Location Deleted!', { variant: 'success' });
        dispatch(update({ user: data }));
        setIsFavorite(false);
        dispatch(
          setFavoriteLocationsList({ favoriteLocationsList: data.locations })
        );
      } catch (error) {
        enqueueSnackbar('Error Deleting Location', { variant: 'error' });
        console.error("Error Deleting Location:", error);
      }
    }
  };

  React.useEffect(() => {
    const isAdded = isLocationAddedToList();
    setIsFavorite(isAdded);
  }, [location.latitude, location.longitude]);

  return (
    <IconButton
      onClick={triggerPulse}
    >
      {isFavorite ? (
        <animated.div style={{ transform: pulseProps.scale.to(s => `scale(${s})`) }}>
          <FavoriteIcon onClick={deleteLocation} />
        </animated.div>
      ) : (
        <animated.div style={{ transform: pulseProps.scale.to(s => `scale(${s})`) }}>
          <FavoriteBorderIcon onClick={addToFavoriteList} />
        </animated.div>
      )}
    </IconButton>
  );
}

function Weather({ lat, lon, location }) {
  const user = useSelector((state) => state.user);
  const [realtimeResponse, setRealtimeResponse] = React.useState(null);
  const [dailyResponse, setDailyResponse] = React.useState(null);
  const [hourlyResponse, setHourlyResponse] = React.useState(null);
  const [currentHourData, setCurrentHourData] = React.useState({});
  const [fullData, setFullData] = React.useState({});
  const [time, setTime] = React.useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  const jiggle = () => ({
    transform: 'scale(1.1)', 
    config: { tension: 300, friction: 10 },
    onRest: () => {
      setJiggleAnim({
        transform: 'scale(1)',
        config: { tension: 300, friction: 10 }
      });
    }
  });

  const [jiggleAnim, setJiggleAnim] = useSpring(() => ({
    transform: 'scale(1)',
  }));

  useEffect(() => {
    setJiggleAnim(jiggle());
  }, []);

  function getCurrentHourlyData(data, lat, lon) {
    const timezone = tzlookup(lat, lon);
    const currentHour = DateTime.now()
      .setZone(timezone)
      .startOf("hour")
      .toISO();

    for (let i = 0; i < data.length; i++) {
      if (
        DateTime.fromISO(data[i].time, { zone: timezone }).toISO() ===
        currentHour
      ) {
        return data[i];
      }
    }
    return null;
  }

  function getCurrentDayRemainingHourlyData(data, lat, lon) {
    const timezone = tzlookup(lat, lon);
    const currentDate = DateTime.now().setZone(timezone).startOf("hour");
    const endOfDay = DateTime.now().setZone(timezone).endOf("day");
    const arr = data.filter((item) => {
      const itemDatetime = DateTime.fromISO(item.time, { zone: timezone });
      return itemDatetime >= currentDate && itemDatetime <= endOfDay;
    });

    return arr;
  }

  const weatherData = async (lat, lon) => {
    try {
      const response = await getWeatherData({ latitude: lat, longitude: lon });
      setFullData(response);
      setRealtimeResponse(response.current_weather);
      setHourlyResponse(
        getCurrentDayRemainingHourlyData(response.hourly, lat, lon)
      );
      setDailyResponse(response.daily);
      setCurrentHourData(getCurrentHourlyData(response.hourly, lat, lon));
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  useEffect(() => {
    if (lat && lon) {
      weatherData(lat, lon);
      getCurrentDateTimeForLocation(lat, lon);
    }
  }, [lat, lon]);

  function metersToMiles(meters) {
    const conversionFactor = 1 / 1609.344;
    return Math.round(meters * conversionFactor);
  }

  function metersToKm(meters) {
    return Math.round(meters / 1000);
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

  const getCurrentDateTimeForLocation = (lat, lon, set = true) => {
    const timezone = tzlookup(lat, lon);
    const dateTime = DateTime.now().setZone(timezone);
    const formattedDateTime = dateTime.toLocaleString(
      DateTime.DATE_MED_WITH_WEEKDAY
    );
    if (set) setTime(formattedDateTime);
    return formattedDateTime;
  };

  return (
    <>
      <div className="weather">
        {realtimeResponse && hourlyResponse && dailyResponse && (
          <Box className="weather row">
            <div className="left-section col-md-6">
              <div className="glassbackground current-weather">
                <div
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  className="d-flex"
                >
                  <div className="time">{time}</div>
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
                  hourly forecast
                </div>
                <Hourly
                  hourly={hourlyResponse}
                  isDay={realtimeResponse?.is_day}
                />
              </div>

              <div
                className="row"
                style={{
                  display: "flex",
                  gap: "4px",
                  textAlign: "center",
                  justifyContent: "space-around",
                }}
              >
                <div className="glassbackground current-weather col-5">
                  <Typography
                    variant="h6"
                    style={{ marginBottom: "12px", textAlign: "center" }}
                  >
                    <Brightness5Icon />
                    <p>UV Index</p>
                  </Typography>
                  <animated.div style={jiggleAnim}>
                    <Typography>{`${
                      currentHourData?.uv_index
                    } - ${getUVIndexLabel(
                      currentHourData?.uv_index
                    )}`}</Typography>
                    <Typography variant="subtitle1"></Typography>
                  </animated.div>
                </div>
                <div className="glassbackground current-weather col-5">
                  <Typography
                    variant="h6"
                    style={{ marginBottom: "12px", textAlign: "center" }}
                  >
                    <VisibilityIcon />
                    <p>Visibility</p>
                  </Typography>
                  <animated.div style={jiggleAnim}>
                    <Typography>{`${
                      user?.user?.metric
                        ? metersToKm(currentHourData?.visibility) + " km"
                        : metersToMiles(currentHourData?.visibility) + " mi"
                    }`}</Typography>
                  </animated.div>
                </div>
                <div className="glassbackground current-weather col-5">
                  <Typography
                    variant="h6"
                    style={{ marginBottom: "12px", textAlign: "center" }}
                  >
                    <OpacityIcon />
                    <p>Precipitation</p>
                  </Typography>
                  <animated.div style={jiggleAnim}>
                    <Typography>{currentHourData?.precipitation}</Typography>
                  </animated.div>
                </div>
                <div className="glassbackground current-weather col-5">
                  <Typography
                    variant="h6"
                    style={{ marginBottom: "12px", textAlign: "center" }}
                  >
                    <ThermostatIcon />
                    <p>Feels Like</p>
                  </Typography>
                  <animated.div style={jiggleAnim}>
                    <Typography>{`${Math.round(
                      currentHourData?.apparent_temperature
                    )}°`}</Typography>
                  </animated.div>
                </div>
              </div>
            </div>
            <div  className="right-section col-md-6">
              <div className="glassbackground current-weather">
                <div style={{ marginLeft: "10px" }} className="forcast">
                  <ScheduleIcon style={{ marginRight: "5px" }} />
                  16-day forecast
                </div>
                <Daily
                  daily={dailyResponse}
                  hourly={fullData.hourly}
                  isDay={realtimeResponse?.is_day}
                />
              </div>
            </div>
          </Box>
        )}
      </div>
    </>
  );
}

export default Weather;
