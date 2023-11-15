import CODES from "../constants/weathercodes";
const TOMORROW_API_URL =
  "https://us-central1-marist-weather-dashboard.cloudfunctions.net/api/tomorrow";

export const getCurrentWeather = async (location) => {
  return new Promise(async (resolve, reject) => {
    // if (location) {
    //     const endpoint = `${TOMORROW_API_URL}/weather/realtime?location=${location}&units=imperial`;
    //     try {
    //         const response = await fetch(endpoint);
    //         const data = await response.json();
    //         resolve(data);
    //     } catch (err) {
    //         reject(err);
    //     }
    // } else {
    //     reject(new Error('No location provided'));
    // }

    //mock

    resolve({
      data: {
        time: "2023-09-21T00:27:00Z",
        values: {
          cloudBase: null,
          cloudCeiling: null,
          cloudCover: 0,
          dewPoint: 11,
          freezingRainIntensity: 0,
          humidity: 70,
          precipitationProbability: 0,
          pressureSurfaceLevel: 1015.2,
          rainIntensity: 0,
          sleetIntensity: 0,
          snowIntensity: 0,
          temperature: 16.63,
          temperatureApparent: 16.63,
          uvHealthConcern: 0,
          uvIndex: 0,
          visibility: 16,
          weatherCode: 1000, // change this for weather states
          windDirection: 338.88,
          windGust: 1.88,
          windSpeed: 1,
        },
      },
      location: {
        lat: 41.7065544128418,
        lon: -73.9283676147461,
        name: "City of Poughkeepsie, Dutchess County, New York, 12601, United States",
        type: "administrative",
      },
    });
  });
};

export const getTimelineData = async (lat, lon, startTime, endTime) => {
  return new Promise(async (resolve, reject) => {
    const endpoint = `https://us-central1-marist-weather-dashboard.cloudfunctions.net/api/tomorrow/timelines?location=${lat},${lon}&units=imperial&timesteps=current,1h&startTime=${startTime}&endTime=${endTime}&fields=precipitationIntensity,temperature,temperatureApparent,weatherCode`;
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

export const getForecastData = async (lat, lon) => {
  return new Promise(async (resolve, reject) => {
    const endpoint = `https://us-central1-marist-weather-dashboard.cloudfunctions.net/api/tomorrow/weather/forecast?location=${lat},${lon}&units=imperial&timesteps=1d`;
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

export async function isDayTime(latitude, longitude) {
  try {
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`
    );
    const data = await response.json();

    const sunrise = new Date(data.results.sunrise);
    const sunset = new Date(data.results.sunset);
    const now = new Date();

    return now >= sunrise && now <= sunset;
  } catch (error) {
    console.error("Failed to fetch sunrise/sunset data:", error);
    return false; // Fallback: consider it as night if API fails
  }
}

export const getWeatherState = async (code, latitude, longitude) => {
  const isDay = await isDayTime(latitude, longitude);
  if (isDay) {
    const weather = CODES.weatherCode[code];

    if (!weather) return "Unknown";

    return weather;
  } else {
    const weather = CODES.weatherCodeNight[`${code}1`];

    if (!weather) return "Unknown";

    return weather;
  }
};

export const getDefinedState = async (code, latitude, longitude) => {
  const isDay = await isDayTime(latitude, longitude);
  const weatherCode = code.toString();

  if (["1000", "1100", "2000", "2100"].includes(weatherCode)) {
    if (isDay) {
      return "clear_day";
    } else {
      return "clear_night";
    }
  }

  if (["1101", "1102", "1001"].includes(weatherCode)) {
    if (isDay) {
      return "cloudy_day";
    } else {
      return "cloudy_night";
    }
  }

  if (
    [
      "4000",
      "4001",
      "4200",
      "4201",
      "6000",
      "6001",
      "6200",
      "6201",
      "7000",
      "7101",
      "7102",
    ].includes(weatherCode)
  ) {
    return "rainy";
  }

  if (["5000", "5001", "5100", "5101"].includes(weatherCode)) {
    return "snowy";
  }

  if (["8000"].includes(weatherCode)) {
    return "thunder";
  }

  if (["1101", "1102", "1001"].includes(weatherCode)) {
    return isDay ? "partlycloudyday" : "partlycloudynight";
  }

  return "Unknown";
};

export function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

/**
 * Returns a date <hours> after the given <date>.
 * @param date
 * @param hours
 */
export const addHours = ({ date, hours = 0 }) => {
  const newDate = new Date(date.valueOf());
  newDate.setTime(date.getTime() + hours * 60 * 60 * 1000);
  return newDate;
};

/**
 * Formats time in a way we want to present it.
 * Examples: 7AM, 12PM
 * @param time
 * @returns {string}
 */
export const formatTime = (time) => {
  const hours = new Date(time).getHours();
  const suffix = hours >= 12 ? "PM" : "AM";
  let display = hours % 12;
  if (display === 0) {
    display = 12;
  }
  return `${display}${suffix}`;
};

export const formatDate = (time) => {
  const date = new Date(time);
  return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" }).toUpperCase();
};

export const formatDay = (time) => {
  const date = new Date(time);
  return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
};

/**
 * Converts weather code value to human display string.
 * Example: freezing_rain to Freezing Rain
 * @param str
 * @returns {string}
 */
export const prettyPrintWeatherCode = (code) => {
  const weatherCodes = {
    0: "Clear",
    1000: "Clear",
    1001: "Cloudy",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    2000: "Fog",
    2100: "Light Fog",
    3000: "Light Wind",
    3001: "Wind",
    3002: "Strong Wind",
    4000: "Drizzle",
    4001: "Rain",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    5001: "Flurries",
    5100: "Light Snow",
    5101: "Heavy Snow",
    6000: "Freezing Drizzle",
    6001: "Freezing Rain",
    6200: "Light Freezing Rain",
    6201: "Heavy Freezing Rain",
    7000: "Ice Pellets",
    7101: "Heavy Ice Pellets",
    7102: "Light Ice Pellets",
    8000: "Thunderstorm",
    // Additional descriptions with same values
    1: "Clear",
    2: "Cloudy",
    3: "Mostly Clear",
    45: "Fog",
    48: "Light Fog",
    51: "Drizzle",
    53: "Rain",
    55: "Light Rain",
    56: "Freezing Drizzle",
    57: "Freezing Rain",
    61: "Light Freezing Rain",
    63: "Heavy Freezing Rain",
    65: "Snow",
    66: "Flurries",
    67: "Light Snow",
    71: "Heavy Snow",
    73: "Freezing Drizzle",
    75: "Freezing Rain",
    77: "Light Freezing Rain",
    80: "Heavy Freezing Rain",
    81: "Ice Pellets",
    82: "Heavy Ice Pellets",
    85: "Light Ice Pellets",
    86: "Thunderstorm",
    95: "Clear", // Placeholder, adjust as needed
    96: "Cloudy", // Placeholder, adjust as needed
    99: "Mostly Clear", // Placeholder, adjust as needed
  };
  return weatherCodes[code];
};
