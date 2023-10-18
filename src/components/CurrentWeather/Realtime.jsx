import React from 'react';
import Temp from "./Temp";
import WeatherIcon from "./WeatherIcon";
import { prettyPrintWeatherCode } from "../../utils/weather";

export default function Realtime({ realtime, isDay, showWeatherIcon = true }) {
    return (
        <div className="realtime">
            <div className="realtime-temp"><Temp value={realtime.intervals[0].values.temperature} /></div>
            <div className="realtime-temp-degrees">°F</div>
            <div>
                <div className="realtime-weather-code">{prettyPrintWeatherCode(realtime.intervals[0].values.weatherCode)}</div>
                <div className="realtime-feels-like">Feels Like <Temp value={realtime.intervals[0].values.temperatureApparent} />°</div>
            </div>
            <div className="realtime-icon">
                {showWeatherIcon && <WeatherIcon value={realtime.intervals[0].values.weatherCode} isDay={isDay} />}
            </div>
        </div>
    );
}
