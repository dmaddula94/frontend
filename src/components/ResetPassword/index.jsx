import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { validatePassword, validateConfirmPassword } from "../../utils/helpers";

function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleBlur = (validator, value, setter, value2) => {
    const error = validator(value, value2);
    setter(error);
    validate();
  };

  const validate = () => {
    let isValid = true;

    if (validatePassword(password)) isValid = false;
    if (validateConfirmPassword(password, confirmPassword)) isValid = false;
    
    setIsFormValid(isValid);

    return isValid;
  }

  const handleResetPassword = async () => {
    if (!validate()) {
      return;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get("email");
      const token = urlParams.get("access-token");
      await axios.post("https://us-central1-marist-weather-dashboard.cloudfunctions.net/api/resetPassword", { email, password }, {
        headers: {
          Authorization: `${token}`,
        },
      });
      navigate("/login");
    } catch (error) {
      console.error("Error during password reset:", error);
      // Handle any error messages or alerts here
    }
  };

  return (
    <Box
      component={"div"}
      sx={{ padding: "20px",  margin: "10px auto" }}
      className="col-xl-6 d-flex flex-column align-items-center justify-content-center glassbackground border-radius p-5"
    >
      <Typography className="mb-3" variant="h4" align="center">
        Reset Password
      </Typography>
      <TextField
        type={showPassword ? "text" : "password"}
        required
        label="New Password"
        className="mb-3"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => handleBlur(validatePassword, password, setPasswordError)}
        error={!!passwordError}
        helperText={passwordError}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        type={showConfirmPassword ? "text" : "password"}
        label="Confirm New Password"
        className="mb-3"
        variant="outlined"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onBlur={() => handleBlur(validateConfirmPassword, confirmPassword, setConfirmPasswordError, password)}
        error={!!confirmPasswordError}
        helperText={confirmPasswordError}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleResetPassword}
        className="mb-3 w-50"
        disabled={!isFormValid}
      >
        Reset Password
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/login")}
        className="mb-3 w-50"
      >
        Back to Login
      </Button>
    </Box>
  );
}

export default ResetPassword;
