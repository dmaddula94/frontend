import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getLocation } from "../../utils/location";
import CurrentWeather from "../CurrentWeather";
import { setLocation } from "../../redux/reducers/locationSlice";
import { startLoader, stopLoader } from "../../redux/reducers/loadingSlice";

const Home = () => {
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(startLoader());
    getLocation().then((loc) => {
      dispatch(stopLoader());
      dispatch(setLocation(loc));
    });
  }, []);

  return (
    <>
      <CurrentWeather />
    </>
  );
};

export default Home;
