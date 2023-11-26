/* eslint-disable no-undef */
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
import { askQuestion } from "../../utils/openai";
import api from "../../api";

export default function GoogleMapRoutes() {
  const startLocationRef = useRef();
  const endLocationRef = useRef();
  const dispatch = useDispatch();
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [isLoadingWeatherData, setIsLoadingWeatherData] = useState(false);
  const [duration, setDuration] = useState("");
  const [query, setQuery] = useState("tourist attractions");
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
  const [markers, setMarkers] = useState([]);

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

  const getWeatherDataHtml = (apiResponse, time, timeIndex, city) => {
    const hourly = apiResponse.hourly;
    // const current = apiResponse.current_weather;
    const index = hourly.time.indexOf(timeIndex);
    const current = hourly.temperature_2m[index];
    const apparentTemp = hourly.apparent_temperature[index];
    const uvIndex = hourly.uv_index[index];
    const precipitationSum = hourly.precipitation[index];
    const weatherCode = hourly.weathercode[index];

    // console.log(`city: ${city} :::: timeIndex: ${timeIndex} ::::: index: ${index} :::: ${current}`);

    return `
      <div class="weather-data">
        <div class="weather-data-time mb-2"><i class="fas fa-clock"></i> ${time}</div>
        <div class="weather-data-temperature mb-2"><i class="fas fa-thermometer-half"></i> ${Math.round(
          current
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

  const fetchTouristAttractions = async (start, end, waypoints) => {
    const { data } = await api.post("/bot/attractions", {
      start,
      end,
      waypoints,
      query
    });
    return data.attractions;
  };

  async function getRoute(directionsService) {
    return await directionsService.route({
      origin: startLocationRef.current.value,
      destination: endLocationRef.current.value,
      travelMode: google.maps.TravelMode[travelMode],
      drivingOptions: {
        departureTime: new Date(Date.now()),
        trafficModel: google.maps.TrafficModel.BEST_GUESS,
      },
    });
  }

  function updateMapBounds(route) {
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(route.legs[0].start_location);
    bounds.extend(route.legs[0].end_location);
    map.fitBounds(bounds);
  }

  function updateRouteInfo(route) {
    setDistance(route.legs[0].distance.text);
    setDuration(route.legs[0].duration.text);
  }

  const setOtherMarkers = async (
    start_location,
    weatherAPIUrl,
    endTimeZone,
    tZone,
    dInHours,
    address,
    tourist = false
  ) => {
    let weatherResponse = await fetch(weatherAPIUrl);
    let locationWeatherData = await weatherResponse.json();
    const icon = !tourist ? "https://icons-for-free.com/iconfiles/png/512/sunny+cloudy+cloud+weather+forecast-1320568505378975061.png" : "https://icons-for-free.com/iconfiles/png/512/rain+rainbow+sign+sunny+weather+icon-1320196636747000582.png"
    let time_ = DateTime.now()
      .setZone(endTimeZone)
      .plus({ hours: dInHours })
      .toFormat("yyyy-MM-dd HH:mm");
    let timeIndex = DateTime.now()
      .setZone(tZone)
      .plus({ hours: dInHours })
      .startOf("hour")
      .toFormat("yyyy-MM-dd,HH:mm")
      .split(",")
      .join("T");
    const weatherDataText = getWeatherDataHtml(
      locationWeatherData,
      time_,
      timeIndex,
      address
    );

    // eslint-disable-next-line no-undef
    let newMarker = new google.maps.Marker({
      position: start_location,
      map: map,
      title: weatherDataText,
      icon: {
        url: icon,
        //eslint-disable-next-line no-undef
        scaledSize: new google.maps.Size(40, 40),
      },
      zIndex: 1999,
    });
    newMarker.addListener("click", function () {
      // eslint-disable-next-line no-undef
      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="color: black; padding: 10px;"><h6 style="margin: 0 0 10px;">${address}</h6>
          ${weatherDataText}
          </div>`,
      });

      infoWindow.open(map, newMarker);
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

    setMarkers((markers) => [...markers, newMarker]);
  };

  const clearMarkers = () => {
    for (let marker of markers) {
      marker.setMap(null);
    }
    setMarkers([]); // Reset the array
  };

  const handleFindRoute = async () => {
    try {
      setDirections(null);
      
      if (markers.length > 0) {
        clearMarkers();
      }

      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      let routes = await getRoute(directionsService);
      const route = routes.routes[0];
      updateMapBounds(route);
      updateRouteInfo(route);

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
        .toFormat("yyyy-MM-dd HH:mm");

      const endTime = DateTime.now()
        .setZone(endTimeZone)
        .plus({ hours: durationInHours })
        .toFormat("yyyy-MM-dd HH:mm");

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

        const startLocWeatherDataText = getWeatherDataHtml(
          startLocationWeatherData,
          currentTime,
          currentTimeIndex
        );
        const endLocationWeatherresponse = await fetch(
          endLocationWeatherAPIUrl
        );
        const endLocationWeatherData = await endLocationWeatherresponse.json();

        const endLocWeatherDataText = getWeatherDataHtml(
          endLocationWeatherData,
          endTime,
          endTimeIndex
        );

        let numWaypoints = 15;
        let len = route.legs[0].steps?.length;
        let accumulatedDuration = 0;
        let durationStep = route.legs[0].duration?.value / numWaypoints;
        let nextDurationMilestone = durationStep;

        const waypoints = [];

        const geocodePromises = [];

        for (let i = 0; i < len; i++) {
          let step = route.legs[0].steps[i];
          accumulatedDuration += step.duration.value;

          if (accumulatedDuration >= nextDurationMilestone) {
            nextDurationMilestone += durationStep;

            let lat = step.start_location.lat();
            let lng = step.start_location.lng();
            let address = '';

            // Create a promise for the geocoding operation
            const geocodePromise = new Promise((resolve, reject) => {
              const geocoder = new google.maps.Geocoder();
              const latlng = { lat: lat, lng: lng };
              geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === "OK") {
                  if (results[0]) {
                    const addressComponents = results[0].address_components;
                    let city = "";
                    let state = "";
                    for (let j = 0; j < addressComponents.length; j++) {
                      const types = addressComponents[j].types;
                      if (types.includes("locality")) {
                        city = addressComponents[j].long_name;
                      }
                      if (types.includes("administrative_area_level_1")) {
                        state = addressComponents[j].short_name;
                      }
                    }
                    address = `${city}, ${state}`;
                    resolve(address);
                  } else {
                    resolve("No results found");
                  }
                } else {
                  reject("Geocoder failed due to: " + status);
                }
              });
            });

            geocodePromises.push(geocodePromise);

            const dInHours = Math.round(accumulatedDuration / 3600);
            let dInDays = Math.ceil(dInHours / 24) + 1;
            let tZone = tzlookup(lat, lng);
            let weatherAPIUrl = getWeatherApiURL(lat, lng, dInDays, tZone);

            setOtherMarkers(
              step.start_location,
              weatherAPIUrl,
              endTimeZone,
              tZone,
              dInHours,
              address
            );
          }
        }

        Promise.all(geocodePromises)
          .then(async (addresses) => {
            addresses.forEach((address) => {
              if (address !== "No results found") {
                waypoints.push(address);
              }
            });
            try {
              const attractions = await fetchTouristAttractions(
                startLocationRef.current.value,
                endLocationRef.current.value,
                waypoints.join("; ")
              );
              attractions.forEach((element) => {
                const {
                  name,
                  state,
                  duration,
                  distance,
                  coordinates: { lat, lng },
                } = element;
                let dInDays = Math.ceil(duration / 24) + 1;
                let tZone = tzlookup(lat, lng);
                let weatherAPIUrl = getWeatherApiURL(lat, lng, dInDays, tZone);
                setOtherMarkers(
                  new google.maps.LatLng(lat, lng),
                  weatherAPIUrl,
                  endTimeZone,
                  tZone,
                  duration,
                  `${name}, ${state}`,
                  true
                );
              });
            } catch (err) {
              console.error(err);
            }
          })
          .catch((error) => {
            console.error("Error in geocoding: ", error);
          });

        // create markers for start and end locations
        // eslint-disable-next-line no-undef
        const startMarker = new google.maps.Marker({
          position: route.legs[0].start_location,
          map: map,
          title: startLocWeatherDataText,
          icon: {
            url: "https://icons-for-free.com/iconfiles/png/512/sunny+cloudy+cloud+weather+forecast-1320568505378975061.png",
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
            url: "https://icons-for-free.com/iconfiles/png/512/sunny+cloudy+cloud+weather+forecast-1320568505378975061.png",
            //eslint-disable-next-line no-undef
            scaledSize: new google.maps.Size(40, 40),
          },
          zIndex: 1999,
        });
        endMarker.addListener("click", function () {
          // eslint-disable-next-line no-undef
          const infoWindow = new google.maps.InfoWindow({
            content: `<div style="color: black; padding: 10px;"><h6 style="margin: 0 0 10px;">${routes.request.destination.query}</h6>
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
          }`;

          const style = document.createElement("style");
          style.type = "text/css";
          style.appendChild(document.createTextNode(infoWindowStyle));
          document.head.appendChild(style);
        });
        startMarker.addListener("click", function () {
          // eslint-disable-next-line no-undef
          const infoWindow = new google.maps.InfoWindow({
            content: `<div style="color: black; padding: 10px;"><h6 style="margin: 0 0 10px;">${routes.request.origin.query}</h6>
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
        setMarkers((markers) => [...markers, startMarker, endMarker]);
        startMarker.setMap(map);
        endMarker.setMap(map);
      } catch (error) {
        // console.error('Error finding weather.', error);
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
      <div className="mb-4 col-12 col-md-2">
        <FormControl fullWidth>
          <InputLabel>Attractions</InputLabel>
          <Select
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          >
            <MenuItem value={"tourist attractions"}>Tourist Attractions</MenuItem>
            <MenuItem value={"national parks"}>National Parks</MenuItem>
            <MenuItem value={"state parks"}>State Parks</MenuItem>
            <MenuItem value={"upcoming events"}>Upcoming Events</MenuItem>
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
