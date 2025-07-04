import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

const UnderConstruction = () => {
  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      sx={{ backgroundColor: '#f5f5f5', padding: 4 }}
    >
      <ConstructionIcon sx={{ fontSize: 80, color: 'orange' }} />
      <Typography variant="h4" mt={2}>
        Page Under Construction
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mt={1}>
        We're working hard to bring this page to life. Check back soon!
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => window.history.back()}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default UnderConstruction;
