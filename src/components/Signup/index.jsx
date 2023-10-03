/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box
} from "@mui/material";
import {validateFirstName, validateLastName, validateEmail, validateMobile, validatePassword, validateConfirmPassword} from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { login } from "../../redux/reducers/userSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [enableAlerts, setEnableAlerts] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleBlur = (validator, value, setter, value2) => {
    const error = validator(value, value2);
    if (validate) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
    setter(error);
  };

  const validate = () => {
    let isValid = true;

    if (!validateFirstName(firstName)) isValid = false;
    if (!validateLastName(lastName)) isValid = false;
    if (!validateEmail(email)) isValid = false;
    if (!validateMobile(mobile)) isValid = false;
    if (!validatePassword(password)) isValid = false;
    if (!validateConfirmPassword(password, confirmPassword)) isValid = false;

    setIsFormValid(isValid);

    return isValid;
  }

  const handleSignup = async () => {
    try {
      const response = await api.post("/create", { email, password });
      if (response.data && response.data.token) {
        dispatch(login({ user: response.data.user, token: response.data.token }));
        navigate("/");
      } else {
        // Handle any error messages or alerts here
        console.error("Failed to login");
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle any error messages or alerts here
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
        Signup
      </Typography>
      <TextField
        error={!!firstNameError}
        helperText={firstNameError}
        onBlur={() => handleBlur(validateFirstName, firstName, setFirstNameError)}
        label="First Name"
        variant="outlined"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        fullWidth
        required
        className="mb-3"
      />
      <TextField
        error={!!lastNameError}
        helperText={lastNameError}
        onBlur={() => handleBlur(validateLastName, lastName, setLastNameError)}
        label="Last Name"
        variant="outlined"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        fullWidth
        required
        className="mb-3"
      />
      <TextField
        error={!!emailError}
        helperText={emailError}
        onBlur={() => handleBlur(validateEmail, email, setEmailError)}
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        className="mb-3"
      />
      <TextField
        error={!!mobileError}
        helperText={mobileError}
        onBlur={() => handleBlur(validateMobile, mobile, setMobileError)}
        type="number"
        label="Mobile"
        variant="outlined"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        fullWidth
        required
        className="mb-3"
      />
      <TextField
        error={!!passwordError}
        helperText={passwordError}
        onBlur={() => handleBlur(validatePassword, password, setPasswordError)}
        label="Password"
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
        label="Confirm Password"
        type="password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        required
        className="mb-3"
      />
      <div className="d-flex flex-column mb-3">
        <FormControlLabel
          control={
            <Checkbox
              checked={enableAlerts}
              onChange={() => setEnableAlerts(!enableAlerts)}
            />
          }
          label="Enable Text and Email Alerts"
          className="mb-1"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              required
            />
          }
          label={
            <span>
              I agree to the{" "}
              <a href="#" onClick={() => setShowTermsModal(true)}>
                Terms and Conditions
              </a>
            </span>
          }
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSignup}
        className="mb-3 w-50"
        disabled={!agreeTerms || !isFormValid}
      >
        Signup
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/login")}
        className="mb-3 w-50"
      >
        Login
      </Button>

      <Dialog open={showTermsModal} onClose={() => setShowTermsModal(false)}>
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent>
          <p>...Your terms and conditions content here...</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTermsModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Signup;
