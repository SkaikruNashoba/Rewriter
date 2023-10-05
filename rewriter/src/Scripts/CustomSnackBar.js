import React from 'react';
import { Snackbar, Alert } from "@mui/material";

export default function CustomSnackBar({ open, message, severity, onClose }) {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        onClose();
    };

    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} elevation={6} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
}
