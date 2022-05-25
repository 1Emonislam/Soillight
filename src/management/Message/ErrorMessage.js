import { Alert, Container } from '@mui/material';
import React from 'react';

const ErrorMessage = ({ children }) => {
    return (
        <div>
            <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Alert severity="error"><span>{children}</span></Alert>
            </Container>
        </div>
    );
};

export default ErrorMessage;