import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Button } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Button variant="contained" color="primary" onClick={handleThemeChange}>
          Toggle Theme
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default App;