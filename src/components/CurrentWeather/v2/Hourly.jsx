import React from "react";
import { Box } from '@mui/material';
import { formatTime } from "../../../utils/weather";
import Temp from "./Temp";
import WeatherIcon from "./WeatherIcon";

export default function Hourly({ hourly, isDay }) {

  return (
    <Box className="hourly-container" sx={{ display: 'flex', overflowX: 'auto' }}>
      {hourly?.map((hour, index) => (
        <Box key={index} className="hour">
          <div className="aspect-ratio-box">
            <div className="aspect-ratio-box-content">
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
          </div>
        </Box>
      ))}
    </Box>
  );
}