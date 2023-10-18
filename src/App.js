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
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ChatBot from "./components/ChatBot";

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const theme = useSelector((state) => state.theme);
  const weather = useSelector((state) => state.weather);
  const [showChatbot, setShowChatbot] = React.useState(false);

  React.useEffect(() => {
    document.body.className = ''; // Clear any existing classes
    document.body.classList.add(`${theme.darkMode ? "dark-mode" : "light-mode"}`); // Add the current theme as a class
  }, [theme]);


  return (
    <ThemeProvider theme={theme.darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Loader />
        <div
          style={{
            height: "100vh",
            backgroundImage: `url('/backgrounds/${weather.background}.gif')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
          className={`${theme.darkMode ? "dark-mode" : "light-mode"}`}
        >
          <div className="glassy-overlay"></div>
          <div style={{ position: "relative" }} className={`content`}>
            <Header />
            {/* <ChatBot /> */}
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
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
