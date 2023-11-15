import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { useSelector } from 'react-redux';

const API_KEY = 'QnHFAzk6yin94m7rybRnPA41s9SoAMtW'; // Use your actual Tomorrow.io API key
const DATA_FIELD = 'precipitationIntensity'; // Set the field you're interested in
const TIMESTAMP = new Date().toISOString(); // Get the current ISO timestamp

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  marginTop: '10px',
  marginBottom: '10px',
};

const center = {
  lat: 42.355438,
  lng: -71.059914,
};

const WeatherMap = ({ DATA_FIELD  }) => {
  const location = useSelector((state) => state.location);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCm8tykVzUw05yjP4qfvO9Qx69VH6miAAw', // Use your actual Google Maps API key
  });
  const [center, setCenter] = useState({ lat: 42.355438, lng: -71.059914 });

  useEffect(() => {
    if (location) {
      setCenter({ lat: location.latitude, lng: location.longitude });
    }
  }, [location]);

  const [map, setMap] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    map.setZoom(1)
    map.setOptions({
      scrollWheel: false,
    })
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map) {
      const imageMapType = new window.google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {
          if (zoom > 12) {
            return null;
          }
          return `https://api.tomorrow.io/v4/map/tile/${zoom}/${coord.x}/${coord.y}/${DATA_FIELD}/${TIMESTAMP}.png?apikey=${API_KEY}`;
        },
        tileSize: new window.google.maps.Size(256, 256),
      });

      map.overlayMapTypes.push(imageMapType);
    }
  }, [map]);

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      id="weather-map"
      mapContainerStyle={mapContainerStyle}
      // center={center}
      zoom={1}
      onLoad={onLoad}
      onUnmount={onUnmount}
      height={300}
      width={300}
    >
      {/* Child components, such as markers, info windows, etc. */}
    </GoogleMap>
  );
};

export default WeatherMap;
