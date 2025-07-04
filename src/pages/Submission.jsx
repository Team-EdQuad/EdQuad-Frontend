import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, useTheme, List, ListItem,
  ListItemText, Divider, LinearProgress, Snackbar, Alert, IconButton
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const Submission = () => {
  const theme = useTheme();
  const { assignment_id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const student_id = "STU001";

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!assignment_id) {
      alert('Missing assignment ID');
      navigate(-1);
    }
  }, [assignment_id, navigate]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFiles([acceptedFiles[0]]); // Allow only 1 file
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  const handleSave = async () => {
    if (files.length === 0) {
      setSnackbar({ open: true, message: 'Please select a file to upload', severity: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      setUploading(true);
      setProgress(0);

      const response = await axios.post(
        `http://localhost:8000/api/submission/${student_id}/${assignment_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setProgress(percent);
            }
          },
        }
      );

      setSnackbar({ open: true, message: 'Submission successful!', severity: 'success' });
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error('Submission error:', error);
      const msg = error.response?.data?.detail || error.message || 'Upload failed';
      setSnackbar({ open: true, message: `Submission failed: ${msg}`, severity: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleRemoveFile = () => {
    setFiles([]);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor={theme.palette.background.default} minHeight="100vh" p={3}>
      <Typography variant="h5" fontWeight="bold" mb={3} color={theme.palette.text.primary}>
        File Submission
      </Typography>

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
        <Typography variant="body1" color={theme.palette.text.secondary}>
          Drag and drop or click to select a file (only 1 allowed)
        </Typography>
      </Box>

      {files.length > 0 && (
        <Box width="100%" maxWidth="600px" bgcolor={theme.palette.background.paper} borderRadius="8px" boxShadow={1} p={2} mb={3}>
          <Typography variant="h6" fontWeight="bold" mb={2} color={theme.palette.text.primary}>
            Selected File
          </Typography>
          <List>
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={handleRemoveFile}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={files[0].name}
                secondary={`${(files[0].size / 1024).toFixed(2)} KB`}
                sx={{ color: theme.palette.text.primary }}
              />
            </ListItem>
          </List>
        </Box>
      )}

      {uploading && (
        <Box width="100%" maxWidth="600px" mb={2}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption">{progress}%</Typography>
        </Box>
      )}

      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={uploading}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': { backgroundColor: theme.palette.primary.dark },
          }}
        >
          {uploading ? 'Uploading...' : 'Submit'}
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
            '&:hover': { borderColor: theme.palette.text.primary },
          }}
        >
          Cancel
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Submission;
