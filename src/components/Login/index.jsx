import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { login } from "../../redux/reducers/userSlice";
import { validateEmail, validatePassword } from "../../utils/helpers";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
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
        dispatch(login({ user: response.data.user, token: response.data.token }));
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
      sx={{ padding: "20px", transform: "translate(50%, 20px)" }}
      className="col-6 d-flex flex-column align-items-center justify-content-center glassbackground border-radius p-5"
    >
      <Box className="mb-3" component={"div"}>
        <img
          width="240"
          src={`${theme.darkMode ? "/logo-short.svg" : "/logo-short-dark.svg"}`}
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
        label="Password"
        type="password"
        className="mb-3"
        variant="outlined"
        value={password}
        onChange={handlePasswordChange}
        onBlur={() => handleBlur(validatePassword, password, setPasswordError)}
        error={!!passwordError}
        helperText={passwordError}
        fullWidth
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