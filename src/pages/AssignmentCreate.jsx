import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, FormControlLabel, useTheme,
  Snackbar, Alert, LinearProgress, Radio, RadioGroup, FormLabel
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Url = import.meta.env.VITE_BACKEND_URL;

const AssignmentCreate = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { subject_id, class_id, teacher_id } = location.state || {};

  const [assignmentName, setAssignmentName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [gradingType, setGradingType] = useState('auto');
  const [sampleAnswer, setSampleAnswer] = useState('');
  const [deadline, setDeadline] = useState(new Date());

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const handleSubmit = async () => {
    if (!files.length || !assignmentName || !description) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields and upload at least one file.',
        severity: 'warning'
      });
      return;
    }

    const formData = new FormData();
    formData.append('assignment_name', assignmentName);
    formData.append('description', description);
    formData.append('grading_type', gradingType);
    formData.append('deadline', deadline.toISOString());
    formData.append('file', files[0]); // Only one file used for now
    if (gradingType === 'auto') {
      formData.append('sample_answer', sampleAnswer);
    }

    try {
      setUploading(true);
      setProgress(0);

      const response = await axios.post(
        `${Url}/api/assignmentcreate/${class_id}/${subject_id}/${teacher_id}`,
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

      console.log('Raw Axios Response:', response);

      if (response && response.status === 200) {
        console.log('Assignment created:', response.data);
        setSnackbar({ open: true, message: 'Assignment created successfully!', severity: 'success' });
        setTimeout(() => navigate(-1), 1500);
      } else {
        throw new Error('Unexpected response structure.');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Unexpected error';
      setSnackbar({ open: true, message: `Error: ${msg}`, severity: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" p={3} bgcolor={theme.palette.background.default}>
      <Typography variant="h5" fontWeight="bold" mb={3} color={theme.palette.text.primary}>
        Create Assignment
      </Typography>

      <TextField
        label="Assignment Name"
        variant="outlined"
        fullWidth
        sx={{ mb: 3, maxWidth: '600px' }}
        value={assignmentName}
        onChange={(e) => setAssignmentName(e.target.value)}
      />

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

      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" maxWidth="600px" mb={2}>
        <Typography variant="body1" color={theme.palette.text.primary}>Upload File:</Typography>
        <Button variant="outlined" component="label" startIcon={<AddIcon />}>
          Add File
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>
      </Box>

      {files.map((file, index) => (
        <Box key={index} display="flex" alignItems="center" width="100%" maxWidth="600px" mb={1}>
          <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
          <Typography variant="body2" color={theme.palette.text.primary}>{file.name}</Typography>
        </Box>
      ))}

      {uploading && (
        <Box width="100%" maxWidth="600px" mb={2}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption">{progress}%</Typography>
        </Box>
      )}

      <Box display="flex" justifyContent="space-between" width="100%" maxWidth="600px" mb={3}>
        <FormLabel component="legend">Grading Type</FormLabel>
        <RadioGroup
          row
          value={gradingType}
          onChange={(e) => setGradingType(e.target.value)}
        >
          <FormControlLabel
            value="auto"
            control={<Radio />}
            label="Automatic Grading"
          />
          <FormControlLabel
            value="manual"
            control={<Radio />}
            label="Manual Grading"
          />
        </RadioGroup>
      </Box>

      {gradingType === 'auto' && (
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
      )}

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label="Assignment Deadline"
          value={deadline}
          onChange={(newValue) => setDeadline(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              sx={{ mb: 3, maxWidth: '600px' }}
            />
          )}
        />
      </LocalizationProvider>

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={uploading}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': { backgroundColor: theme.palette.primary.dark }
        }}
      >
        {uploading ? 'Uploading...' : 'Submit'}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

export default AssignmentCreate;
