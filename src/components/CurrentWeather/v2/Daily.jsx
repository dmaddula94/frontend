import React from "react";
import { formatDay, prettyPrintWeatherCode } from "../../../utils/weather";
import Temp from "./Temp";
import WeatherIcon from "./WeatherIcon";
import { useDailyWeather } from "../../../hooks/use-weather.hook";

function Loading() {
  return <div>Loading...</div>;
}

function Error() {
  return <div>Oops! Something went wrong :(</div>;
}

const DayForecast = ({ dayData, isDay, maxTemp, minTemp }) => {
  const calculatePercentage = (value, min, max) => {
    return ((value - min) / (max - min)) * 100;
  };

  const gradientPercentage = calculatePercentage(
    dayData.temperature_2m_max,  // updated
    minTemp,
    maxTemp
  );

  return (
    <div className="day">
      <p className="day-time">
        {new Date(dayData.time).toLocaleDateString('en-US', { weekday: 'long' })}  {/* updated */}
      </p>
      <div className="day-icon">
        <WeatherIcon value={dayData.weathercode} isDay={isDay} />  {/* updated */}
      </div>
      <p className="day-temp">
        <Temp value={dayData.temperature_2m_min} />°  {/* updated */}
      </p>
      <div
        className="temperature-bar"
        style={{
          background: `linear-gradient(90deg, #9bdccc ${
            gradientPercentage - 10
          }%, 
        #ffffed ${gradientPercentage}%, 
        #f1807e ${gradientPercentage + 10}%)`,
        }}
      ></div>
      <p className="day-temp">
        <Temp value={dayData.temperature_2m_max} />°  {/* updated */}
      </p>
      <p className="day-description">
        {prettyPrintWeatherCode(dayData.weathercode)}  {/* updated */}
      </p>
    </div>
  );
};


export default function Daily({ daily, isDay }) {
  // const [dailyResponse, dailyLoading, dailyHasError] = useDailyWeather({
  //   lat,
  //   lon,
  // });

  // if (dailyLoading) {
  //   return <Loading />;
  // }

  // if (dailyHasError) {
  //   return <Error />;
  // }
  const maxTemp = Math.max(...daily?.map((day) => day?.temperature_2m_max));
  const minTemp = Math.min(...daily?.map((day) => day?.temperature_2m_min));
  return (
    <div key="daily" className="daily">
      {daily?.map((day, index) => (
        <DayForecast
          key={index}
          dayData={day}
          isDay={isDay}
          maxTemp={maxTemp}
          minTemp={minTemp}
        />
        // <div key={index} className="day">
        //     <div key="day-time" className="day-time">
        //         {formatDay(day.time)}
        //     </div>
        //     <div key="day-icon" className="day-icon">
        //         {/* Using weatherCodeMax for icon, adjust as needed */}
        //         <WeatherIcon value={day.values.weatherCodeMax} isDay={isDay} />
        //     </div>
        //     <div key="day-temp" className="day-temp">
        //         {/* Using temperatureAvg for display, adjust as needed */}
        //         <Temp value={day.values.temperatureAvg} />°
        //     </div>
        //     <div key="day-description" className="day-description">
        //         {/* Using weatherCodeMax for description, adjust as needed */}
        //         {prettyPrintWeatherCode(day.values.weatherCodeMax)}
        //     </div>
        // </div>
      ))}
    </div>
  );
}
