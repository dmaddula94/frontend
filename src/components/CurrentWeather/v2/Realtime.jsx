import React from 'react';
import Temp from "./Temp";
import WeatherIcon from "./WeatherIcon";
import { useSelector } from 'react-redux';

export default function Realtime({ realtime, isDay }) {
    const user = useSelector((state) => state.user.user);
    return (
        <div className="realtime">
            <div className="realtime-temp"><Temp value={realtime?.temperature} /></div>
            <div className="realtime-temp-degrees">{user.metric ? '°C' : '°F'}</div>
            <div>
                <div className="realtime-weather-code">{realtime?.weatherstate}</div>
                {/* <div className="realtime-feels-like">Feels Like <Temp value={realtime.intervals[0].values.temperatureApparent} />°</div> */}
            </div>
            <div className="realtime-icon">
                <WeatherIcon value={realtime?.weathercode} isDay={isDay} />
            </div>
        </div>
    );
}
