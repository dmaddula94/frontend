import { DateTime } from "luxon";
import tzlookup from "tz-lookup";
import { store } from "../redux/store";

const getLocation = () => {
  return store.getState().location;
};

export const getTime = (lat, lon, format) => {
  const dateFormat = format || "DATE_MED_WITH_WEEKDAY";
  const timezone = tzlookup(
    lat || getLocation().latitude,
    lon || getLocation().longitude
  );
  const dateTime = DateTime.now().setZone(timezone);
  const formattedDateTime = dateTime.toLocaleString(DateTime[dateFormat]);
  return formattedDateTime;
};

export const getFormattedTime = (time, format) => {
  const dateFormat = format || "DATE_MED_WITH_WEEKDAY";
  const timezone = tzlookup(getLocation().latitude, getLocation().longitude);
  const dateTime = DateTime.fromISO(time, { zone: timezone });
  if (format === "MM/DD") {
    return dateTime.toFormat("MM/dd").toUpperCase();
  } else {
    const formattedDateTime = dateTime.toLocaleString(DateTime[dateFormat]);
    return formattedDateTime;
  }
};
