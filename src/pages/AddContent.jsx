import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, useTheme
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const AddContent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { class_id, subject_id } = location.state || {};
  const [lessonName, setLessonName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(acceptedFiles)]);
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop: (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFiles([acceptedFiles[0]]); 
      }
    },
    multiple: false,
   });

  const handleSubmit = async () => {
    if (!lessonName || !description || files.length === 0) {
      alert("Please fill all fields and upload at least one file.");
      return;
    }

    const formData = new FormData();
    formData.append('content_name', lessonName);
    formData.append('description', description);
    formData.append('file', files[0]); // send only the first file

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/contentupload/${class_id}/${subject_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("Content uploaded:", response.data);
      navigate(-1); // Go back
    } catch (error) {
      console.error("Error uploading content:", error);
      alert("Failed to upload content.");
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor={theme.palette.background.default} minHeight="100vh" p={3}>
      <Typography variant="h5" fontWeight="bold" mb={3} color={theme.palette.text.primary}>
        Add Content
      </Typography>

      <TextField label="Lesson Name" variant="outlined" fullWidth sx={{ mb: 3, maxWidth: '600px' }} value={lessonName} onChange={(e) => setLessonName(e.target.value)} />

      <TextField label="Description" variant="outlined" fullWidth multiline rows={3} sx={{ mb: 3, maxWidth: '600px' }} value={description} onChange={(e) => setDescription(e.target.value)} />

      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" maxWidth="600px" mb={3}>
        <Typography variant="body1" color={theme.palette.text.primary}>Upload Files:</Typography>
        <Button variant="outlined" component="label" startIcon={<AddIcon />} sx={{ color: theme.palette.text.primary, borderColor: theme.palette.divider }}>
          Add Files
          <input type="file" hidden onChange={(e) => {
               if (e.target.files.length > 0) {
              setFiles([e.target.files[0]]);
               }
          }  } />
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
        mb: 3,
      }}>
        <input {...getInputProps()} />
        <Typography variant="body1" color={theme.palette.text.secondary}>Drag and drop files here</Typography>
      </Box>

      {files.map((file, index) => (
        <Box key={index} display="flex" alignItems="center" width="100%" maxWidth="600px" mb={1}>
          {file.type.includes('pdf') ? (
            <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
          ) : (
            <VideoLibraryIcon sx={{ color: 'blue', mr: 1 }} />
          )}
          <Typography variant="body2" color={theme.palette.text.primary}>{file.name}</Typography>
        </Box>
      ))}

      <Button variant="contained" onClick={handleSubmit} sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': { backgroundColor: theme.palette.primary.dark },
      }}>
        Submit
      </Button>
    </Box>
  );
};

export default AddContent;
