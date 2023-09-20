import React, { useEffect, useState } from 'react';
import './index.scss';

const BackgroundVideo = () => {
    const [currentWeather, setCurrentWeather] = useState('rainy');
    const [background, setBackground] = useState('../assets/videos/rainy.mov');
    return (
        <div className="video-container">
            <video width="100%" height="100%" className="background-video" autoPlay loop muted>
                <source src={background} type="video/mov" />
                Your browser does not support the video tag.
            </video>
            <div className="glassy-overlay"></div>
            {/* Other content can be added here */}
        </div>
    );
}

export default BackgroundVideo;
