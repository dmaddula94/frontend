import CODES from '../constants/weathercodes';
const TOMORROW_API_KEY = process.env.TOMORROW_API_KEY || 'QnHFAzk6yin94m7rybRnPA41s9SoAMtW';
const TOMORROW_API_URL = process.env.TOMORROW_API_URL || 'https://api.tomorrow.io/v4';

export const getCurrentWeather = async (location) => {
    return new Promise(async (resolve, reject) => {
        if (location && TOMORROW_API_KEY) {
            const endpoint = `${TOMORROW_API_URL}/weather/realtime?apikey=${TOMORROW_API_KEY}&location=${location}`;
            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                resolve(data);
            } catch (err) {
                reject(err);
            }
        } else {
            reject(new Error('No location provided'));
        }

        //mock

        // resolve({
        //     "data": {
        //         "time": "2023-09-21T00:27:00Z",
        //         "values": {
        //             "cloudBase": null,
        //             "cloudCeiling": null,
        //             "cloudCover": 0,
        //             "dewPoint": 11,
        //             "freezingRainIntensity": 0,
        //             "humidity": 70,
        //             "precipitationProbability": 0,
        //             "pressureSurfaceLevel": 1015.2,
        //             "rainIntensity": 0,
        //             "sleetIntensity": 0,
        //             "snowIntensity": 0,
        //             "temperature": 16.63,
        //             "temperatureApparent": 16.63,
        //             "uvHealthConcern": 0,
        //             "uvIndex": 0,
        //             "visibility": 16,
        //             "weatherCode": 1000, // change this for weather states
        //             "windDirection": 338.88,
        //             "windGust": 1.88,
        //             "windSpeed": 1
        //         }
        //     },
        //     "location": {
        //         "lat": 41.7065544128418,
        //         "lon": -73.9283676147461,
        //         "name": "City of Poughkeepsie, Dutchess County, New York, 12601, United States",
        //         "type": "administrative"
        //     }
        // })
    })
}

export const getWeatherState = (code) => {
    const weather = CODES.weatherCode[code];

    if (!weather) return "Unknown";

    return weather;
}

export const getDefinedState = (code) => {
    if (["1000", "1100", "1101", "1102", "1001", "2000", "2100"].includes(code.toString())) {
        return "sunny";
    }
    if (["4000", "4001", "4200", "4201", "6000", "6001", "6200", "6201", "7000", "7101", "7102"].includes(code.toString())) {
        return "rainy";
    }
    if (["5000", "5001", "5100", "5101"].includes(code.toString())) {
        return "snowy";
    }
    if (["8000"].includes(code.toString())) {
        return "thunder";
    }

    return "Unknown";
}

export function toFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}
