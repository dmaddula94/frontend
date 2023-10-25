import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  TrafficLayer,
} from '@react-google-maps/api';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { useRef, useState } from 'react';
import {
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../../redux/reducers/locationSlice';

import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import { prettyPrintWeatherCode } from '../../utils/weather';
import { getMetricData, getTimeZone } from '../../utils/openmeteo';

export default function GoogleMapRoutes() {
  const startLocationRef = useRef();
  const endLocationRef = useRef();
  const dispatch = useDispatch();
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState('');
  const [isLoadingWeatherData, setIsLoadingWeatherData] = useState(false);
  const [duration, setDuration] = useState('');
  const location = useSelector((state) => {
    return state.location;
  });
  const sys_theme = useTheme();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCm8tykVzUw05yjP4qfvO9Qx69VH6miAAw',
    libraries: ['places'],
  });
  const initialCenter = { lat: location.latitude, lng: location.longitude };
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const initialZoom = 10;

  const getWeatherDataText = (apiResponse) => {
    const dailyData = apiResponse.daily;
    const lastIdx = dailyData.apparent_temperature_max.length - 1;

    const apparentTempMax = dailyData.apparent_temperature_max[lastIdx];
    const apparentTempMin = dailyData.apparent_temperature_min[lastIdx];
    const precipitationSum = dailyData.precipitation_sum[lastIdx];
    const weatherCode = dailyData.weathercode[lastIdx];

    // data
    const dataText =
      `Temp Max: ${apparentTempMax} ${
        getMetricData() == 'fahrenheit' ? '°F' : '°C'
      }<br>` +
      `Temp Min: ${apparentTempMin} ${
        getMetricData() == 'fahrenheit' ? '°F' : '°C'
      }<br>` +
      `Precipitation: ${precipitationSum}<br>` +
      `Weather: ${prettyPrintWeatherCode(weatherCode)}`;

    return dataText;
  };
  const handleMapLoad = (map) => {
    if (map) {
      setMap(map);
    }
  };
  const getWeatherApiURL = (lat, lng, durationInHours) => {
    return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=visibility,uv_index,temperature_2m,apparent_temperature,precipitation_probability,precipitation,rain,snowfall,snow_depth,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum&temperature_unit=${getMetricData()}&timezone=${getTimeZone()}&windspeed_unit=mph&current_weather=true&forecast_hours=${durationInHours}`;
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
  const handleFindRoute = async () => {
    try {
      setDirections(null);
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      const routes = await directionsService.route({
        origin: startLocationRef.current.value,
        destination: endLocationRef.current.value,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
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
      console.log('Disance & Duration');
      console.log(route.legs[0].distance.text);
      console.log(route.legs[0].duration.text);
      const durationInHours = convertDurationToHours(
        route.legs[0].duration.text
      );
      const startLocationWeatherAPIUrl = getWeatherApiURL(
        route.legs[0].start_location.lat(),
        route.legs[0].start_location.lng(),
        durationInHours
      );
      const endLocationWeatherAPIUrl = getWeatherApiURL(
        route.legs[0].end_location.lat(),
        route.legs[0].end_location.lng(),
        durationInHours
      );
      try {
        setIsLoadingWeatherData(true);
        const startLocationWeatherresponse = await fetch(
          startLocationWeatherAPIUrl
        );
        const startLocationWeatherData =
          await startLocationWeatherresponse.json();
        console.log('start location Weather Data ', startLocationWeatherData);
        const stratLocWeatherDataText = getWeatherDataText(
          startLocationWeatherData
        );
        const endLocationWeatherresponse = await fetch(
          endLocationWeatherAPIUrl
        );
        const endLocationWeatherData = await endLocationWeatherresponse.json();
        console.log('end location Weather Data ', endLocationWeatherData);
        const endLocWeatherDataText = getWeatherDataText(
          endLocationWeatherData
        );
        // create markers for start and end locations
        // eslint-disable-next-line no-undef
        const startMarker = new google.maps.Marker({
          position: route.legs[0].start_location,
          map: map,
          title: stratLocWeatherDataText,
          icon: {
            url: 'https://icons-for-free.com/iconfiles/png/512/cloudy+day+forecast+sun+sunny+weather+icon-1320195254084556383.png',
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
            url: 'https://icons-for-free.com/iconfiles/png/512/cloudy+day+forecast+sun+sunny+weather+icon-1320195254084556383.png',
            //eslint-disable-next-line no-undef
            scaledSize: new google.maps.Size(40, 40),
          },
          zIndex: 1999,
        });
        endMarker.addListener('click', function () {
          // open info window
          // eslint-disable-next-line no-undef
          const infoWindow = new google.maps.InfoWindow({
            content:
              '<div style="color: black; padding: 10px;"><h3 style="margin: 0 0 10px;">Weather Forecast</h3><p style="margin: 0;">' +
              endLocWeatherDataText +
              '</p></div>',
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

          const style = document.createElement('style');
          style.type = 'text/css';
          style.appendChild(document.createTextNode(infoWindowStyle));
          document.head.appendChild(style);
        });
        startMarker.addListener('click', function () {
          // open info window
          // eslint-disable-next-line no-undef
          const infoWindow = new google.maps.InfoWindow({
            content:
              '<div style="color: black; padding: 10px;"><h3 style="margin: 0 0 10px;">Weather Forecast</h3><p style="margin: 0;">' +
              stratLocWeatherDataText +
              '</p></div>',
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

          const style = document.createElement('style');
          style.type = 'text/css';
          style.appendChild(document.createTextNode(infoWindowStyle));
          document.head.appendChild(style);
        });
        startMarker.setMap(map);
        endMarker.setMap(map);
      } catch (error) {
        console.error('Error finding weather.', error);
        handleSnackBar('Error finding weather. Please try again.');
      } finally {
        setIsLoadingWeatherData(false);
      }

      setDirections(routes);
    } catch (error) {
      console.error('Error finding route.', error);
      handleSnackBar('Error finding route. Please try again.');
    }
  };
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const handleSnackBar = (message) => {
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
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
    <div className="mt-4">
      {isLoadingWeatherData ? (
        <div
          style={{
            display: 'flex',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -180%)',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px',
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <></>
      )}
      <div className="mb-4">
        <Autocomplete>
          <TextField
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
                      cursor: 'pointer',
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
      <div className="mb-4">
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
              startAdornment: (
                <InputAdornment position="end">
                  <LocationSearchingIcon
                    style={{
                      cursor: 'pointer',
                      color: sys_theme.palette.text.primary,
                    }}
                    onClick={getCurrentEndLocation}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Autocomplete>
      </div>
      <div
        className="mb-4"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Button
          className={`button-width`}
          variant="contained"
          color="primary"
          onClick={handleFindRoute}
          fullWidth
        >
          Find Route
        </Button>
      </div>
      <div className="routes-map">
        {!isLoaded ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px',
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <GoogleMap
            center={initialCenter}
            zoom={initialZoom}
            mapContainerStyle={{ width: '100%', height: '400px' }}
            options={{
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
              weatherControl: true,
            }}
            onLoad={handleMapLoad}
          >
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        )}
      </div>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
