import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setWeather, setBackground } from "../../redux/reducers/weatherSlice";
// import { startLoader, stopLoader } from "../../redux/reducers/loadingSlice";
import "./index.scss";
import Weather from "./v2/Weather";
// import Weather from "./Weather";
import { getCurrentData } from "../../utils/openmeteo";
import Search from "../Search";

function CurrentWeather() {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  const getCurrentWeatherData = async () => {
    const weatherdata = await getCurrentData(location);
    dispatch(setWeather({ current: weatherdata.current_weather }));
    dispatch(
      setBackground({
        background: weatherdata.current_weather.weatherbackground,
      })
    );
  };

  useEffect(() => {
    getCurrentWeatherData();
  }, [location.latitude, location.longitude]);

  return (
    <>
      {
        !isDesktop && (
          <div className="location-search mt-4">
            <Search />
          </div>
        )
      }
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
