import { CircularProgress } from '@mui/material';
import React from 'react';

const Loading = ({ size = 30}) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%',marginTop:'30px' }}
        >
            <CircularProgress size={size} />

        </div>
    );
};

export default Loading;