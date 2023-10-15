/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from "react";
import Realtime from "./Realtime";
import Hourly from "./Hourly";
import Daily from "./Daily";
import PlaceIcon from "@mui/icons-material/Place";
import { useCurrentWeather } from "../../../hooks/use-weather.hook";
import { getWeatherData } from "../../../utils/openmeteo";

const now = new Date();

function Loading() {
  return <div>Loading...</div>;
}

function Error() {
  return <div>Oops! Something went wrong :(</div>;
}

function Weather({ lat, lon, location }) {
  const [realtimeResponse, setRealtimeResponse] = React.useState(null);
  const [dailyResponse, setDailyResponse] = React.useState(null);
  const [hourlyResponse, setHourlyResponse] = React.useState(null);
  // const [timelineResponse, timelineLoading, timelineHasError] = useTimeline({
  //   lat,
  //   lon,
  //   startTime,
  //   endTime,
  // });

  // const [currentResponse, currentLoading, currentHasError] = useCurrentWeather({
  //   lat,
  //   lon,
  // })

  // if (currentLoading) {
  //   return <Loading />;
  // }

  // if (currentHasError) {
  //   return <Error />;
  // }

  const weatherData = async (lat, lon) => {
    try {
      const response = await getWeatherData({ latitude: lat, longitude: lon });
      setRealtimeResponse(response.current_weather);
      setHourlyResponse(response.hourly);
      setDailyResponse(response.daily);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  useEffect(() => {
    if (lat && lon) {
      weatherData(lat, lon);
    }
  }, [lat, lon]);

  return (
    <>
      <div className="weather">
        {realtimeResponse && hourlyResponse && dailyResponse && (
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
        )}
      </div>
    </>
  );
}

export default Weather;
