import React, { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import {Typography, Button} from "@mui/material";
import { useSelector } from "react-redux";
import api from "../../api";
import { useDispatch } from "react-redux";
import { update } from "../../redux/reducers/userSlice";
import { useSnackbar } from "notistack";

function WeatherConfigurator() {
  const user = useSelector((state) => state?.user?.user);
  const [temperature, setTemperature] = useState([0, 30]);
  const [uvIndex, setUvIndex] = useState([0, 7]);
  const [precipitation, setPrecipitation] = useState([0, 50]);
  const [windSpeed, setWindSpeed] = useState([0, 25]);
  const [isMetric, setIsMetric] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
      if (user) {
          setIsMetric(user.metric);
        
          const {temperature, uvIndex, precipitation, windSpeed} = user.settings;

            if (user.metric) {
                setTemperature([temperature.minC, temperature.maxC]);
            } else {
                setTemperature([temperature.min, temperature.max]);
            }
            setUvIndex([uvIndex.min, uvIndex.max]);
            setPrecipitation([precipitation.min, precipitation.max]);
            setWindSpeed([windSpeed.min, windSpeed.max]);
      }
  }, [user]);

  const handleSave = async () => {
      try {
          const response = await api.patch('/user', {
            settings: {
                temperature: {
                    min: isMetric ? Math.round(temperature[0] * 9 / 5 + 32) : temperature[0],
                    max: isMetric ? Math.round(temperature[1] * 9 / 5 + 32) : temperature[1],
                    minC: isMetric ? temperature[0] : Math.round((temperature[0] - 32) * 5 / 9),
                    maxC: isMetric ? temperature[1] : Math.round((temperature[1] - 32) * 5 / 9),
                },
                uvIndex: {
                    min: uvIndex[0],
                    max: uvIndex[1],
                },
                precipitation: {
                    min: precipitation[0],
                    max: precipitation[1],
                },
                windSpeed: {
                    min: windSpeed[0],
                    max: windSpeed[1],
                }
            }
        });

        enqueueSnackbar("Profile Updated!", { variant: "success" });
        dispatch(update({ user: response.data }));
      } catch (error) {
          console.error('Error updating user:', error);
      }
  }

  const handleTemperatureChange = (event, newValue) => {
    setTemperature(newValue);
  };

  const handleUvIndexChange = (event, newValue) => {
    setUvIndex(newValue);
  };

  const handlePrecipitationChange = (event, newValue) => {
    setPrecipitation(newValue);
  };

  const handleWindSpeedChange = (event, newValue) => {
    setWindSpeed(newValue);
  };

  return (
    <Box>
      <div>
        <Typography gutterBottom>
          Temperature Range ({isMetric ? "°C" : "°F"}): {temperature[0]} to{" "}
          {temperature[1]}
        </Typography>
        <Slider
          value={temperature}
          onChange={handleTemperatureChange}
          valueLabelDisplay="auto"
          min={isMetric ? -30 : 0}
          max={isMetric ? 50 : 100}
        />
      </div>
      <div>
        <Typography gutterBottom>
          UV Index Range: {uvIndex[0]} to {uvIndex[1]}
        </Typography>
        <Slider
          value={uvIndex}
          onChange={handleUvIndexChange}
          valueLabelDisplay="auto"
          min={0}
          max={11}
        />
      </div>
      <div>
        <Typography gutterBottom>
          Precipitation Range (%): {precipitation[0]}% to {precipitation[1]}%
        </Typography>
        <Slider
          value={precipitation}
          onChange={handlePrecipitationChange}
          valueLabelDisplay="auto"
          min={0}
          max={100}
        />
      </div>
      <div>
        <Typography gutterBottom>
          Wind Speed Range (mph): {windSpeed[0]} to {windSpeed[1]}
        </Typography>
        <Slider
          value={windSpeed}
          onChange={handleWindSpeedChange}
          valueLabelDisplay="auto"
          min={0}
          max={100}
        />
      </div>
      <div>
        <Button style={{marginTop: 24}} variant="contained" onClick={handleSave}>
            Save
        </Button>
      </div>
    </Box>
  );
}

export default WeatherConfigurator;
