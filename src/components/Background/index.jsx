import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const WeatherBackgroundPage = ({ location }) => {
    const [currentWeather, setCurrentWeather] = useState('Rain');
    const [backgroundImage, setBackgroundImage] = useState(null);

    useEffect(() => {
        // const fetchCurrentWeather = async () => {
        //     try {
        //         const response = await axios.get(`/api/weather/current/${location}`);
        //         setCurrentWeather(response.data);
                
        //         // Set the background image based on the weather condition
        //         switch (response.data.condition) {
        //             case 'Rain':
        //                 setBackgroundImage('rain.jpg');
        //                 break;
        //             case 'Sunny':
        //                 setBackgroundImage('sunny.jpg');
        //                 break;
        //             // ... Add more conditions and corresponding images
        //             default:
        //                 setBackgroundImage('default.jpg');
        //                 break;
        //         }
        //     } catch (error) {
        //         console.error('Failed to fetch current weather:', error);
        //     }
        // };

        // fetchCurrentWeather();
    }, [location]);

    return (
        <div className="weather-page" style={{ backgroundImage: `url(/assets/${backgroundImage})` }}>
            <Header />
            <div className="weather-info">
                {currentWeather && (
                    <div>
                        <h2>{currentWeather.temperature}°C</h2>
                        <p>{currentWeather.condition}</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default WeatherBackgroundPage;
