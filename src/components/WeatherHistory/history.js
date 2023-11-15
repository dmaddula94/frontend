import { fetchWeatherApi } from 'openmeteo';

const params = {
    latitude: 52.52,
    longitude: 13.41,
    start_date: "2023-10-30",
    end_date: "2023-11-13",
    hourly: "temperature_2m"
};

const url = "https://archive-api.open-meteo.com/v1/archive";
const responses = await fetchWeatherApi(url, params);

// Helper function to form time ranges using arrow function
const range = (start, stop, step) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location using destructuring
const { utcOffsetSeconds, timezone, timezoneAbbreviation, latitude, longitude } = response;

const hourly = response.hourly();

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
    hourly: {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
            t => new Date((t + utcOffsetSeconds) * 1000)
        ),
        temperature2m: hourly.variables(0).valuesArray(),
    },
};

// `weatherData` now contains a simple structure with arrays for datetime and weather data
weatherData.hourly.time.forEach((time, i) => {
    console.log(
        `${time.toISOString()} ${weatherData.hourly.temperature2m[i]}`
    );
});
