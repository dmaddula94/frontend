import { Snackbar } from '@mui/material';
import React from 'react';
import MuiAlert from '@mui/material/Alert';

const Notification = ({ message, open, onClose }) => {
  if (!open) {
    return null;
  }
  return (
    <div className="notification">
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={onClose}
          severity="info"
        >
         <div dangerouslySetInnerHTML={{ __html: message}} />
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Notification;