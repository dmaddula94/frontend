import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProfileInfo from "./ProfileInfo";
import FavoriteList from "./FavoriteList";
import api from "../../api";
import {getCurrentData} from "../../utils/openmeteo";

import "./index.scss";
import { useSelector } from "react-redux";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const Profile = () => {
    const [value, setValue] = useState(0);
    const user = useSelector((state) => state.user.user);
    const [userData, setUserData] = useState(null);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getUserData = async () => {
        try {
            const response = JSON.parse(JSON.stringify(user));
            response.locations = await getLocationWeatherData(response.locations);
            setUserData(response);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    const getLocationWeatherData = async (locations) => {
        const temp = await Promise.all(locations.map(async (loc) => {
            const data = await getTimeline(loc.latitude, loc.longitude);
            return {
                ...loc, 
                ...data
            };
        }));
    
        return temp;
    }

    const getTimeline = async (lat, lon) => {
        try {
            const resp = await getCurrentData(
                {
                    latitude: lat,
                    longitude: lon
                }
            );
            return resp.current_weather;
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    useEffect(() => {
        getUserData();
    }, [user]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" >
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="disabled tabs example"
            >
                <Tab label="Profile" />
                <Tab label="Favorite List" />
            </Tabs>
            <TabPanel value={value} index={0} style={{ width: "50%" }}>
                {userData && <ProfileInfo user={userData} />}
            </TabPanel>
            <TabPanel value={value} index={1} style={{ width: "50%" }}>
                {userData && <FavoriteList
                    user={userData}
                />}
            </TabPanel>
        </Box>
    );
};

export default Profile;
