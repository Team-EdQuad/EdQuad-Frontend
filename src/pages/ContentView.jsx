import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  CircularProgress,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const ContentView = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { contentId } = useParams();
  const [contentData, setContentData] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = 'STU001';

  const handleClose = async () => {
    try {
      const formData = new FormData();
      formData.append('student_id', studentId);
      formData.append('content_id', contentId);
  
      await fetch('http://127.0.0.1:8000/api/closeContentAccess', {
        method: 'POST',
        body: formData,
      });
  
      navigate(-1);
    } catch (error) {
      console.error('Failed to close content access:', error);
      navigate(-1); // Still navigate back even if the API fails
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const metaResponse = await fetch(`http://localhost:8000/api/content/${contentId}`);
        if (!metaResponse.ok) throw new Error(`HTTP error! status: ${metaResponse.status}`);
        const data = await metaResponse.json();
        if (!data.file_path) throw new Error('File path missing in response');
        setContentData(data);

        if (data.file_path.toLowerCase().endsWith('.txt')) {
          const fileResponse = await fetch(`http://localhost:8000/api/content/file/${contentId}`);
          const text = await fileResponse.text();
          setTextContent(text);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId]);

  const fileUrl = contentData?.file_path
    ? `http://localhost:8000/api/content/file/${contentId}`
    : null;

  const fileType = contentData?.file_path?.split('.').pop()?.toLowerCase();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
        <Typography variant="body1" ml={2}>Loading content...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error" variant="h6">Error: {error}</Typography>
        <Button onClick={() => navigate(-1)} variant="contained" sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!contentData) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">No content data available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          bgcolor: theme.palette.background.paper,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6">
          {contentData.content_name || 'Untitled Content'}
        </Typography>
        <IconButton  onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content Display Area */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          overflow: 'auto',
        }}
      >
        {!fileUrl ? (
          <Typography variant="body1">No file available for this content</Typography>
        ) : fileType === 'pdf' ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div
              style={{
                width: '80%',
                height: '90vh',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '4px',
              }}
            >
              <Viewer fileUrl={fileUrl} />
            </div>
          </Worker>
        ) : fileType === 'txt' ? (
          <Box
            sx={{
              width: '80%',
              p: 3,
              bgcolor: theme.palette.background.paper,
              borderRadius: 2,
              whiteSpace: 'pre-wrap',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="body1">
              {textContent || 'No text content available'}
            </Typography>
          </Box>
        ) : fileType === 'mp4' ? (
          <video
            src={fileUrl}
            controls
            style={{
              width: '80%',
              borderRadius: '8px',
              border: `1px solid ${theme.palette.divider}`,
            }}
          />
        ) : fileType === 'mp3' ? (
          <Box
            sx={{
              p: 2,
              bgcolor: theme.palette.background.paper,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              width: '80%',
            }}
          >
           <audio controls style={{ width: '100%' }}>
            <source src={fileUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
      </Box>
        ) : (
          <Box textAlign="center">
            <Typography variant="body1">
              Unsupported file type: .{fileType || 'unknown'}
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => window.open(fileUrl, '_blank')}
            >
              Open in New Tab
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ContentView;
