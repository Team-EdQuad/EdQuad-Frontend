import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Checkbox, FormControlLabel, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const AssignmentCreate = () => {
  const theme = useTheme(); // Access the current theme
  const navigate = useNavigate();
  const [assignmentName, setAssignmentName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [gradingType, setGradingType] = useState('automatic');
  const [sampleAnswer, setSampleAnswer] = useState('');

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const handleSubmit = () => {
    console.log('Assignment Created:', {
      assignmentName,
      description,
      files,
      gradingType,
      sampleAnswer,
    });
    navigate(-1); // Navigate back to the previous page
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
        Create Assignment
      </Typography>

      {/* Assignment Name */}
      <TextField
        label="Assignment Name"
        variant="outlined"
        fullWidth
        sx={{ mb: 3, maxWidth: '600px' }}
        value={assignmentName}
        onChange={(e) => setAssignmentName(e.target.value)}
      />

      {/* Assignment Description */}
      <TextField
        label="Assignment Description"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 3, maxWidth: '600px' }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* File Upload */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        maxWidth="600px"
        mb={3}
      >
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.primary, // Dynamic text color
          }}
        >
          Upload Files:
        </Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<AddIcon />}
          sx={{
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
          }}
        >
          Add Files
          <input type="file" hidden multiple onChange={handleFileUpload} />
        </Button>
      </Box>

      {/* Uploaded Files */}
      {files.map((file, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          maxWidth="600px"
          mb={1}
        >
          <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary, // Dynamic text color
            }}
          >
            {file.name}
          </Typography>
        </Box>
      ))}

      {/* Grading Type */}
      <Box display="flex" justifyContent="space-between" width="100%" maxWidth="600px" mb={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={gradingType === 'automatic'}
              onChange={() => setGradingType('automatic')}
            />
          }
          label="Automatic Grading"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={gradingType === 'manual'}
              onChange={() => setGradingType('manual')}
            />
          }
          label="Manual Grading"
        />
      </Box>

      {/* Sample Answer */}
      <TextField
        label="Sample Answer"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 3, maxWidth: '600px' }}
        value={sampleAnswer}
        onChange={(e) => setSampleAnswer(e.target.value)}
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

export default AssignmentCreate;