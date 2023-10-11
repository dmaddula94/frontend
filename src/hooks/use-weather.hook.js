import { useFetch } from "./use-fetch.hook";
import { createUrl } from "../utils/helpers";
import timeline from "./mock_timeline.json";
import forecast from "./mock_forecast.json";
import {CODES,getCurrentWeatherBackground,formatObject} from "../utils/openmeteo";

const API_URL =
  "https://us-central1-marist-weather-dashboard.cloudfunctions.net/api/tomorrow";
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

const useTimeline = ({ lat, lon, startTime, endTime }) => {
  const url = createUrl({
    url: `${API_URL}/timelines`,
    query: {
      location: `${lat},${lon}`,
      units: "imperial",
      startTime,
      endTime,
      timesteps: "current,1h",
      fields:
        "precipitationIntensity,temperature,temperatureApparent,weatherCode",
    },
  });

  return useFetch({ url });

  // return [timeline];
};

const useForecast = ({ lat, lon }) => {
  const url = createUrl({
    url: `${API_URL}/weather/forecast`,
    query: {
      location: `${lat},${lon}`,
      units: "imperial",
      timesteps: "1d",
    },
  });

  return useFetch({ url });

  // mock

  // return [forecast];
};

const useCurrentWeather = ({ lat, lon }) => {
  const url = createUrl({
    url: `${OPEN_METEO_URL}`,
    query: {
      latitude: lat,
      longitude: lon,
      current_weather: "true",
      temperature_unit: "fahrenheit",
      windspeed_unit: "mph",
    },
  });

  const [forecastResponse, forecastLoading, forecastHasError] = useFetch({ url });

  if (!forecastLoading && forecastResponse) {
    forecastResponse.current_weather.temperature = Math.round(
      forecastResponse.current_weather.temperature
    )
    forecastResponse.current_weather.weatherstate = CODES[forecastResponse.current_weather.weathercode];
    forecastResponse.current_weather.weatherbackground = getCurrentWeatherBackground(
      forecastResponse.current_weather.weathercode,forecastResponse.current_weather.is_day
    )
  }

  return [forecastResponse, forecastLoading, forecastHasError];
};

const useHourlyWeather = ({ lat, lon }) => {
  const url = createUrl({
    url: `${OPEN_METEO_URL}`,
    query: {
      latitude: lat,
      longitude: lon,
      temperature_unit: "fahrenheit",
      windspeed_unit: "mph",
      forecast_days: "1",
      hourly: "temperature,apparent_temperature,precipitation,rain,weathercode,visibility,windspeed_10m,temperature_80m,soil_temperature_0cm,uv_index,uv_index_clear_sky,is_day,cape,freezinglevel_height"
    },
  });

  const [forecastResponse, forecastLoading, forecastHasError] = useFetch({ url });

  if (!forecastLoading && forecastResponse) {
    forecastResponse.hourly = formatObject(forecastResponse.hourly);
  }

  return [forecastResponse, forecastLoading, forecastHasError];
};

const useDailyWeather = ({ lat, lon }) => {
    const url = createUrl({
      url: `${OPEN_METEO_URL}`,
      query: {
        latitude: lat,
        longitude: lon,
        // hourly:
        //   "temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,vapor_pressure_deficit,windspeed_10m,windspeed_80m,windspeed_120m,windspeed_180m,winddirection_10m,winddirection_80m,winddirection_120m,winddirection_180m,windgusts_10m,temperature_80m,temperature_120m,temperature_180m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_1cm",
        // daily:
        //   "weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration",
        daily: "weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max",
        // current_weather: "true",
        temperature_unit: "fahrenheit",
        windspeed_unit: "mph",
        timezone: "America/New_York",
        forecast_days: "14"
      },
    });
  
    const [forecastResponse, forecastLoading, forecastHasError] = useFetch({ url });

    if (!forecastLoading && forecastResponse) {
      forecastResponse.daily = formatObject(forecastResponse.daily);
    }
  
    return [forecastResponse, forecastLoading, forecastHasError];
  };

export { useTimeline, useForecast, useCurrentWeather, useHourlyWeather, useDailyWeather };
