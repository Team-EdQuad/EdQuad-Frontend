import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, useTheme, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const Submission = () => {
  const theme = useTheme(); 
  const { assignment_id } = useParams(); // Get the assignment ID from the URL
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const student_id = "STU001";

  useEffect(() => {
    if (!assignment_id) {
      alert('Missing assignment ID');
      navigate(-1);
    }
  }, [assignment_id, navigate]);

  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSave = async () => {
    if (files.length === 0) return alert('Please select a file to upload');
    if (!assignment_id) return alert('Invalid assignment');

    const formData = new FormData();
    formData.append('file', files[0]);
 
    try {
      const response = await fetch(
        `http://localhost:8000/api/submission/${student_id}/${assignment_id}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Submission failed');
      }
      alert('Submission successful!');
      navigate(-1);
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Submission failed: ${error.message}`);
    }
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
      bgcolor={theme.palette.background.default}
      minHeight="100vh"
      p={3}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        sx={{
          color: theme.palette.text.primary,
        }}
      >
        File Submissions
      </Typography>

      {/* Drag-and-Drop Area */}
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${theme.palette.divider}`,
          borderRadius: '8px',
          backgroundColor: theme.palette.background.paper,
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
            color: theme.palette.text.secondary,
          }}
        >
          Drop file or select file
        </Typography>
      </Box>

      {/* File List */}
      <Box
        width="100%"
        maxWidth="600px"
        bgcolor={theme.palette.background.paper}
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
            color: theme.palette.text.primary,
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
                    color: theme.palette.text.primary,
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
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Save Changes
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
            '&:hover': {
              borderColor: theme.palette.text.primary,
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