import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getTimeZone } from "../../utils/openmeteo";
import { getLocation } from "../../utils/location";
import { useSelector } from "react-redux";
import WeatherHistory from "../WeatherHistory";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

const MAX_DATA_POINTS = 360;

const HistoricalDataGraphs = () => {
  const location = useSelector((state) => state.location);
  const [data, setData] = useState([
    {
      date: "2022-01-01",
      temperature2m: 25,
      rain: 10,
      windSpeed10m: 5,
      soilTemperature0To7cm: 15,
    },
    {
      date: "2023-01-02",
      temperature2m: 24,
      rain: 5,
      windSpeed10m: 8,
      soilTemperature0To7cm: 14,
    },
  ]);

  const [startDate, setStartDate] = useState(() => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    return lastYear.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  });
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const fetchData = async () => {
    try {
      let location = await getLocation();
      const today = new Date();
      const lastYear = new Date(today);
      lastYear.setFullYear(today.getFullYear() - 1);
      let lastYearStr = lastYear.toISOString().split("T")[0];
      let toddayStr = today.toISOString().split("T")[0];
      const weatherData = await getWeatherData(
        location.latitude,
        location.longitude,
        startDate,
        endDate
      );
      setData(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    const darkModeDiv = document.querySelector(".dark-mode");

    if (darkModeDiv) {
      darkModeDiv.style.backgroundImage = "none";
    }
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchData();
    }
  }, [location, startDate, endDate]);

  const range = (start, stop, step) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
  const getWeatherData = async (latitude, longitude, startDate, endDate) => {
    const params = {
      latitude,
      longitude,
      start_date: startDate,
      end_date: endDate,
      timezone: getTimeZone(),
      hourly: [
        "temperature_2m",
        "rain",
        "wind_speed_10m",
        "soil_temperature_0_to_7cm",
      ],
    };

    const url = `https://archive-api.open-meteo.com/v1/archive?${new URLSearchParams(
      params
    ).toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();

      const hourly = data.hourly;

      const weatherData = {
        time: hourly.time,
        temperature2m: hourly.temperature_2m,
        rain: hourly.rain,
        windSpeed10m: hourly.wind_speed_10m,
        soilTemperature0To7cm: hourly.soil_temperature_0_to_7cm,
      };

      const formattedData = [];

      const step = Math.floor(weatherData.time.length / MAX_DATA_POINTS)
      for (let i = 0; i < weatherData.time.length; i += step) {
        const date = weatherData.time[i];

        formattedData.push({
          date,
          temperature2m: weatherData.temperature2m[i],
          rain: weatherData.rain[i],
          windSpeed10m: weatherData.windSpeed10m[i],
          soilTemperature0To7cm: weatherData.soilTemperature0To7cm[i],
        });
      }

      return formattedData;
    } catch (error) {
      console.error("Error processing weather data:", error);
      throw error;
    }
  };

  //   getWeatherData(52.52, 13.41, '2023-10-30', '2023-11-13')
  //     .then((weatherData) => {
  //       console.log(weatherData);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching weather data:', error);
  //     });
  // Handle date change
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };
  return (
    <div>
      <h2>Weather Dashboard</h2>

      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => {
              setStartDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => {
              setEndDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
      </LocalizationProvider> */}

      <div style={{
        margin: '24px 0'
      }}>
        <TextField style={{ marginRight: '16px' }} type="date" label="Start Date" value={startDate} onChange={handleStartDateChange} />
        <TextField type="date" label="End Date" value={endDate} onChange={handleEndDateChange} />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{fill:"#8884d8"}} minTickGap={20}/>
          <YAxis tick={{fill:"#8884d8"}}/>
          <Tooltip labelStyle={{color:"#8884d8"}}/>
          <Legend />
          <Area
            type="monotone"
            dataKey="temperature2m"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{fill:"#82ca9d"}} minTickGap={20}/>
          <YAxis tick={{fill:"#82ca9d"}}/>
          <Tooltip labelStyle={{color:"#82ca9d"}}/>
          <Legend />
          <Area
            type="monotone"
            dataKey="rain"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
        </AreaChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{fill:"#ffc658"}} minTickGap={20}/>
          <YAxis tick={{fill:"#ffc658"}}/>
          <Tooltip labelStyle={{color:"#ffc658"}}/>
          <Legend />
          <Area
            type="monotone"
            dataKey="windSpeed10m"
            stroke="#ffc658"
            fill="#ffc658"
          />
        </AreaChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{fill:"#ff7300"}} minTickGap={20}/>
          <YAxis tick={{fill:"#ff7300"}}/>
          <Tooltip labelStyle={{color:"#ff7300"}}/>
          <Legend />
          <Area
            type="monotone"
            dataKey="soilTemperature0To7cm"
            stroke="#ff7300"
            fill="#ff7300"
          />
        </AreaChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <WeatherHistory />
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalDataGraphs;
