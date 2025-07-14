import React, { useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { StoreContext } from '../context/StoreContext';

const NotificationProvider = ({ children }) => {
  const { notification, hideNotification } = useContext(StoreContext);

  return (
    <>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={notification.duration}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        // 🔥 Use `style` to override internal inline styles
        style={{
          top: '80px',      // ← Push down from the top
          right: '24px',    // ← Push left from the right edge
          position: 'fixed',
        }}
      >
        <Alert
          onClose={hideNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationProvider;
