import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import api from "../../api";
import { Stack } from "@mui/material";
import { Switch } from "@mui/material";
import { useDispatch } from "react-redux";
import { update } from "../../redux/reducers/userSlice";
import { useSnackbar } from "notistack";

function ProfileInfo({ user }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { firstName, lastName, phoneNumber, email, alerts, metric } = user;

  const [isEditing, setIsEditing] = useState(false);
  const [userFirstname, setUserFirstName] = useState(firstName);
  const [userLastName, setUserLastName] = useState(lastName);
  const [mobileNumber, setMobileNumber] = useState(phoneNumber);
  const [enableAlerts, setEnableAlerts] = useState(alerts);
  const [isCelsius, setIsCelsius] = useState(metric);
  const [isDesktop] = useState(window.innerWidth > 768);

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        const response = await api.patch("/user", {
          _id: user._id,
          firstName: userFirstname,
          lastName: userLastName,
          phoneNumber: mobileNumber,
          alerts: enableAlerts,
          metric: isCelsius,
        });
        enqueueSnackbar("Profile Updated!", { variant: "success" });
        dispatch(update({ user: response.data }));
        setIsEditing(!isEditing);
      } catch (error) {
        enqueueSnackbar("Error Updating Profile", { variant: "error" });
        console.error("Error Updating Profile:", error);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleToggle = (event) => {
    setIsCelsius(event.target.checked);
  };

  return  (
    <Box
    className={`d-flex flex-column justify-content-center glassbackground border-radius p-4 p-md-5 mobile-full-width`}
      sx={{
        padding: "20px",
        // maxWidth: "100%",
        // width: "100%",
        margin: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Avatar sx={{ width: 120, height: 120, fontSize: "3rem" }}>
          {`${firstName[0]}${lastName[0]}`}
        </Avatar>

        <Box
          width="100%"
          mt={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {isEditing ? (
            <>
              <TextField
                label="First Name"
                value={userFirstname}
                onChange={(e) => setUserFirstName(e.target.value)}
                margin="normal"
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Last Name"
                value={userLastName}
                onChange={(e) => setUserLastName(e.target.value)}
                margin="normal"
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Phone Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={isCelsius}
                    onChange={handleToggle}
                    color="primary"
                  />
                }
                label={isCelsius ? "°C" : "°F"}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enableAlerts}
                    onChange={() => setEnableAlerts(!enableAlerts)}
                  />
                }
                label="Enable Text and Email Alerts"
              />
            </>
          ) : (
            <>
              <Typography variant="h5" gutterBottom>
                {`${userFirstname}, ${userLastName}`}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {email}
              </Typography>
              <Typography variant="body1" paragraph>
                {mobileNumber}
              </Typography>
            </>
          )}

          <Stack spacing={2} mt={2} direction="column" alignItems="center" sx={{ width: "100%" }}>
            <Button className={`button-width`} variant="contained" color="primary" onClick={handleEditClick} fullWidth>
              {isEditing ? "Save" : "Edit Profile"}
            </Button>
            {isEditing && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(!isEditing)}
                className={`button-width`}
              >
                Cancel
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
   
}

export default ProfileInfo;
