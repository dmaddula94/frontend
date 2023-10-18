import axios from "axios";
import { store } from "./redux/store";
import { login } from "./redux/reducers/userSlice";
import { startLoader, stopLoader } from "./redux/reducers/loadingSlice";

const api = axios.create({
  baseURL: "https://us-central1-marist-weather-dashboard.cloudfunctions.net/api",
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Start the loader
    store.dispatch(startLoader());

    const state = store.getState();
    const token = state.user.token;
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    // Stop the loader in case of a request error
    store.dispatch(stopLoader());
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // Stop the loader when the response is received
    store.dispatch(stopLoader());
    return response;
  },
  async (error) => {
    // Stop the loader in case of a response error
    store.dispatch(stopLoader());

    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const state = store.getState();
      const refreshToken = state.user.refreshToken;
      try {
        const res = await axios.post(
          `https://us-central1-marist-weather-dashboard.cloudfunctions.net/api/refresh`,
          { refreshToken }
        );

        if (res.status === 201) {
          store.dispatch(
            login({
              user: state.user.user,
              token: res.data.authToken,
            })
          );
          originalRequest.headers.Authorization = `${res.data.authToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
