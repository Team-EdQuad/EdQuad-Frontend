import React, { useState, useEffect, useContext } from 'react';
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
import { StoreContext } from '../context/StoreContext';

const Url = import.meta.env.VITE_BACKEND_URL;

const ContentView = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: student_id } = useContext(StoreContext);

  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasClosed, setHasClosed] = useState(false); // prevent double close

  const {
    contentUrl,
    contentName,
    contentDescription,
    content_id,
  } = location.state || {};

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

  // ✅ Common function to call backend
  const sendCloseContent = async () => {
    if (hasClosed || !student_id || !content_id) return;

    try {
      const formData = new URLSearchParams();
      formData.append('student_id', student_id);
      formData.append('content_id', content_id);

      await fetch(`${Url}/api/closeContentAccess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: formData,
      });

      console.log('Closed content access via fetch');
    } catch (err) {
      console.error('Error closing content:', err);
    } finally {
      setHasClosed(true);
    }
  };

  // ✅ Manual close button handler
  const handleManualClose = async () => {
    await sendCloseContent();
    navigate(-1);
  };

  // ✅ Auto-close on inactivity
  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log('Auto-closing due to inactivity...');
        sendCloseContent().then(() => navigate(-1));
      }, 5 * 60 * 1000); // 5 minutes
    };

    const activityEvents = ['mousemove', 'keydown', 'scroll'];
    activityEvents.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      activityEvents.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [student_id, content_id]);

  // ✅ Auto-close on tab/window close
  useEffect(() => {
    const handleUnload = () => {
      if (hasClosed || !student_id || !content_id) return;

      const formData = new URLSearchParams();
      formData.append('student_id', student_id);
      formData.append('content_id', content_id);

      navigator.sendBeacon(`${Url}/api/closeContentAccess`, formData);
      setHasClosed(true);
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [student_id, content_id, hasClosed]);

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
        <IconButton onClick={handleManualClose}>
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
