import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';

const MySubject = () => {
  const theme = useTheme(); // Access the current theme
  const navigate = useNavigate();

  const handleSubjectClick = (subjectId) => {
    navigate(`/subject/${subjectId}`); // Navigate to the subject content page
  };

  return (
    <Box>
      <Box display="flex">
        {/* Sidebar */}

        {/* Page Content */}
        <Box
          flex={1}
          p={2}
          sx={{
            bgcolor: theme.palette.background.default, // Dynamic background color
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={2}
            align="left"
            sx={{
              color: theme.palette.text.primary, // Dynamic text color
            }}
          >
            My Subjects
          </Typography>

          {/* Grid Layout for Subjects */}
          <Grid container spacing={5}>
            {Array.from({ length: 9 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: '70px',
                    textAlign: 'center',
                    backgroundColor: theme.palette.background.paper, // Dynamic card background
                    borderRadius: '10px',
                    cursor: 'pointer',
                    color: theme.palette.text.primary, // Dynamic text color
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover, // Dynamic hover color
                    },
                  }}
                  onClick={() => handleSubjectClick(index + 1)}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Subject {index + 1}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Bottom Bar */}
    </Box>
  );
};

export default MySubject;