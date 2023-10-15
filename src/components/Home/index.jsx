import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { getLocation } from "../../utils/location";
import CurrentWeather from "../CurrentWeather";
import { setLocation, setCurrentLocation } from "../../redux/reducers/locationSlice";
import { startLoader, stopLoader } from "../../redux/reducers/loadingSlice";

const Home = () => {
  const dispatch = useDispatch();
  const routeLocation = useLocation();
  const { state } = routeLocation;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(startLoader());
    getLocation(state?.coOrdinates).then((loc) => {
      dispatch(stopLoader());
      dispatch(setLocation(loc));
      dispatch(setCurrentLocation(loc));
    });
  }, []);

  return (
    <>
      <CurrentWeather />
    </>
  );
};

export default Home;
