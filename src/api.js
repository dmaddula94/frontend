import axios from "axios";
import store from "./redux/store"; // Import your Redux store
import { login } from "./redux/reducers/userSlice"; // Import the login action

const api = axios.create({
  baseURL: "https://your-api-endpoint.com",
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 and the request is not a re-authentication request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Attempt to refresh the token
      const state = store.getState();
      const refreshToken = state.user.refreshToken; // Assuming you also store the refresh token in the Redux store
      const res = await axios.post(
        "https://your-api-endpoint.com/refresh-token",
        { refreshToken }
      );

      if (res.status === 201) {
        store.dispatch(
          login({
            user: state.user.user, // Keep the existing user data
            token: res.data.authToken,
          })
        );

        // Modify the original request to use the new token
        originalRequest.headers.Authorization = `Bearer ${res.data.authToken}`;

        // Repeat the original request
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
