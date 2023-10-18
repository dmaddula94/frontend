/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Realtime from "./Realtime";
import Hourly from "./Hourly";
import Daily from "./Daily";
import PlaceIcon from '@mui/icons-material/Place';
import IconButton from '@mui/material/IconButton';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Typography } from "@mui/material";
import { useTimeline, useForecast } from "../../hooks/use-weather.hook";
import { addHours, isDayTime } from "../../utils/weather";
import { Box } from "@mui/material";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { getHourlyData } from "../../utils/openmeteo";
import { animated, useSpring } from 'react-spring';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OpacityIcon from '@mui/icons-material/Opacity';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import { getTimelineData, getForecastData } from "../../utils/weather";
import { setFavoriteLocationsList } from "../../redux/reducers/weatherSlice";
import { updateLocations } from "../../redux/reducers/userSlice";
import api from "../../api";
// import "./AirQuality";

const now = new Date();
const startTime = now.toISOString();
const endTime = addHours({ date: now, hours: 12 }).toISOString();

function Loading() {
  return <div>Loading...</div>;
}

function Error() {
  return <div>Oops! Something went wrong :(</div>;
}

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
    })
    return isLocationAdded ? true : false;
  }

  const addToFavoriteList = async () => {
    const { name, latitude, longitude } = location;
    const response = await api.post('/userLocation', {
      email: user.user.email,
      location: {
        name,
        latitude,
        longitude
      }
    });
    setIsFavorite(!isFavorite);
    setIsButtonDisabled(true);
    dispatch(updateLocations({ user: response.data }))
    dispatch(setFavoriteLocationsList({
      favoriteLocationsList: {
        name,
        latitude,
        longitude
      }
    }))
  };

  React.useEffect(() => {
    const isAdded = isLocationAddedToList();
    setIsFavorite(isAdded)
    setIsButtonDisabled(isAdded)
  }, [location.latitude, location.longitude])

  return (
    <IconButton
      disabled={isButtonDisabled}
    >
      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon onClick={addToFavoriteList} />}
    </IconButton>
  );
}

function Weather({ lat, lon, location }) {
  const [isDay, setIsDay] = React.useState(true);
  const [currentHourData, setCurrentHourData] = React.useState({});
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });
  const [realtimeResponse, setRealtimeResponse] = React.useState(null);
  const [dailyResponse, setDailyResponse] = React.useState(null);
  const [hourlyResponse, setHourlyResponse] = React.useState(null);

  const getIsDay = async () => {
    setIsDay(await isDayTime(lat, lon));
  };

  React.useEffect(() => {
    if (lat && lon) {
      getIsDay();
    }
  }, [lat, lon]);

  // const [timelineResponse, timelineLoading, timelineHasError] = useTimeline({
  //   lat,
  //   lon,
  //   startTime,
  //   endTime,
  // });

  // const [forecastResponse, forecastLoading, forecastHasError] = useForecast({
  //   lat,
  //   lon
  // })

  // if (timelineLoading) {
  //   return <Loading />;
  // }

  // if (timelineHasError) {
  //   return <Error />;
  // }

  // if (forecastLoading) {
  //   return <Loading />;
  // }

  // if (forecastHasError) {
  //   return <Error />;
  // }

  // const realtimeResponse = timelineResponse.data.timelines[1];

  // const hourlyResponse = timelineResponse.data.timelines[0];

  // const dailyResponse = forecastResponse.timelines.daily;

  const getTimeline = async () => {
    try {
      const resp = await getTimelineData(
        lat,
        lon,
        startTime,
        endTime,
      );
      setRealtimeResponse(resp.data.timelines[1]);
      setHourlyResponse(resp.data.timelines[0]);

    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const getForecast = async () => {
    try {
      const resp = await getForecastData(lat, lon);
      setDailyResponse(resp.timelines.daily);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  function getCurrentHourlyData(data) {
    // Get the current date and hour
    const currentDate = new Date();
    const currentHour = currentDate.toISOString().substring(0, 13) + ":00";

    // Search for the hourly data for the current hour
    for (let i = 0; i < data.hourly.length; i++) {
      if (data.hourly[i].time === currentHour) {
        return data.hourly[i];
      }
    }

    // If no data is found for the current hour, return null
    return null;
  }

  function metersToMiles(meters) {
    const conversionFactor = 1 / 1609.344;
    return Math.round(meters * conversionFactor);
  }

  // Now currentHourlyData contains the hourly data for the current hour, or null if no data was found


  const getCurrentWeatherData = async () => {
    const weatherdata = await getHourlyData({ latitude: lat, longitude: lon });
    setCurrentHourData(getCurrentHourlyData(weatherdata));
  };

  React.useEffect(() => {
    if (lat && lon) {
      getCurrentWeatherData();
      getTimeline();
      getForecast();
    }
  }, [lat, lon]);

  const getUVIndexLabel = (uvIndex) => {
    if (uvIndex <= 3) {
      return 'Low';
    } else if (uvIndex <= 6) {
      return 'Moderate';
    } else if (uvIndex <= 9) {
      return 'High';
    } else {
      return 'Very High / Extreme';
    }
  };

  return (
    <>
      {
        realtimeResponse && hourlyResponse && dailyResponse && (
          <Box className="weather row">
            <div className="left-section col-5">
              <div className="glassbackground current-weather">
                <div style={{
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }} className="d-flex">
                  <div className="time">{now.toDateString()}</div>
                  <FavoriteButton />
                </div>
                <div className="location" style={{ display: 'flex', alignItems: 'center' }}>
                  <PlaceIcon width="16" height="16" style={{ marginRight: '4px' }} />
                  {location}
                </div>
                <Realtime realtime={realtimeResponse} isDay={isDay} />
                <div className="divider" />
                <div className="forcast">
                  <ScheduleIcon style={{ marginRight: '5px' }} />12-hour forcast
                </div>
                <Hourly hourly={hourlyResponse} isDay={isDay} />
              </div>

              <div style={{ display: 'flex', gap: '4px', textAlign: 'center' }}>
                <div className="glassbackground current-weather col-4">
                  <Typography variant="h6" style={{ marginBottom: '12px', textAlign: 'center' }}>
                    <Brightness5Icon />
                    <p>UV Index</p>
                  </Typography>
                  <animated.div style={props}>
                    <Typography>{`${currentHourData?.uv_index} - ${getUVIndexLabel(currentHourData?.uv_index)}`}</Typography>
                    <Typography variant="subtitle1"></Typography>
                  </animated.div>
                </div>
                <div className="glassbackground current-weather col-4">
                  <Typography variant="h6" style={{ marginBottom: '12px', textAlign: 'center' }}>
                    <VisibilityIcon />
                    <p>Visibility</p>
                  </Typography>
                  <animated.div style={props}>
                    <Typography>{`${metersToMiles(currentHourData?.visibility)} mi`}</Typography>
                  </animated.div>
                </div>
                <div className="glassbackground current-weather col-4">
                  <Typography variant="h6" style={{ marginBottom: '12px', textAlign: 'center' }}>
                    <OpacityIcon />
                    <p>Percipitation</p>
                  </Typography>
                  <animated.div style={props}>
                    <Typography>{currentHourData?.precipitation}</Typography>
                  </animated.div>
                </div>
              </div>

              {/* <div className="glassbackground current-weather">
          <div id="map"></div>
          </div> */}
            </div>
            <div className="right-section col-5">
              <div className="glassbackground current-weather">
                <Daily daily={dailyResponse} isDay={isDay} />
              </div>
            </div>

          </Box>
        )
      }
    </>
  );
}

export default Weather;
