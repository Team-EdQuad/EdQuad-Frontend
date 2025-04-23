import React, { useState } from 'react';
import { Box, Typography, Button, useTheme, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const Submission = () => {
  const theme = useTheme(); // Access the current theme
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSave = () => {
    console.log('Files submitted:', files);
    // Add logic to save files
  };

  const handleCancel = () => {
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
        File Submissions
      </Typography>

      {/* Drag-and-Drop Area */}
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${theme.palette.divider}`, // Dynamic border color
          borderRadius: '8px',
          backgroundColor: theme.palette.background.paper, // Dynamic background color
          width: '100%',
          maxWidth: '600px',
          height: '200px',
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
          Drop file or select file
        </Typography>
      </Box>

      {/* File List */}
      <Box
        width="100%"
        maxWidth="600px"
        bgcolor={theme.palette.background.paper} // Dynamic background color
        borderRadius="8px"
        boxShadow={1}
        p={2}
        mb={3}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
          sx={{
            color: theme.palette.text.primary, // Dynamic text color
          }}
        >
          Uploaded Files
        </Typography>
        <List>
          {files.map((file, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(2)} KB`}
                  sx={{
                    color: theme.palette.text.primary, // Dynamic text color
                  }}
                />
              </ListItem>
              {index < files.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: theme.palette.primary.main, // Dynamic button background
            color: theme.palette.primary.contrastText, // Dynamic button text color
            '&:hover': {
              backgroundColor: theme.palette.primary.dark, // Dynamic hover background
            },
          }}
        >
          Save Changes
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            color: theme.palette.text.primary, // Dynamic button text color
            borderColor: theme.palette.divider, // Dynamic border color
            '&:hover': {
              borderColor: theme.palette.text.primary, // Dynamic hover border color
            },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default Submission;