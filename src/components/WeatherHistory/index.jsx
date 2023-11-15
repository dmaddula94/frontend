import React from "react";
import WeatherMap from "./WeatherMap";
import { Typography } from "@mui/material";
// import './history';

export default function WeatherHistory() {
    return (
        <div style={{ display: 'flex', gap: '20px', margin: '0 24px'}}>
            <div className="col-md-6 col-12">
                <Typography variant="h6">Precipitation</Typography>
                <WeatherMap DATA_FIELD={'precipitation'} />
            </div>
            <div className="col-md-6 col-12">
                <Typography variant="h6">Temperature</Typography>
                <WeatherMap DATA_FIELD={'temperature'} />
            </div>
            <div className="col-md-6 col-12">
                <Typography variant="h6">Cloud Cover</Typography>
                <WeatherMap DATA_FIELD={'cloudCover'} />
            </div>
        </div>
    )
}