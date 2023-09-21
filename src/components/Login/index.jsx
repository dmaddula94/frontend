import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Handle login logic here
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
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        className="mb-3"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button
        className="mb-3 w-50"
        variant="contained"
        color="primary"
        onClick={handleLogin}
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
    </Box>
  );
}

export default Login;
