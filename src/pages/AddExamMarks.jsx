import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, useTheme } from '@mui/material';

const AddExamMarks = () => {
  const theme = useTheme(); // Access the current theme
  const [studentId, setStudentId] = useState('');
  const [gradeClass, setGradeClass] = useState('');
  const [examYear, setExamYear] = useState('');
  const [subject, setSubject] = useState('');
  const [term, setTerm] = useState('');
  const [marks, setMarks] = useState('');

  const handleSubmit = () => {
    console.log('Exam Marks Submitted:', {
      studentId,
      gradeClass,
      examYear,
      subject,
      term,
      marks,
    });
    // Add logic to save the data
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
        Add Exam Marks
      </Typography>

      {/* Student ID */}
      <TextField
        label="Student ID"
        variant="outlined"
        fullWidth
        sx={{ mb: 3, maxWidth: '600px' }}
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      {/* Grade and Class */}
      <TextField
        label="Grade and Class"
        variant="outlined"
        fullWidth
        sx={{ mb: 3, maxWidth: '600px' }}
        value={gradeClass}
        onChange={(e) => setGradeClass(e.target.value)}
      />

      {/* Exam Year */}
      <TextField
        label="Exam Year"
        variant="outlined"
        fullWidth
        sx={{ mb: 3, maxWidth: '600px' }}
        value={examYear}
        onChange={(e) => setExamYear(e.target.value)}
      />

      {/* Subject */}
      <TextField
        label="Subject"
        variant="outlined"
        fullWidth
        sx={{ mb: 3, maxWidth: '600px' }}
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      {/* Term */}
      <FormControl
        fullWidth
        sx={{
          mb: 3,
          maxWidth: '600px',
          backgroundColor: theme.palette.background.paper, // Dynamic dropdown background
          borderRadius: '8px',
        }}
      >
        <InputLabel
          sx={{
            color: theme.palette.text.secondary, // Dynamic label color
          }}
        >
          Select Term
        </InputLabel>
        <Select
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          sx={{
            color: theme.palette.text.primary, // Dynamic text color
          }}
        >
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
        </Select>
      </FormControl>

      {/* Marks */}
      <TextField
        label="Marks"
        variant="outlined"
        fullWidth
        sx={{ mb: 3, maxWidth: '600px' }}
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
      />

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

export default AddExamMarks;