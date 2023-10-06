import React from 'react';
import { formatTime } from "../../utils/weather";
import Temp from "./Temp";
import WeatherIcon from './WeatherIcon';

export default function Hourly({ hourly, isDay }) {
    return (
        <div key="hourly" className="hourly">
            {hourly.intervals.map((hour, index) => (
                <div key={index} className="hour">
                    <div key="hour-time" className="hour-time">{formatTime(hour.startTime)}</div>
                    <div key="hour-icon" className="hour-icon"><WeatherIcon value={hour.values.weatherCode} isDay={isDay} /></div>
                    <div key="hour-temp" className="hour-temp"><Temp value={hour.values.temperature} />°</div>
                </div>
            ))}
        </div>
    );
}
