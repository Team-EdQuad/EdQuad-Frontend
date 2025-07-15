import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, useTheme, LinearProgress, Snackbar, Alert
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const Url = import.meta.env.VITE_BACKEND_URL;

const AddContent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { class_id, subject_id } = location.state || {};

  const [lessonName, setLessonName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFiles([acceptedFiles[0]]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });

  const handleSubmit = async () => {
    if (!lessonName || !description || files.length === 0) {
      setSnackbar({ open: true, message: 'Please fill all fields and upload a file.', severity: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('content_name', lessonName);
    formData.append('description', description);
    formData.append('file', files[0]);

    try {
      setUploading(true);
      setProgress(0);

      await axios.post(`${Url}/api/contentupload/${class_id}/${subject_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      setSnackbar({ open: true, message: 'Content uploaded successfully!', severity: 'success' });
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error('Upload error:', error);
      const msg = error.response?.data?.detail || error.message || 'Upload failed';
      setSnackbar({ open: true, message: `Error: ${msg}`, severity: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor={theme.palette.background.default} minHeight="100vh" p={3}>
      <Typography variant="h5" fontWeight="bold" mb={3} color={theme.palette.text.primary}>
        Add Content
      </Typography>

      <TextField label="Lesson Name" variant="outlined" fullWidth sx={{ mb: 3, maxWidth: '600px' }} value={lessonName} onChange={(e) => setLessonName(e.target.value)} />

      <TextField label="Description" variant="outlined" fullWidth multiline rows={3} sx={{ mb: 3, maxWidth: '600px' }} value={description} onChange={(e) => setDescription(e.target.value)} />

      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" maxWidth="600px" mb={2}>
        <Typography variant="body1" color={theme.palette.text.primary}>Upload Files:</Typography>
        <Button variant="outlined" component="label" startIcon={<AddIcon />}>
          Add File
          <input type="file" hidden onChange={(e) => {
            if (e.target.files.length > 0) setFiles([e.target.files[0]]);
          }} />
        </Button>
      </Box>

      <Box {...getRootProps()} sx={{
        border: `2px dashed ${theme.palette.divider}`,
        borderRadius: '8px',
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        maxWidth: '600px',
        height: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        mb: 2,
      }}>
        <input {...getInputProps()} />
        <Typography variant="body1" color={theme.palette.text.secondary}>Drag and drop files here</Typography>
      </Box>

      {files.map((file, index) => (
        <Box key={index} display="flex" alignItems="center" width="100%" maxWidth="600px" mb={1}>
          {file.type.includes('pdf') ? <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} /> : <VideoLibraryIcon sx={{ color: 'blue', mr: 1 }} />}
          <Typography variant="body2" color={theme.palette.text.primary}>{file.name}</Typography>
        </Box>
      ))}

      {uploading && (
        <Box width="100%" maxWidth="600px" mb={2}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption">{progress}%</Typography>
        </Box>
      )}

      <Button variant="contained" onClick={handleSubmit} disabled={uploading} sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': { backgroundColor: theme.palette.primary.dark },
      }}>
        {uploading ? 'Uploading...' : 'Submit'}
      </Button>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddContent;
