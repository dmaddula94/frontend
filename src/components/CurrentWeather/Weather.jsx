import React from "react";
import Realtime from "./Realtime";
import Hourly from "./Hourly";
import Daily from "./Daily";
import PlaceIcon from '@mui/icons-material/Place';
import { useTimeline, useForecast } from "../../hooks/use-weather.hook";
import { addHours, isDayTime } from "../../utils/weather";

const now = new Date();
const startTime = now.toISOString();
const endTime = addHours({ date: now, hours: 6 }).toISOString();

function Loading() {
  return <div>Loading...</div>;
}

function Error() {
  return <div>Oops! Something went wrong :(</div>;
}

function Weather({ lat, lon, location }) {
  const [isDay, setIsDay] = React.useState(true);

  const getIsDay = async () => {
    setIsDay(await isDayTime(lat, lon));
  };

  React.useEffect(() => {
    if (lat && lon) {
      getIsDay();
    }
  }, [lat, lon]);

  const [timelineResponse, timelineLoading, timelineHasError] = useTimeline({
    lat,
    lon,
    startTime,
    endTime,
  });

  const [forecastResponse, forecastLoading, forecastHasError] = useForecast({
    lat,
    lon
  })

  if (timelineLoading) {
    return <Loading />;
  }

  if (timelineHasError) {
    return <Error />;
  }

  if (forecastLoading) {
    return <Loading />;
  }

  if (forecastHasError) {
    return <Error />;
  }

  const realtimeResponse = timelineResponse.data.timelines[1];

  const hourlyResponse = timelineResponse.data.timelines[0];

  const dailyResponse = forecastResponse.timelines.daily;

  return (
    <>
      <div className="weather">
        <div className="glassbackground current-weather col-5">
          <div className="time">{now.toDateString()}</div>
          <div className="location" style={{display: 'flex', alignItems: 'center'}}>
            <PlaceIcon width="16" height="16" style={{marginRight: '4px'}} />
            {location}
          </div>
          <Realtime realtime={realtimeResponse} isDay={isDay} />
          <div className="divider" />
          <Hourly hourly={hourlyResponse} isDay={isDay} />
        </div>
        <div className="glassbackground current-weather col-5">
          <Daily daily={dailyResponse} isDay={isDay} />
        </div>
      </div>
    </>
  );
}

export default Weather;
