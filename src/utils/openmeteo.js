import { store } from "../redux/store";
import tzlookup from "tz-lookup";
import { DateTime } from "luxon";
import { prettyPrintWeatherCode } from "./weather";
export const getMetricData = () => {
  return store.getState()?.user?.user?.metric ? "celsius" : "fahrenheit";
};

const getLocation = () => {
  return store.getState().location;
};

export const getTimeZone = () => {
  return tzlookup(getLocation().latitude, getLocation().longitude);
};

export const CODES = {
  0: "Clear Sky",
  1: "Mostly Clear",
  2: "Some Clouds",
  3: "Cloudy",
  45: "Foggy",
  48: "Frosty Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  56: "Light Freezing Drizzle",
  57: "Heavy Freezing Drizzle",
  61: "Light Rain",
  63: "Rain",
  65: "Heavy Rain",
  66: "Light Freezing Rain",
  67: "Heavy Freezing Rain",
  71: "Light Snow",
  73: "Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Light Rain Showers",
  81: "Rain Showers",
  82: "Heavy Rain Showers",
  85: "Light Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Some Hail",
  99: "Thunderstorm with Heavy Hail",
};

export const formatObject = (object) => {
  const times = object?.time;
  const formated = [];

  times?.forEach((time, index) => {
    const obj = {};

    for (const key in object) {
      obj[key] = object[key][index];
    }

    formated.push(obj);
  });

  return formated;
};

export const getCurrentWeatherBackground = (code, isDay) => {
  const weatherCode = code.toString();

  const clearStates = ["0", "1"];
  const cloudyStates = ["2", "3", "45", "48"];
  const rainyStates = [
    "51",
    "53",
    "55",
    "56",
    "57",
    "61",
    "63",
    "65",
    "66",
    "67",
    "80",
    "81",
    "82",
  ];
  const snowyStates = ["71", "73", "75", "77", "85", "86"];
  const thunderStates = ["95", "96", "99"];

  if (clearStates.includes(weatherCode)) {
    if (isDay) {
      return "clear_day";
    } else {
      return "clear_night";
    }
  } else if (cloudyStates.includes(weatherCode)) {
    if (isDay) {
      return "cloudy_day";
    } else {
      return "cloudy_night";
    }
  } else if (rainyStates.includes(weatherCode)) {
    return "rainy";
  } else if (snowyStates.includes(weatherCode)) {
    return "snowy";
  } else if (thunderStates.includes(weatherCode)) {
    return "thunder";
  } else {
    return "Unknown";
  }
};

export const formatCurrentData = (data) => {
  const new_data = JSON.parse(JSON.stringify(data));
  new_data.current_weather.temperature = Math.round(
    new_data.current_weather.temperature
  );
  new_data.current_weather.weatherstate =
    CODES[new_data.current_weather.weathercode];
  new_data.current_weather.weatherbackground = getCurrentWeatherBackground(
    new_data.current_weather.weathercode,
    new_data.current_weather.is_day
  );
  return new_data;
};

export const formatForecastData = (data) => {
  const new_data = JSON.parse(JSON.stringify(data));
  new_data.current_weather.temperature = Math.round(
    new_data.current_weather.temperature
  );
  new_data.current_weather.weatherstate =
    CODES[new_data.current_weather.weathercode];
  new_data.current_weather.weatherbackground = getCurrentWeatherBackground(
    new_data.current_weather.weathercode,
    new_data.current_weather.is_day
  );
  new_data.daily = formatObject(new_data.daily);
  new_data.hourly = formatObject(new_data.hourly);
  new_data.daily.is_day = new_data.current_weather.is_day;
  new_data.hourly.is_day = new_data.current_weather.is_day;
  return new_data;
};

export const getCurrentData = async (location) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${
      location.latitude
    }&longitude=${
      location.longitude
    }&current_weather=true&temperature_unit=${getMetricData()}`
  );
  const data = await response.json();
  data.current_weather.temperature = Math.round(
    data.current_weather.temperature
  );
  data.current_weather.weatherstate = CODES[data.current_weather.weathercode];
  data.current_weather.weatherbackground = getCurrentWeatherBackground(
    data.current_weather.weathercode,
    data.current_weather.is_day
  );
  return data;
};

export const getHourlyData = async (location) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${
      location.latitude
    }&longitude=${
      location.longitude
    }&hourly=temperature,apparent_temperature,precipitation,rain,weathercode,visibility,windspeed_10m,temperature_80m,soil_temperature_0cm,uv_index,uv_index_clear_sky,is_day,cape,freezinglevel_height&temperature_unit=${getMetricData()}&windspeed_unit=mph&forecast_days=1&current_weather=true`
  );
  const data = await response.json();
  data.hourly = formatObject(data.hourly);
  return data;
};

export const getWeatherData = async (location) => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${
        location.latitude
      }&longitude=${
        location.longitude
      }&hourly=visibility,uv_index,temperature_2m,windspeed_10m,apparent_temperature,precipitation_probability,precipitation,rain,snowfall,snow_depth,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum&temperature_unit=${getMetricData()}&windspeed_unit=mph&timezone=${getTimeZone()}&current_weather=true&forecast_days=16`
    );
    const data = await response.json();
    if (data && data.current_weather && data.daily && data.hourly) {
      data.current_weather.temperature = Math.round(
        data.current_weather.temperature
      );
      data.current_weather.weatherstate =
        CODES[data.current_weather.weathercode];
      data.current_weather.weatherbackground = getCurrentWeatherBackground(
        data.current_weather.weathercode,
        data.current_weather.is_day
      );
      data.daily = formatObject(data.daily);
      data.hourly = formatObject(data.hourly);
    }
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

const getUVIndexLabel = (uvIndex) => {
  if (uvIndex <= 3) {
    return "L";
  } else if (uvIndex <= 6) {
    return "M";
  } else if (uvIndex <= 9) {
    return "H";
  } else {
    return "E";
  }
};
const getWeatherApiURL = (
  lat,
  lng,
  durationInDays,
  timezone = getTimeZone()
) => {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=visibility,uv_index,windspeed_10m,temperature_2m,apparent_temperature,precipitation_probability,precipitation,rain,snowfall,snow_depth,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum&temperature_unit=${getMetricData()}&timezone=${timezone}&windspeed_unit=mph&current_weather=true&forecast_days=${durationInDays}`;
};
export const getWeatherInsightsHTML = async (location) => {
  const timeZone = tzlookup(location.latitude, location.longitude);
  const locationWeatherAPIUrl = getWeatherApiURL(
    location.latitude,
    location.longitude,
    1,
    timeZone
  );
  const locationWeatherresponse = await fetch(locationWeatherAPIUrl);
  const currentTime = DateTime.now()
    .setZone(timeZone)
    .plus({ minutes: 30 })
    .toFormat("yyyy-MM-dd HH:mm");

  const currentTimeIndex = DateTime.now()
    .setZone(timeZone)
    .plus({ hours: 1 })
    .startOf("hour")
    .toFormat("yyyy-MM-dd,HH:mm")
    .split(",")
    .join("T");
  const locationWeatherData = await locationWeatherresponse.json();
  const locWeatherDataText = getWeatherDataHtml(
    locationWeatherData,
    currentTime,
    currentTimeIndex
  );
  return locWeatherDataText;
};

export const getWeatherAlertsHTML = async (location) => {
  const timeZone = tzlookup(location.latitude, location.longitude);
  const locationWeatherAPIUrl = getWeatherApiURL(
    location.latitude,
    location.longitude,
    1,
    timeZone
  );
  const locationWeatherresponse = await fetch(locationWeatherAPIUrl);
  const currentTime = DateTime.now()
    .setZone(timeZone)
    .toFormat("yyyy-MM-dd HH:mm");

  const currentTimeIndex = DateTime.now()
    .setZone(timeZone)
    .startOf("hour")
    .toFormat("yyyy-MM-dd,HH:mm")
    .split(",")
    .join("T");
  const locationWeatherData = await locationWeatherresponse.json();
  const locWeatherDataText = getSimpleWeatherDataHtml(
    locationWeatherData,
    currentTime,
    currentTimeIndex
  );
  return locWeatherDataText;
};
export const getSimpleWeatherDataHtml = (
  apiResponse,
  time,
  timeIndex,
  city
) => {
  const hourly = apiResponse.hourly;
  // const current = apiResponse.current_weather;
  const index = hourly.time.indexOf(timeIndex);
  const current = hourly.temperature_2m[index];
  const apparentTemp = hourly.apparent_temperature[index];
  const uvIndex = hourly.uv_index[index];
  const precipitationSum = hourly.precipitation[index];
  const weatherCode = hourly.weathercode[index];

  console.log(
    `city: ${city} :::: timeIndex: ${timeIndex} ::::: index: ${index} :::: ${current}`
  );

  return `
    <div class="weather-data">
      <div class="weather-data-weather mb-2r"><i class="${getWeatherIcon(
        weatherCode
      )}"></i> ${getWeatherQuote(weatherCode)}</div>
    </div>
  `;
};
export const getWeatherDataHtml = (apiResponse, time, timeIndex, city) => {
  const hourly = apiResponse.hourly;
  // const current = apiResponse.current_weather;
  const index = hourly.time.indexOf(timeIndex);
  const current = hourly.temperature_2m[index];
  const apparentTemp = hourly.apparent_temperature[index];
  const uvIndex = hourly.uv_index[index];
  const precipitationSum = hourly.precipitation[index];
  const weatherCode = hourly.weathercode[index];
  const windSpeed = hourly.windspeed_10m[index];
  const isDay = apiResponse.current_weather.is_day;

  debugger;

  console.log(
    `city: ${city} :::: timeIndex: ${timeIndex} ::::: index: ${index} :::: ${current}`
  );

  return `
    <div class="weather-data">
      <h5>${getWeatherAdvice(Math.round(uvIndex), precipitationSum, windSpeed, current, weatherCode, isDay)}</h5>
      <div class="weather-data-time mb-2"><i class="fas fa-clock"></i> ${time}</div>
      <div class="weather-data-temperature mb-2"><i class="fas fa-thermometer-half"></i> ${Math.round(
        current
      )} ${getMetricData() == "fahrenheit" ? "°F" : "°C"}</div>
      <div class="weather-data-feels-like mb-2"><i class="fas fa-thermometer-empty"></i> Feels Like: ${Math.round(
        apparentTemp
      )} ${getMetricData() == "fahrenheit" ? "°F" : "°C"}</div>
      <div class="weather-data-uv-index mb-2"><i class="fas fa-sun"></i> UV Index: ${Math.round(
        uvIndex
      )} - ${getUVIndexLabel(Math.round(uvIndex))}</div>
      <div class="weather-data-precipitation mb-2"><i class="fas fa-cloud-rain"></i> Precipitation: ${precipitationSum}</div>
      <div class="weather-data-weather mb-2r"><i class="${getWeatherIcon(
        weatherCode
      )}"></i> Weather: ${prettyPrintWeatherCode(weatherCode)}</div>
    </div>
  `;
};
const getWeatherIcon = (weatherCode) => {
  const weatherIcons = {
    0: "fas fa-sun", // clear_day
    1: "fas fa-cloud-sun", // mostly_clear_day
    2: "fas fa-cloud-sun", // partly_cloudy_day
    3: "fas fa-cloud", // cloudy
    45: "fas fa-smog", // fog
    48: "fas fa-smog", // fog_light
    51: "fas fa-cloud-drizzle", // drizzle
    53: "fas fa-cloud-drizzle", // drizzle
    55: "fas fa-cloud-showers-heavy", // rain_heavy
    56: "fas fa-cloud-meatball", // freezing_drizzle
    57: "fas fa-cloud-meatball", // freezing_rain_heavy
    61: "fas fa-cloud-rain", // rain_light
    63: "fas fa-cloud-rain", // rain
    65: "fas fa-cloud-showers-heavy", // rain_heavy
    66: "fas fa-cloud-meatball", // freezing_rain_light
    67: "fas fa-cloud-meatball", // freezing_rain_heavy
    71: "fas fa-snowflake", // snow_light
    73: "fas fa-snowflake", // snow
    75: "fas fa-snowflake", // snow_heavy
    77: "fas fa-icicles", // ice_pellets
    80: "fas fa-cloud-rain", // rain_light
    81: "fas fa-cloud-rain", // rain
    82: "fas fa-cloud-showers-heavy", // rain_heavy
    85: "fas fa-snowflake", // snow_light
    86: "fas fa-snowflake", // snow_heavy
    95: "fas fa-bolt", // tstorm
    96: "fas fa-bolt", // tstorm
    99: "fas fa-bolt", // tstorm
  };
  return weatherIcons[weatherCode] || "fas fa-question";
};

function getWeatherQuote(weatherCode) {
  switch (weatherCode) {
    case 0:
    case 1:
    case 3:
      return "Don't forget your sunglasses! It's going to be a bright day.";

    case 1001:
    case 2:
    case 96:
      return "You might need a light jacket today, it's going to be cloudy.";

    case 2000:
    case 45:
    case 48:
      return "Be careful while driving, there's foggy weather ahead.";

    case 3000:
    case 3001:
    case 3002:
      return "Hold onto your hat, it's going to be windy today.";

    case 4000:
    case 51:
    case 56:
    case 73:
      return "You might need an umbrella, there's a chance of drizzle.";

    case 4001:
    case 53:
    case 55:
    case 57:
    case 61:
    case 75:
    case 77:
      return "Don't forget your raincoat, it's going to rain today.";

    case 5000:
    case 65:
    case 67:
      return "Bundle up, it's going to snow today.";

    case 5001:
    case 66:
      return "Expect some flurries today, stay warm.";

    case 6000:
    case 6001:
    case 82:
    case 80:
      return "Watch your step, there might be some icy patches.";

    case 7000:
    case 81:
    case 85:
      return "Be cautious, there's a chance of ice pellets.";

    case 8000:
    case 86:
      return "Stay indoors, there's a thunderstorm expected.";

    default:
      return "Enjoy your day!";
  }
}

function getWeatherAdvice({ uvIndex, precipitation, windSpeed, temperature, weatherCode, isDay }) {
  const metric = store.getState()?.user?.user?.metric;
  let messages = [];

  if (metric) {
    // Temperature advice in Celsius
    if (temperature < 0) {
      messages.push(
        "It's freezing (below 0°C). Dress in layers and stay warm."
      );
    } else if (temperature < 20) {
      messages.push("It's cool (below 20°C). Consider wearing a jacket.");
    } else if (temperature > 30) {
      messages.push(
        "It's hot (above 30°C). Stay hydrated and avoid strenuous activities in the heat."
      );
    }
  } else {
    // Temperature advice in Fahrenheit
    if (temperature < 32) {
      messages.push("It's freezing (below 32°F). Dress in layers and stay warm.");
    } else if (temperature < 68) {
      messages.push("It's cool (below 68°F). Consider wearing a jacket.");
    } else if (temperature > 86) {
      messages.push(
        "It's hot (above 86°F). Stay hydrated and avoid strenuous activities in the heat."
      );
    }
  }

  // UV Index advice
  if (isDay) {
    if (uvIndex > 7) {
      messages.push("It's very sunny. Wear sunscreen and a hat.");
    } else if (uvIndex > 3) {
      messages.push("The sun is moderate. Seek shade during midday hours.");
    } else {
      messages.push("UV levels are low. Enjoy your day, but stay protected.");
    }
  }

  // Precipitation advice
  if (precipitation > 50) {
    messages.push(
      "Heavy rain expected. Don't forget an umbrella and waterproof clothing."
    );
  } else if (precipitation > 20) {
    messages.push("Light rain is coming. A raincoat might be a good idea.");
  } else if (precipitation > 0) {
    messages.push(
      "There's a chance of drizzle. Consider carrying a light umbrella."
    );
  }

  // Wind advice
  if (windSpeed > 25) {
    messages.push(
      "It's very windy. Secure loose items and be careful if driving."
    );
  } else if (windSpeed > 10) {
    messages.push("It's a bit breezy. A windbreaker might be necessary.");
  }

  return messages.join(" ");
}
