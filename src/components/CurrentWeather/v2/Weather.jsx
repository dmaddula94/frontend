import React from "react";
import Realtime from "./Realtime";
import Hourly from "./Hourly";
import Daily from "./Daily";
import PlaceIcon from '@mui/icons-material/Place';
import { useCurrentWeather } from "../../../hooks/use-weather.hook";

const now = new Date();

function Loading() {
  return <div>Loading...</div>;
}

function Error() {
  return <div>Oops! Something went wrong :(</div>;
}

function Weather({ lat, lon, location }) {
  // const [timelineResponse, timelineLoading, timelineHasError] = useTimeline({
  //   lat,
  //   lon,
  //   startTime,
  //   endTime,
  // });

  const [currentResponse, currentLoading, currentHasError] = useCurrentWeather({
    lat,
    lon, 
  })

  if (currentLoading) {
    return <Loading />;
  }

  if (currentHasError) {
    return <Error />;
  }

  return (
    <>
      <div className="weather">
        <div className="glassbackground current-weather col-5">
          <div className="time">{now.toDateString()}</div>
          <div className="location" style={{display: 'flex', alignItems: 'center'}}>
            <PlaceIcon width="16" height="16" style={{marginRight: '4px'}} />
            {location}
          </div>
          <Realtime realtime={currentResponse.current_weather} isDay={currentResponse.current_weather?.is_day} />
          <div className="divider" />
          <Hourly lat={lat} lon={lon} isDay={currentResponse.current_weather?.is_day} />
        </div>
        <div className="glassbackground current-weather col-5">
          <Daily lat={lat} lon={lon} isDay={currentResponse.current_weather?.is_day} />
        </div>
      </div>
    </>
  );
}

export default Weather;
