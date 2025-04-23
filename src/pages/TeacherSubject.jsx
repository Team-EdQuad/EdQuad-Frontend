import React, { useState } from 'react';
import { Box, Typography, Button, MenuItem, Select, FormControl, InputLabel, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TeacherSubject = () => {
  const theme = useTheme(); // Access the current theme
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('');

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleClassChange = (event) => {
    setClassName(event.target.value);
  };

  const handleSubmit = () => {
    // Navigate to TeacherContent with subject and class as state
    navigate('/teacher-content', { state: { subject, className } });
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
        Select Subject and Class
      </Typography>

      {/* Subject Dropdown */}
      <FormControl
        sx={{
          mb: 3,
          width: '300px',
          backgroundColor: theme.palette.background.paper, // Dynamic dropdown background
          borderRadius: '8px',
        }}
      >
        <InputLabel
          sx={{
            color: theme.palette.text.secondary, // Dynamic label color
          }}
        >
          Select Subject
        </InputLabel>
        <Select
          value={subject}
          onChange={handleSubjectChange}
          sx={{
            color: theme.palette.text.primary, // Dynamic text color
          }}
        >
          <MenuItem value="Math">Math</MenuItem>
          <MenuItem value="Science">Science</MenuItem>
          <MenuItem value="English">English</MenuItem>
        </Select>
      </FormControl>

      {/* Class Dropdown */}
      <FormControl
        sx={{
          mb: 3,
          width: '300px',
          backgroundColor: theme.palette.background.paper, // Dynamic dropdown background
          borderRadius: '8px',
        }}
      >
        <InputLabel
          sx={{
            color: theme.palette.text.secondary, // Dynamic label color
          }}
        >
          Select Class
        </InputLabel>
        <Select
          value={className}
          onChange={handleClassChange}
          sx={{
            color: theme.palette.text.primary, // Dynamic text color
          }}
        >
          <MenuItem value="Class 1">Class 1</MenuItem>
          <MenuItem value="Class 2">Class 2</MenuItem>
          <MenuItem value="Class 3">Class 3</MenuItem>
        </Select>
      </FormControl>

      {/* Submit Button */}
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          backgroundColor: theme.palette.primary.main, // Dynamic button background
          color: theme.palette.primary.contrastText, // Dynamic button text color
          '&:hover': {
            backgroundColor: theme.palette.primary.dark, // Dynamic hover background
          },
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default TeacherSubject;