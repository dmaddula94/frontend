import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setWeather, setBackground } from "../../redux/reducers/weatherSlice";
// import { startLoader, stopLoader } from "../../redux/reducers/loadingSlice";
import "./index.scss";
import Weather from "./Weather";
import { getCurrentData } from "../../utils/openmeteo";

function CurrentWeather() {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location);

  const getCurrentWeatherData = async () => {
    const weatherdata = await getCurrentData(location);
    dispatch(setWeather({ current: weatherdata.current_weather }));
    dispatch(
      setBackground({ background: weatherdata.current_weather.weatherbackground })
    );
  };

  useEffect(() => {
    getCurrentWeatherData();
  }, [location.latitude, location.longitude]);

  return (
    <>
      {location.latitude && location.longitude && location.name && (
        <Weather
          lat={location.latitude}
          lon={location.longitude}
          location={location.name}
        />
      )}
    </>
  );
}

export default CurrentWeather;
