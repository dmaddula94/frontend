import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PlaceIcon from '@mui/icons-material/Place';
import Realtime from "../CurrentWeather/Realtime";
import ClearIcon from '@mui/icons-material/Clear';
import WeatherIcon from "../CurrentWeather/WeatherIcon";
import api from "../../api";
import { setFavoriteLocationsList } from "../../redux/reducers/weatherSlice";
import { setLocation, setCurrentLocation } from "../../redux/reducers/locationSlice";

function FavoriteList({ user, realtimeResponse, isDayList }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { locations } = user;
    const weather = useSelector(state => state.weather);
    const [favLocations, setFavLocations] = useState(locations);

    const deleteLocation = async (location) => {
        const { data } = await api.patch('/userLocation', {
            "_id": location._id
        });
        setFavLocations(data.locations);
        dispatch(setFavoriteLocationsList({ favoriteLocationsList: data.location }));
    };

    const handleLocationClick = (location) => {
        const loc = {
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude
        }
        dispatch(setLocation(loc));
        dispatch(setCurrentLocation(loc));
        navigate("/", {
            state:
            {
                coOrdinates: {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            }
        });
    };

    console.log('weather', weather);
    console.log("locations", locations);
    return (
        <Box
            component={"div"}
            sx={{ padding: "20px", marginTop: "50px" }}
            className="d-flex flex-column justify-content-center glassbackground border-radius p-5"
        >
            {favLocations.length ? favLocations.map((location, i) => {
                return (
                    <Card sx={{ marginBottom: "10px" }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <CardContent sx={{ flex: '1 0 auto', cursor: 'pointer' }} onClick={() => handleLocationClick(location)}>
                                <div className="location" style={{ display: 'flex', alignItems: 'center' }}>
                                    <PlaceIcon width="16" height="16" style={{ marginRight: '4px' }} />
                                    {location.name}
                                    <div className='favorite-weather-icon'>
                                        <WeatherIcon
                                            value={realtimeResponse[i].intervals[0].values.weatherCode}
                                            isDay={isDayList[i]}
                                        />
                                    </div>
                                </div>
                                <Realtime
                                    realtime={realtimeResponse[i]}
                                    isDay={isDayList[i]}
                                    showWeatherIcon={false}
                                />
                            </CardContent>
                            <ClearIcon style={{ marginRight: '4%', cursor: 'pointer' }} onClick={() => deleteLocation(location)} />
                        </Box>
                    </Card >
                )
            }) :
                <Typography variant="h6" style={{ textAlign: 'center' }} >
                    You don't have any favorite locations.
                </Typography>
            }
        </Box >
    );
}

export default FavoriteList;
