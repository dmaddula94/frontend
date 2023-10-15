import React from "react";
import { formatDay, prettyPrintWeatherCode } from "../../../utils/weather";
import Temp from "./Temp";
import Hourly from "./Hourly";
import WeatherIcon from "./WeatherIcon";

function Loading() {
  return <div>Loading...</div>;
}

function Error() {
  return <div>Oops! Something went wrong :(</div>;
}

const DayForecast = ({
  dayData,
  isDay,
  maxTemp,
  minTemp,
  hourly,
  daySelected,
  openHourlyData,
}) => {
  const calculatePercentage = (value, min, max) => {
    return ((value - min) / (max - min)) * 100;
  };

  const gradientPercentage = calculatePercentage(
    dayData.temperature_2m_max, // updated
    minTemp,
    maxTemp
  );

  function getCurrentDayData(data, date = new Date().toISOString()) {
    const currentDate = new Date(date).toISOString().substring(0, 10);
    const arr = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].time.substring(0, 10) === currentDate) {
        arr.push(data[i]);
      }
    }
    return arr;
  }

  return (
    <>
      <div
        className="day"
        style={{ cursor: "pointer" }}
        onClick={() => openHourlyData(dayData.time)}
      >
        <p className="day-time">
          {new Date(dayData.time).toLocaleDateString("en-US", {
            // weekday: "short",
            day: "numeric",
            month: "numeric",
          }).toUpperCase()}{" "}
        </p>
        <div className="day-icon">
          <WeatherIcon value={dayData.weathercode} isDay={isDay} />{" "}
        </div>
        <p className="day-temp">
          <Temp value={dayData.temperature_2m_min} />°
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
          <Temp value={dayData.temperature_2m_max} />° {/* updated */}
        </p>
        <p className="day-description">
          {prettyPrintWeatherCode(dayData.weathercode)} {/* updated */}
        </p>
      </div>
      {daySelected === dayData.time && (
        <Hourly
          hourly={getCurrentDayData(hourly, dayData.time)}
          isDay={isDay}
        />
      )}
    </>
  );
};

export default function Daily({ daily, isDay, hourly }) {
  const [daySelected, setDaySelected] = React.useState("");

  const openHourlyData = (selectedDate) => {
    setDaySelected(selectedDate);
  };

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
          hourly={hourly}
          daySelected={daySelected}
          openHourlyData={openHourlyData}
        />
      ))}
    </div>
  );
}
