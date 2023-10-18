import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { validateEmail } from "../../utils/helpers";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    handleBlur(validateEmail, e.target.value, setEmailError);
  };

  const handleBlur = (validator, value, setter) => {
    const error = validator(value);
    setter(error);
    setIsFormValid(!error);
  };

  const handleForgotPassword = async () => {
    try {
      // API call to send reset password email
      await api.post("/forgotPassword", { email });
      setSuccess(true);
    } catch (error) {
      setSuccess(false);
      console.error("Error during password reset:", error);
      // Handle any error messages or alerts here
    }
  };

  return (
    <Box
      component={"div"}
      sx={{ padding: "20px", margin: "10px auto" }}
      className="col-xl-6 d-flex flex-column align-items-center justify-content-center glassbackground border-radius p-5"
    >
      <Typography className="mb-3" variant="h4" align="center">
        Forgot Password
      </Typography>
      {!success ? (
        <>
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => handleBlur(validateEmail, email, setEmailError)}
            error={!!emailError}
            helperText={emailError}
            fullWidth
            className="mb-3"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleForgotPassword}
            className="mb-3 w-50"
            disabled={!isFormValid}
          >
            Send Reset Link
          </Button>
        </>
      ) : (
        <Typography className="mb-3" variant="body2" align="center">
          Check your email for a link to reset your password.{" "}
          <span>
            <Link
              component="button"
              variant="body2"
              onClick={() => setSuccess(false)}
              className="mb-3 w-50"
            >
              Re-enter Email?
            </Link>
          </span>
        </Typography>
      )}
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

export default ForgotPassword;
