import React from "react";
import { formatDay, prettyPrintWeatherCode } from "../../utils/weather";
import Temp from "./Temp";
import WeatherIcon from "./WeatherIcon";

const DayForecast = ({ dayData, isDay, maxTemp, minTemp }) => {
  const calculatePercentage = (value, min, max) => {
    return ((value - min) / (max - min)) * 100;
  };

  const gradientPercentage = calculatePercentage(
    dayData.values.temperatureAvg,
    minTemp,
    maxTemp
  );

  return (
    <div className="day">
      <p key="day-time" className="day-time">
        {formatDay(dayData.time)}
      </p>
      <div key="day-icon" className="day-icon">
        <WeatherIcon value={dayData.values.weatherCodeMax} isDay={isDay} />
      </div>
      <p key="day-temp-min" className="day-temp">
        <Temp value={dayData.values.temperatureMin} />°
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
      {/* <div
        className="temperature-bar"
        style={{
          background: `linear-gradient(90deg, #9bdccc, 
                    ${gradientPercentage}%,
                    yellow ${gradientPercentage}%, 
                    red ${gradientPercentage + 1}%)`,
        }}
      ></div> */}
      <p key="day-temp-max" className="day-temp">
        <Temp value={dayData.values.temperatureMax} />°
      </p>
      <p key="day-description" className="day-description">
        {prettyPrintWeatherCode(dayData.values.weatherCodeMax)}
      </p>
    </div>
  );
};

export default function Daily({ daily, isDay }) {
  const maxTemp = Math.max(...daily.map((day) => day.values.temperatureMax));
  const minTemp = Math.min(...daily.map((day) => day.values.temperatureMin));
  return (
    <div key="daily" className="daily">
      {daily.map((day, index) => (
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
