import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { SnackbarProvider, useSnackbar } from "notistack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const CloseButton = ({ key }) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={() => closeSnackbar(key)}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
};

const AppWrapper = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      action={(key) => <CloseButton key={key} />}
      autoHideDuration={10000}
    >
      <App />
    </SnackbarProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppWrapper />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
