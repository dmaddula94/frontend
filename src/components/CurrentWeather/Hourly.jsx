import React from 'react';
import { Box, Typography, } from '@mui/material';
import { formatTime } from "../../utils/weather";
import Temp from "./Temp";
import WeatherIcon from './WeatherIcon';

export default function Hourly({ hourly, isDay }) {
    return (
        <Box sx={{ display: 'flex', overflowX: 'auto' }}>
            {hourly.intervals.map((hour, index) => (
                <Box key={index} className="hour">
                    <div className="aspect-ratio-box">
                        <div className="aspect-ratio-box-content">
                            <div key="hour-time" className="hour-time">{formatTime(hour.startTime)}</div>
                            <div key="hour-icon" className="hour-icon"><WeatherIcon value={hour.values.weatherCode} isDay={isDay} /></div>
                            <div key="hour-temp" className="hour-temp"><Temp value={hour.values.temperature} />°</div>
                            {/* <Typography variant="subtitle2">{formatTime(hour.startTime)}</Typography>
                            <WeatherIcon value={hour.values.weatherCode} isDay={isDay} />
                            <Typography variant="h6"><Temp value={hour.values.temperature} />°</Typography> */}
                        </div>
                    </div>
                </Box>
            ))}
        </Box>

        // <Box className="hourly" sx={{ display: 'flex', overflowX: 'auto' }}>
        //     {hourly.intervals.map((hour, index) => (
        //         <Box key={index} className="hour">
        //             <AspectRatio ratio= "1">
        //                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
        //                     <Typography variant="subtitle2">{formatTime(hour.startTime)}</Typography>
        //                     <WeatherIcon value={hour.values.weatherCode} isDay={isDay} />
        //                     <Typography variant="h6"><Temp value={hour.values.temperature} />°</Typography>
        //                 </Box>
        //             </AspectRatio>
        //         </Box>
        //     ))}
        // </Box>
        // <div key="hourly" className="hourly">
        //     {hourly.intervals.map((hour, index) => (
        //         <div key={index} className="hour">
        //             <div key="hour-time" className="hour-time">{formatTime(hour.startTime)}</div>
        //             <div key="hour-icon" className="hour-icon"><WeatherIcon value={hour.values.weatherCode} isDay={isDay} /></div>
        //             <div key="hour-temp" className="hour-temp"><Temp value={hour.values.temperature} />°</div>
        //         </div>
        //     ))}
        // </div>
    );
}
