import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={10}>
        <Typography variant="h3" gutterBottom>
          Welcome to EdQuad!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Smart Education Dashboard
        </Typography>
        <Button variant="contained" color="primary">
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
