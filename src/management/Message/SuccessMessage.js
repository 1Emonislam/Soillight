import { Alert, Container } from '@mui/material';
import React from 'react';

const SuccessMessage = ({ children }) => {
    return (
        <div>
            <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Alert severity="success"><span>{children}</span></Alert>
            </Container>
        </div>
    );
};

export default SuccessMessage;