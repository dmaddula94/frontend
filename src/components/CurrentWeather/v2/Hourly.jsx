import React from "react";
import { Box } from "@mui/material";
import { formatTime, formatDate } from "../../../utils/weather";
import Temp from "./Temp";
import WeatherIcon from "./WeatherIcon";

export default function Hourly({ hourly, isDay }) {
  const isStartOfDay = (day) => {
    const date = new Date(day);
    return date.getHours() === 0 && date.getMinutes() === 0;
  };

  return (
    <Box
      className="hourly-container"
      sx={{ display: "flex", overflowX: "auto" }}
    >
      {hourly?.map((hour, index) => (
        <Box key={index} className="hour">
          <div className="aspect-ratio-box">
            <div className="aspect-ratio-box-content">
              <div style={{ fontWeight: isStartOfDay(hour.time) ? "bold" : "normal", fontSize: isStartOfDay(hour.time) ? "16px" : "12px" }} key="hour-time" className="hour-time">
                {`${isStartOfDay(hour.time) ? formatDate(hour.time) : formatTime(hour.time)}`}
              </div>
              <div key="hour-icon" className="hour-icon">
                <WeatherIcon value={hour.weathercode} isDay={isDay} />
              </div>
              <div key="hour-temp" className="hour-temp">
                <Temp value={Math.round(hour.temperature_2m)} />°
              </div>
            </div>
          </div>
        </Box>
      ))}
    </Box>
  );
}
