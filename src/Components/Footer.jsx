import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#0099cc', color: '#FFFFFF', p: 2, textAlign: 'center' }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} Editor @developed by Sivaji Velampalepu. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;