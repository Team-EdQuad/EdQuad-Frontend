import React from 'react';
import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const TeacherContent = () => {
  const theme = useTheme(); // Access the current theme
  const location = useLocation();
  const navigate = useNavigate();
  const { subject, className ,subject_id ,class_id} = location.state || {}; 

  const handleCreateAssignment = () => {
    navigate('/assignment-create',{
    state: { subject_id, class_id, teacher_id: 'TCH001' } 
   }); 
  };


  const handleAddContent = () => {
    navigate('/add-content'); // Navigate to AddContent page
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor={theme.palette.background.default} // Dynamic background color
      minHeight="100vh"
      p={3}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        sx={{
          color: theme.palette.text.primary, // Dynamic text color
        }}
      >
        {`Subject: ${subject} | Class: ${className}`}
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {/* Create Assignment Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: theme.palette.background.paper, // Dynamic card background
              borderRadius: '8px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.action.hover, // Dynamic hover background
              },
            }}
            onClick={handleCreateAssignment}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: theme.palette.text.primary, // Dynamic text color
              }}
            >
              Create Assignment
            </Typography>
          </Paper>
        </Grid>

        {/* Add Files Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: theme.palette.background.paper, // Dynamic card background
              borderRadius: '8px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.action.hover, // Dynamic hover background
              },
            }}
            onClick={handleAddContent}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: theme.palette.text.primary, // Dynamic text color
              }}
            >
              Add Content
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherContent;