import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validatePassword, validateConfirmPassword } from "../../utils/helpers";

function ResetPassword() {
  const navigate = useNavigate();
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

    if (!validatePassword(password)) isValid = false;
    if (!validateConfirmPassword(password, confirmPassword)) isValid = false;

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
      sx={{ padding: "20px", transform: "translate(50%, 20px)" }}
      className="col-6 d-flex flex-column align-items-center justify-content-center glassbackground border-radius p-5"
    >
      <Typography className="mb-3" variant="h4" align="center">
        Reset Password
      </Typography>
      <TextField
        error={!!passwordError}
        helperText={passwordError}
        onBlur={() => handleBlur(validatePassword, password, setPasswordError)}
        label="New Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        className="mb-3"
      />
      <TextField
        error={!!confirmPasswordError}
        helperText={confirmPasswordError}
        onBlur={() => handleBlur(validateConfirmPassword, confirmPassword, setConfirmPasswordError, password)}
        label="Confirm New Password"
        type="password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        required
        className="mb-3"
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
