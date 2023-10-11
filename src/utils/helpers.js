export const validateFirstName = (firstName) => {

  if (!firstName.trim()) {
    return "First name is required";
  } else {
    return null;
  }
};

export const validateLastName = (lastName) => {
  if (!lastName.trim()) {
    return "Last name is required";
  } else {
    return null;
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!email.trim()) {
    return "Email is required";
  } else if (!emailRegex.test(email)) {
    return "Invalid email address";
  } else {
    return null;
  }
};

//   const validateMobile = () => {
//     const mobileRegex = /^[0-9]{10}$/; // Assuming a 10-digit mobile number
//     if (enableAlerts && !mobile.trim()) {
//       setMobileError("Mobile number is required for alerts");
//       return false;
//     } else if (mobile && !mobileRegex.test(mobile)) {
//       setMobileError("Invalid mobile number");
//       return false;
//     } else {
//       setMobileError("");
//       return true;
//     }
//   };

export const validateMobile = (mobile, enableAlerts = false) => {
  const mobileRegex = /^[0-9]{10}$/; // Assuming a 10-digit mobile number
  if (!mobile.trim()) {
    if (enableAlerts) {
      return "Mobile number is required for alerts";
    }
    return null;
    // return "Mobile number is required for alerts";
  } else if (!mobileRegex.test(mobile)) {
    return "Invalid mobile number";
  } else {
    return null;
  }
};

export const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password) {
    return "Password is required";
  } else if (!passwordRegex.test(password)) {
    return "Password should have 1 uppercase, be alphanumeric with special characters";
  } else {
    return null;
  }
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Confirm password is required";
  } else if (password !== confirmPassword) {
    return "Passwords do not match";
  } else {
    return null;
  }
};

/**
 * Creates a full URL from a base URL and query params.
 * @param url
 * @param query
 * @returns {string}
 */
export const createUrl = ({ url, query = {} }) => {
  const urlBuilder = new URL(url);

  Object.entries(query).forEach(([key, value]) => {
    if (value == null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((val) => urlBuilder.searchParams.append(key, val));
      return;
    }

    urlBuilder.searchParams.append(key, value);
  });

  return urlBuilder.toString();
};
