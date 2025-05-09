import React, { useState } from 'react';
import { Box, Typography, Button, TextField, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AddIcon from '@mui/icons-material/Add';

const AddContent = () => {
  const theme = useTheme(); // Access the current theme
  const navigate = useNavigate();
  const [lessonName, setLessonName] = useState('');
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = () => {
    console.log('Lesson Created:', {
      lessonName,
      files,
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
        Add Content
      </Typography>

      {/* Lesson Name */}
      <TextField
        label="Lesson Name"
        variant="outlined"
        fullWidth
        sx={{ mb: 3, maxWidth: '600px' }}
        value={lessonName}
        onChange={(e) => setLessonName(e.target.value)}
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
          <input type="file" hidden multiple onChange={(e) => onDrop(e.target.files)} />
        </Button>
      </Box>

      {/* Drag-and-Drop Area */}
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${theme.palette.divider}`, // Dynamic border color
          borderRadius: '8px',
          backgroundColor: theme.palette.background.paper, // Dynamic background color
          width: '100%',
          maxWidth: '600px',
          height: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          mb: 3,
        }}
      >
        <input {...getInputProps()} />
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary, // Dynamic text color
          }}
        >
          Drag and drop files here
        </Typography>
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
          {file.type.includes('pdf') ? (
            <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
          ) : (
            <VideoLibraryIcon sx={{ color: 'blue', mr: 1 }} />
          )}
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

export default AddContent;