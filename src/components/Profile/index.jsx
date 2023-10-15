import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProfileInfo from "./ProfileInfo";
import FavoriteList from "./FavoriteList";
import api from "../../api";
import { addHours } from "../../utils/weather";
import { getTimelineData, isDayTime } from "../../utils/weather";

import "./index.scss";

const now = new Date();
const startTime = now.toISOString();
const endTime = addHours({ date: now, hours: 1 }).toISOString();

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
    const [user, setUser] = useState(null);
    const [realtimeResponse, setRealtimeResponse] = useState([]);
    const [isDayList, setIsDayList] = React.useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getUserData = async () => {
        const email = sessionStorage.getItem("email")
        return await api.get(`/user?email=${email}`);
    }

    const getTimeline = async (lat, lon) => {
        try {
            const resp = await getTimelineData(
                lat,
                lon,
                startTime,
                endTime,
            );
            setRealtimeResponse([...realtimeResponse, resp.data.timelines[1]])
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const getIsDay = async (lat, lon) => {
        setIsDayList([...isDayList, await isDayTime(lat, lon)]);
    };

    useEffect(() => {
        getUserData().then((response) => {
            setUser(response);
            response.data.locations.forEach((list) => {
                getIsDay(list.latitude, list.longitude);
                getTimeline(list.latitude, list.longitude);
            })
        })
    }, []);

    console.log("realtimeResponse", realtimeResponse);
    console.log("isDayList", isDayList)

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
                {user && <ProfileInfo user={user.data} />}
            </TabPanel>
            <TabPanel value={value} index={1} style={{ width: "50%" }}>
                {user && <FavoriteList
                    user={user.data}
                    realtimeResponse={realtimeResponse}
                    isDayList={isDayList}
                />}
            </TabPanel>
        </Box>
    );
};

export default Profile;
