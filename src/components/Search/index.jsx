import React, { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { TextField, InputAdornment } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { setLocation } from "../../redux/reducers/locationSlice";

export default function Search() {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location);
  const [searchQuery, setSearchQuery] = useState("");
  const sys_theme = useTheme();
  const searchBoxRef = useRef();

  const getCurrentLocation = () => {
    dispatch(setLocation(location.current));
    setSearchQuery(location.current.name);
  };

  const onPlacesChanged = useCallback(() => {
    const places = searchBoxRef.current.getPlaces();
    const place = places[0];
    if (place) {
      const {
        name,
        geometry: { location },
      } = place;
      dispatch(
        setLocation({
          latitude: location.lat(),
          longitude: location.lng(),
          name: name,
        })
      );

      setSearchQuery(name);
    }
  }, []);
  return (
    <StandaloneSearchBox
      onLoad={(ref) => (searchBoxRef.current = ref)}
      onPlacesChanged={onPlacesChanged}
    >
      <TextField
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search Location"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ color: sys_theme.palette.text.primary }} />
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="end">
              <LocationSearchingIcon
                style={{
                  cursor: "pointer",
                  color: sys_theme.palette.text.primary,
                }}
                onClick={getCurrentLocation}
              />
            </InputAdornment>
          ),
        }}
      />
    </StandaloneSearchBox>
  );
}
