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