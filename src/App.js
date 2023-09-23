import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lightTheme, darkTheme } from "./theme";
import Header from "./components/Header";
import "./App.scss";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Loader from "./Loader";
import Home from "./components/Home";

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const theme = useSelector((state) => state.theme);
  const weather = useSelector((state) => state.weather);


  return (
    <ThemeProvider theme={theme.darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Loader />
        <div
          style={{
            height: "100vh",
            backgroundImage: `url('/${weather.background}.gif')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
          className={`${theme.darkMode ? "dark-mode" : "light-mode"}`}
        >
          <div className="glassy-overlay"></div>
          <div style={{ position: "relative" }} className={`content`}>
            <Header />
            <div className="container">
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
