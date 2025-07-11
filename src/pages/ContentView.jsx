import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { contentUrl, contentName, contentDescription } = location.state || {};
  const fileType = contentName?.split('.').pop()?.toLowerCase() || '';

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        if (!contentUrl || !contentName) {
          throw new Error('Missing file URL or file name');
        }

        if (fileType === 'txt') {
          const response = await fetch(contentUrl);
          if (!response.ok) throw new Error(`Failed to fetch text file: ${response.statusText}`);
          const text = await response.text();
          setFileContent(text);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching file:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFileContent();
  }, [contentUrl, contentName, fileType]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
        <Typography variant="body1" ml={2}>Loading file...</Typography>
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

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        bgcolor: theme.palette.background.paper,
        boxShadow: 1
      }}>
        <Box>
          <Typography variant="h6">{contentName || 'Content File'}</Typography>
          <Typography variant="body2" color="text.secondary">{contentDescription || ''}</Typography>
        </Box>
        <IconButton onClick={() => navigate(-1)}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* File Viewer */}
      <Box sx={{ flex: 1, p: 3, display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
        {fileType === 'pdf' ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div style={{
              width: '80%',
              height: '90vh',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '4px'
            }}>
              <Viewer fileUrl={contentUrl} />
            </div>
          </Worker>
        ) : fileType === 'txt' ? (
          <Box sx={{
            width: '80%',
            p: 3,
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            whiteSpace: 'pre-wrap',
            border: `1px solid ${theme.palette.divider}`,
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <Typography variant="body1">
              {fileContent || 'No text content available'}
            </Typography>
          </Box>
        ) : (
          <Box textAlign="center">
            <Typography variant="body1" gutterBottom>
              Unsupported file type: .{fileType || 'unknown'}
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ContentView;
