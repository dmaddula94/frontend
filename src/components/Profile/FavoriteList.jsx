import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PlaceIcon from "@mui/icons-material/Place";
import Realtime from "../CurrentWeather/v2/Realtime";
import ClearIcon from "@mui/icons-material/Clear";
import api from "../../api";
import { setFavoriteLocationsList } from "../../redux/reducers/weatherSlice";
import { setLocation } from "../../redux/reducers/locationSlice";
import { update } from "../../redux/reducers/userSlice";
import { useSnackbar } from "notistack";

function FavoriteList({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { locations } = user;
  const [favLocations, setFavLocations] = useState(locations);

  const deleteLocation = async (e, location) => {
    e.stopPropagation();
    try {
      const { data } = await api.patch("/userLocation", {
        _id: location._id,
      });
      enqueueSnackbar("Location Removed!", { variant: "success" });
      dispatch(update({ user: data }));
      dispatch(
        setFavoriteLocationsList({ favoriteLocationsList: data.location })
      );
    } catch (error) {
      enqueueSnackbar("Error Removing Location", { variant: "error" });
      console.error("Error Removing Location:", error);
    }
  };

  useEffect(() => {
    setFavLocations(user.locations);
  }, [user]);

  const handleLocationClick = (location) => {
    const loc = {
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    };
    dispatch(setLocation(loc));
    navigate("/", {
      state: {
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      },
    });
  };

  return (
    <Box
      component={"div"}
      sx={{ padding: "20px" }}
      className="d-flex flex-column justify-content-center glassbackground border-radius p-4 p-md-5"
    >
      {favLocations.length ? (
        favLocations.map((location, i) => {
          return (
            <Card sx={{ marginBottom: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <CardContent
                  sx={{
                    flex: "1 0 auto",
                    cursor: "pointer",
                    backgroundImage: `url('/backgrounds/${location.weatherbackground}.gif')`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                  onClick={() => handleLocationClick(location)}
                >
                  <div className="glassy-overlay"></div>
                  <div style={{ width: "85%", zIndex: 1 }}>
                    <div
                      className="location"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <PlaceIcon
                        width="16"
                        height="16"
                        style={{ marginRight: "4px" }}
                      />
                      {location.name}
                    </div>
                    <Realtime
                      realtime={location}
                      isDay={location?.is_day}
                      showWeatherIcon={false}
                    />
                  </div>
                  <ClearIcon
                    style={{ marginRight: "4%", cursor: "pointer", zIndex: 2 }}
                    onClick={(e) => deleteLocation(e, location)}
                  />
                </CardContent>
              </Box>
            </Card>
          );
        })
      ) : (
        <Typography variant="h6" style={{ textAlign: "center" }}>
          You don't have any favorite locations.
        </Typography>
      )}
    </Box>
  );
}

export default FavoriteList;
