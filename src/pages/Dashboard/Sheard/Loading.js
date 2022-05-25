import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loading() {
  return (
    <Box sx={{ display: 'flex',justifyContent:'center',alignItems:'center',marginTop:'20px' }}>
      <CircularProgress/>
    </Box>
  );
}