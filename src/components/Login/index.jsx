import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../../api";
import { login } from "../../redux/reducers/userSlice";
import { validateEmail, validatePassword } from "../../utils/helpers";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    handleBlur(validateEmail, e.target.value, setEmailError);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    handleBlur(validatePassword, e.target.value, setPasswordError);
  };

  const handleBlur = (validator, value, setter) => {
    const error = validator(value);
    setter(error);
    setIsFormValid(!error);
  };

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", { email, password });
      if (response.data && response.data.token) {
        dispatch(
          login({ user: response.data, token: response.data.token })
        );
        sessionStorage.setItem("email", response.data.email)
        navigate("/");
      } else {
        console.error("Failed to login");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Box
    component={"div"}
    sx={{
      padding: "20px",
      margin: "10px auto",
    }}
    className="col-xl-6 d-flex flex-column align-items-center justify-content-center glassbackground border-radius p-5"
  >
    <Box className="mb-3" component={"div"}>
      <img
        width="240"
        src={`/logo-short${theme.darkMode ? "-dark" : ""}.svg`}
        alt="Marist Weather Dashboard Logo"
      />
    </Box>
    <Typography className="mb-3" variant="h4" align="center">
      Login
    </Typography>
    <TextField
      type="email"
      label="Email"
      className="mb-3"
      variant="outlined"
      value={email}
      onChange={handleEmailChange}
      onBlur={() => handleBlur(validateEmail, email, setEmailError)}
      error={!!emailError}
      helperText={emailError}
      fullWidth
    />
    <TextField
      type={showPassword ? "text" : "password"}
      label="Password"
      className="mb-3"
      variant="outlined"
      value={password}
      onChange={handlePasswordChange}
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
    <Button
      className="mb-3 w-50"
      variant="contained"
      color="primary"
      onClick={handleLogin}
      disabled={!isFormValid}
    >
      Login
    </Button>
    <Button
      className="mb-3 w-50"
      variant="outlined"
      color="secondary"
      onClick={() => navigate("/signup")}
    >
      Sign Up
    </Button>
    <Link
      component="button"
      variant="body2"
      onClick={() => navigate("/forgot-password")}
      className="mb-3 w-50"
    >
      Forgot Password?
    </Link>
  </Box>
);
}

export default Login;
