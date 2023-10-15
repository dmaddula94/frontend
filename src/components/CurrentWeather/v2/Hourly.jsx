import React from "react";
import { formatTime } from "../../../utils/weather";
import Temp from "./Temp";
import WeatherIcon from "./WeatherIcon";
import { useHourlyWeather } from "../../../hooks/use-weather.hook";

function Loading() {
  return <div>Loading...</div>;
}

function Error() {
  return <div>Oops! Something went wrong :(</div>;
}

export default function Hourly({ hourly, isDay }) {
  // const [hourlyResponse, hourlyLoading, hourlyHasError] = useHourlyWeather({
  //   lat,
  //   lon,
  // });

  // if (hourlyLoading) {
  //   return <Loading />;
  // }

  // if (hourlyHasError) {
  //   return <Error />;
  // }

  return (
    <div key="hourly" className="hourly">
      {hourly?.map((hour, index) => (
        <div key={index} className="hour">
          <div key="hour-time" className="hour-time">
            {formatTime(hour.time)}
          </div>
          <div key="hour-icon" className="hour-icon">
            <WeatherIcon value={hour.weathercode} isDay={isDay} />
          </div>
          <div key="hour-temp" className="hour-temp">
            <Temp value={Math.round(hour.temperature_2m)} />°
          </div>
        </div>
      ))}
    </div>
  );
}
