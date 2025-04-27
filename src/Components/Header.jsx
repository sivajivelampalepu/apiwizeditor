import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Tooltip } from '@mui/material';



const Header = () => {

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: '#0099cc',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="menu">
           
          </IconButton>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 1 }}
            >
              ApiWIZ Editor
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: '#E0F7FA', fontStyle: 'italic' }}
            >
             Multi-modal Content Writing Tool
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        
         
          <Tooltip title="User Profile">
            <IconButton
              sx={{
                '&:hover': {
                  bgcolor: '#2BBBAD',
                  transition: 'background-color 0.3s',
                },
              }}
            >
              <Avatar sx={{ bgcolor: '#FFFFFF', color: '#26A69A' }}>
               
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;