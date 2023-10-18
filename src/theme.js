import { createTheme } from '@mui/material/styles';

// Dark Mode Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9bdccc',
      light: '#c3e9e7',
      dark: '#689a9a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6b6b',
      light: '#ff9e9d',
      dark: '#c73838',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      hint: '#757575',
      disabled: '#4f4f4f',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  // ... add other theme properties if needed
});

// Light Mode Theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#68a8a6',
      light: '#9bdccc',
      dark: '#467676',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ff9e9d',
      light: '#ffb6b6',
      dark: '#c76b6b',
      contrastText: '#000000',
    },
    text: {
      primary: '#000000',
      secondary: '#4f4f4f',
      hint: '#8c8c8c',
      disabled: '#b0b0b0',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  // ... add other theme properties if needed
});

export { darkTheme, lightTheme };
