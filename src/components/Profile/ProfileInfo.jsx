import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import api from "../../api";
import { Stack } from '@mui/material';

function ProfileInfo({ user }) {
  const { firstName, lastName, phoneNumber, email, alerts } = user;

  const [isEditing, setIsEditing] = useState(false);
  const [userFirstname, setUserFirstName] = useState(firstName);
  const [userLastName, setUserLastName] = useState(lastName);
  const [mobileNumber, setMobileNumber] = useState(phoneNumber);
  const [enableAlerts, setEnableAlerts] = useState(alerts);

  const handleEditClick = async () => {
    if (isEditing) {
      await api.patch('user', {
        email,
        firstName: userFirstname,
        lastName: userLastName,
        alerts: enableAlerts,
        phoneNumber: mobileNumber
      });
    }
    setIsEditing(!isEditing);
  };

  return (
    <Box
      component={"div"}
      sx={{ padding: "20px", marginTop: "50px" }}
      className="d-flex flex-column justify-content-center glassbackground border-radius p-5"
    >
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Avatar sx={{ width: 120, height: 120, fontSize: "3rem" }} >
          {`${firstName[0]}${lastName[0]}`}
        </Avatar>

        {isEditing && (
          <TextField
            label="First Name"
            value={userFirstname}
            onChange={(e) => setUserFirstName(e.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
          />
        )}

        {isEditing && (
          <TextField
            label="Last Name"
            value={userLastName}
            onChange={(e) => setUserLastName(e.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
          />
        )}

        {!isEditing && <Typography variant="h5" gutterBottom>
          {`${userFirstname} ${userLastName}`}
        </Typography>}

        {isEditing ? (
          <TextField
            label="Email"
            value={email}
            margin="normal"
            variant="outlined"
            disabled
            fullWidth
          />
        ) : (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {email}
          </Typography>
        )}

        {isEditing ? (
          <TextField
            label='Phone Number'
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
          />
        ) : (
          <Typography variant="body1" paragraph>
            {mobileNumber}
          </Typography>
        )}

        {isEditing &&
          <FormControlLabel
            control={
              <Checkbox
                checked={enableAlerts}
                onChange={() => setEnableAlerts(!enableAlerts)}
                className="mb-1"
              />
            }
            label="Enable Text and Email Alerts"
          />
        }
        <Stack spacing={2} direction="row">
          <Button variant="contained" color="primary" onClick={handleEditClick}>
            {isEditing ? 'Save' : 'Edit Profile'}
          </Button>

          {isEditing && <Button variant="contained" color="primary" onClick={() => setIsEditing(!isEditing)}>
            Cancel
          </Button>}
        </Stack>
      </Box>
    </Box>
  );
}

export default ProfileInfo;
