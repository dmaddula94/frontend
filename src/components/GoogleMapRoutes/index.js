import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  TrafficLayer,
} from "@react-google-maps/api";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import { useRef, useState } from "react";
import {
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import tzlookup from "tz-lookup";
import { DateTime } from "luxon";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../redux/reducers/locationSlice";

import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { prettyPrintWeatherCode } from "../../utils/weather";
import { getMetricData, getTimeZone } from "../../utils/openmeteo";

export default function GoogleMapRoutes() {
  const startLocationRef = useRef();
  const endLocationRef = useRef();
  const dispatch = useDispatch();
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [isLoadingWeatherData, setIsLoadingWeatherData] = useState(false);
  const [duration, setDuration] = useState("");
  const location = useSelector((state) => {
    return state.location;
  });
  const sys_theme = useTheme();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCm8tykVzUw05yjP4qfvO9Qx69VH6miAAw",
    libraries: ["places"],
  });
  const initialCenter = { lat: location.latitude, lng: location.longitude };
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const initialZoom = 10;
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [previousMarkers, setPreviousMarkers] = useState([]);

  const getUVIndexLabel = (uvIndex) => {
    if (uvIndex <= 3) {
      return "L";
    } else if (uvIndex <= 6) {
      return "M";
    } else if (uvIndex <= 9) {
      return "H";
    } else {
      return "E";
    }
  };

  const getWeatherDataText = (apiResponse, time) => {
    const hourly = apiResponse.hourly;
    const current = apiResponse.current_weather;
    const index = hourly.time.indexOf(time);
    debugger;
    const apparentTemp = hourly.apparent_temperature[index];
    const uvIndex = hourly.uv_index[index];
    const precipitationSum = hourly.precipitation[index];
    const weatherCode = hourly.weathercode[index];

    // data
    const dataText =
      `Time: ${time.split("T").join(" ")} <br>` +
      `Temp: ${Math.round(current.temperature)} ${
        getMetricData() == "fahrenheit" ? "°F" : "°C"
      }<br>` +
      `Feels Like: ${Math.round(apparentTemp)} ${
        getMetricData() == "fahrenheit" ? "°F" : "°C"
      }<br>` +
      `UV Index: ${Math.round(uvIndex)} - ${getUVIndexLabel(
        Math.round(uvIndex)
      )}<br>` +
      `Precipitation: ${precipitationSum}<br>` +
      `Weather: ${prettyPrintWeatherCode(weatherCode)}`;

    return dataText;
  };

  const getWeatherIcon = (weatherCode) => {
    const weatherIcons = {
      0: "fas fa-sun", // clear_day
      1: "fas fa-cloud-sun", // mostly_clear_day
      2: "fas fa-cloud-sun", // partly_cloudy_day
      3: "fas fa-cloud", // cloudy
      45: "fas fa-smog", // fog
      48: "fas fa-smog", // fog_light
      51: "fas fa-cloud-drizzle", // drizzle
      53: "fas fa-cloud-drizzle", // drizzle
      55: "fas fa-cloud-showers-heavy", // rain_heavy
      56: "fas fa-cloud-meatball", // freezing_drizzle
      57: "fas fa-cloud-meatball", // freezing_rain_heavy
      61: "fas fa-cloud-rain", // rain_light
      63: "fas fa-cloud-rain", // rain
      65: "fas fa-cloud-showers-heavy", // rain_heavy
      66: "fas fa-cloud-meatball", // freezing_rain_light
      67: "fas fa-cloud-meatball", // freezing_rain_heavy
      71: "fas fa-snowflake", // snow_light
      73: "fas fa-snowflake", // snow
      75: "fas fa-snowflake", // snow_heavy
      77: "fas fa-icicles", // ice_pellets
      80: "fas fa-cloud-rain", // rain_light
      81: "fas fa-cloud-rain", // rain
      82: "fas fa-cloud-showers-heavy", // rain_heavy
      85: "fas fa-snowflake", // snow_light
      86: "fas fa-snowflake", // snow_heavy
      95: "fas fa-bolt", // tstorm
      96: "fas fa-bolt", // tstorm
      99: "fas fa-bolt", // tstorm
    };
    return weatherIcons[weatherCode] || "fas fa-question";
  };

  const getWeatherDataHtml = (apiResponse, time,timeIndex) => {
    const hourly = apiResponse.hourly;
    const current = apiResponse.current_weather;
    const index = hourly.time.indexOf(timeIndex);
    const apparentTemp = hourly.apparent_temperature[index];
    const uvIndex = hourly.uv_index[index];
    const precipitationSum = hourly.precipitation[index];
    const weatherCode = hourly.weathercode[index];

    return `
      <div class="weather-data">
        <div class="weather-data-time mb-2"><i class="fas fa-clock"></i> ${time
          .split("T")
          .join(" ")}</div>
        <div class="weather-data-temperature mb-2"><i class="fas fa-thermometer-half"></i> ${Math.round(
          current.temperature
        )} ${getMetricData() == "fahrenheit" ? "°F" : "°C"}</div>
        <div class="weather-data-feels-like mb-2"><i class="fas fa-thermometer-empty"></i> Feels Like: ${Math.round(
          apparentTemp
        )} ${getMetricData() == "fahrenheit" ? "°F" : "°C"}</div>
        <div class="weather-data-uv-index mb-2"><i class="fas fa-sun"></i> UV Index: ${Math.round(
          uvIndex
        )} - ${getUVIndexLabel(Math.round(uvIndex))}</div>
        <div class="weather-data-precipitation mb-2"><i class="fas fa-cloud-rain"></i> Precipitation: ${precipitationSum}</div>
        <div class="weather-data-weather mb-2r"><i class="${getWeatherIcon(
          weatherCode
        )}"></i> Weather: ${prettyPrintWeatherCode(weatherCode)}</div>
      </div>
    `;
  };

  const handleMapLoad = (map) => {
    if (map) {
      setMap(map);
    }
  };
  const getWeatherApiURL = (
    lat,
    lng,
    durationInDays,
    timezone = getTimeZone()
  ) => {
    return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=visibility,uv_index,temperature_2m,apparent_temperature,precipitation_probability,precipitation,rain,snowfall,snow_depth,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum&temperature_unit=${getMetricData()}&timezone=${timezone}&windspeed_unit=mph&current_weather=true&forecast_days=${durationInDays}`;
  };
  const convertDurationToHours = (durationText) => {
    const daysRegex = /(\d+) day/;
    const hoursRegex = /(\d+) hour/;
    const daysMatch = durationText.match(daysRegex);
    const hoursMatch = durationText.match(hoursRegex);
    const days = daysMatch ? parseInt(daysMatch[1]) : 0;
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    return days * 24 + hours;
  };
  const convertDurationToDays = (durationText) => {
    const daysRegex = /(\d+) day/;
    const hoursRegex = /(\d+) hour/;
    const daysMatch = durationText.match(daysRegex);
    const hoursMatch = durationText.match(hoursRegex);
    const days = daysMatch ? parseInt(daysMatch[1]) : 0;
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    return Math.ceil((days * 24 + hours) / 24) + 1;
  };
  const handleFindRoute = async () => {
    try {
      setDirections(null);

      // Clear previous markers and routes
      // if (directions) {
      //   directions.setMap(null);
      // }
      // previousMarkers.forEach((marker) => marker.setMap(null));

      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      const routes = await directionsService.route({
        origin: startLocationRef.current.value,
        destination: endLocationRef.current.value,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode[travelMode],
        drivingOptions: {
          departureTime: new Date(Date.now()),
          // eslint-disable-next-line no-undef
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
      });

      const route = routes.routes[0];

      // eslint-disable-next-line no-undef
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(route.legs[0].start_location);
      bounds.extend(route.legs[0].end_location);
      map.fitBounds(bounds);
      setDistance(route.legs[0].distance.text);
      setDuration(route.legs[0].duration.text);
      console.log("Disance & Duration");
      console.log(route.legs[0].distance.text);
      console.log(route.legs[0].duration.text);
      const durationInHours = convertDurationToHours(
        route.legs[0].duration.text
      );
      const durationInDays = convertDurationToDays(route.legs[0].duration.text);

      const startTimeZone = tzlookup(
        route.legs[0].start_location.lat(),
        route.legs[0].start_location.lng()
      );
      const endTimeZone = tzlookup(
        route.legs[0].end_location.lat(),
        route.legs[0].end_location.lng()
      );

      const currentTime = DateTime.now()
        .setZone(startTimeZone)
        .toFormat("yyyy-MM-dd HH:mm")

      const endTime = DateTime.now()
        .setZone(endTimeZone)
        .plus({ hours: durationInHours })
        .toFormat("yyyy-MM-dd HH:mm")

      
        const currentTimeIndex = DateTime.now()
        .setZone(startTimeZone)
        .startOf("hour")
        .toFormat("yyyy-MM-dd,HH:mm")
        .split(",")
        .join("T");

      const endTimeIndex = DateTime.now()
        .setZone(endTimeZone)
        .startOf("hour")
        .plus({ hours: durationInHours })
        .toFormat("yyyy-MM-dd,HH:mm")
        .split(",")
        .join("T");

      const startLocationWeatherAPIUrl = getWeatherApiURL(
        route.legs[0].start_location.lat(),
        route.legs[0].start_location.lng(),
        1,
        startTimeZone
      );
      const endLocationWeatherAPIUrl = getWeatherApiURL(
        route.legs[0].end_location.lat(),
        route.legs[0].end_location.lng(),
        durationInDays,
        endTimeZone
      );

      try {
        setIsLoadingWeatherData(true);
        const startLocationWeatherresponse = await fetch(
          startLocationWeatherAPIUrl
        );
        const startLocationWeatherData =
          await startLocationWeatherresponse.json();
        console.log("start location Weather Data ", startLocationWeatherData);
        // const startLocWeatherDataText = getWeatherDataText(
        //   startLocationWeatherData,
        //   currentTime
        // );

        const startLocWeatherDataText = getWeatherDataHtml(
          startLocationWeatherData,
          currentTime,
          currentTimeIndex
        );
        const endLocationWeatherresponse = await fetch(
          endLocationWeatherAPIUrl
        );
        const endLocationWeatherData = await endLocationWeatherresponse.json();
        console.log("end location Weather Data ", endLocationWeatherData);
        // const endLocWeatherDataText = getWeatherDataText(
        //   endLocationWeatherData,
        //   endTime
        // );

        const endLocWeatherDataText = getWeatherDataHtml(
          endLocationWeatherData,
          endTime,
          endTimeIndex
        );
        // create markers for start and end locations
        // eslint-disable-next-line no-undef
        const startMarker = new google.maps.Marker({
          position: route.legs[0].start_location,
          map: map,
          title: startLocWeatherDataText,
          icon: {
            url: "https://icons-for-free.com/iconfiles/png/512/cloudy+day+forecast+sun+sunny+weather+icon-1320195254084556383.png",
            //eslint-disable-next-line no-undef
            scaledSize: new google.maps.Size(40, 40),
          },
          zIndex: 1999,
        });
        // eslint-disable-next-line no-undef
        const endMarker = new google.maps.Marker({
          position: route.legs[0].end_location,
          map: map,
          title: endLocWeatherDataText,
          icon: {
            url: "https://icons-for-free.com/iconfiles/png/512/cloudy+day+forecast+sun+sunny+weather+icon-1320195254084556383.png",
            //eslint-disable-next-line no-undef
            scaledSize: new google.maps.Size(40, 40),
          },
          zIndex: 1999,
        });
        endMarker.addListener("click", function () {
          // open info window
          // eslint-disable-next-line no-undef
          // const infoWindow = new google.maps.InfoWindow({
          //   content:
          //     '<div style="color: black; padding: 10px;"><h6 style="margin: 0 0 10px;">Weather Forecast</h6><p style="margin: 0;">' +
          //     endLocWeatherDataText +
          //     "</p></div>",
          // });

          // eslint-disable-next-line no-undef
          const infoWindow = new google.maps.InfoWindow({
            content:
              `<div style="color: black; padding: 10px;"><h6 style="margin: 0 0 10px;">${routes.request.destination.query}</h6>
              ${endLocWeatherDataText}
              </div>`,
          });

          infoWindow.open(map, endMarker);
          infoWindow.setOptions({
            // eslint-disable-next-line no-undef
            pixelOffset: new google.maps.Size(0, -30),
            maxWidth: 200,
          });

          // info window style
          const infoWindowStyle = `
          .gm-style-iw {
              background-color: #fff;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
              border-radius: 5px;
          }
      `;

          const style = document.createElement("style");
          style.type = "text/css";
          style.appendChild(document.createTextNode(infoWindowStyle));
          document.head.appendChild(style);
        });
        startMarker.addListener("click", function () {
          // open info window
          // eslint-disable-next-line no-undef
          // const infoWindow = new google.maps.InfoWindow({
          //   content:
          //     '<div style="color: black; padding: 10px;"><h6 style="margin: 0 0 10px;">Weather Forecast</h6><p style="margin: 0;">' +
          //     startLocWeatherDataText +
          //     "</p></div>",
          // });

          // eslint-disable-next-line no-undef
          const infoWindow = new google.maps.InfoWindow({
            content:
              `<div style="color: black; padding: 10px;"><h6 style="margin: 0 0 10px;">${routes.request.origin.query}</h6>
              ${startLocWeatherDataText}
              </div>`,
          });

          infoWindow.open(map, startMarker);
          infoWindow.setOptions({
            // eslint-disable-next-line no-undef
            pixelOffset: new google.maps.Size(0, -30),
            maxWidth: 200,
          });
          const infoWindowStyle = `
          .gm-style-iw {
              background-color: #fff;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
              border-radius: 5px;
          }
      `;

          const style = document.createElement("style");
          style.type = "text/css";
          style.appendChild(document.createTextNode(infoWindowStyle));
          document.head.appendChild(style);
        });
        startMarker.setMap(map);
        endMarker.setMap(map);
        // setPreviousMarkers([startMarker, endMarker]);
      } catch (error) {
        console.error("Error finding weather.", error);
        handleSnackBar("Error finding weather. Please try again.");
      } finally {
        setIsLoadingWeatherData(false);
      }

      setDirections(routes);
    } catch (error) {
      console.error("Error finding route.", error);
      handleSnackBar("Error finding route. Please try again.");
    }
  };
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const handleSnackBar = (message) => {
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };
  const getCurrentStartLocation = () => {
    dispatch(setLocation(location.current));
    setStartLocation(location.current.name);
  };

  const getCurrentEndLocation = () => {
    dispatch(setLocation(location.current));
    setEndLocation(location.current.name);
  };

  const setStartLocation = (location) => {
    if (startLocationRef.current) {
      startLocationRef.current.value = location;
    }
  };

  const setEndLocation = (location) => {
    if (endLocationRef.current) {
      endLocationRef.current.value = location;
    }
  };

  return (
    <div className="mt-4 row">
      {isLoadingWeatherData ? (
        <div
          style={{
            display: "flex",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -180%)",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <></>
      )}
      <div className="mb-4 col-12 col-md-4">
        <Autocomplete>
          <TextField
            style={{
              paddingLeft: "10px",
            }}
            fullWidth
            placeholder="Start location"
            inputRef={startLocationRef}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    style={{ color: sys_theme.palette.text.primary }}
                  />
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="end">
                  <LocationSearchingIcon
                    style={{
                      cursor: "pointer",
                      color: sys_theme.palette.text.primary,
                    }}
                    onClick={getCurrentStartLocation}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Autocomplete>
      </div>
      <div className="mb-4 col-12 col-md-4">
        <Autocomplete>
          <TextField
            fullWidth
            placeholder="End location"
            inputRef={endLocationRef}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    style={{ color: sys_theme.palette.text.primary }}
                  />
                </InputAdornment>
              ),
              // startAdornment: (
              //   <InputAdornment position="end">
              //     <LocationSearchingIcon
              //       style={{
              //         cursor: "pointer",
              //         color: sys_theme.palette.text.primary,
              //       }}
              //       onClick={getCurrentEndLocation}
              //     />
              //   </InputAdornment>
              // ),
            }}
          />
        </Autocomplete>
      </div>
      <div className="mb-4 col-12 col-md-2">
        <FormControl fullWidth>
          <InputLabel>Mode</InputLabel>
          <Select
            value={travelMode}
            onChange={(e) => setTravelMode(e.target.value)}
          >
            <MenuItem value={"DRIVING"}>Driving</MenuItem>
            <MenuItem value={"WALKING"}>Walking</MenuItem>
            <MenuItem value={"BICYCLING"}>Bicycling</MenuItem>
            <MenuItem value={"TRANSIT"}>Transit</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div
        className="mb-4 col-12 col-md-2"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleFindRoute}
          fullWidth
          style={{ width: "100%", height: "100%" }}
        >
          Find Route
        </Button>
      </div>
      <div className="routes-map">
        {!isLoaded ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "500px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <GoogleMap
            center={initialCenter}
            zoom={initialZoom}
            mapContainerStyle={{ width: "100%", height: "500px" }}
            options={{
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
              weatherControl: true,
            }}
            onLoad={handleMapLoad}
          >
            <TrafficLayer autoUpdate />

            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        )}
      </div>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackBarClose}
          severity="error"
        >
          {snackBarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
