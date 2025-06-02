import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  CircularProgress,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ContentView = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { contentId } = useParams();
  
  // ✅ Get content data from navigation state
  const passedContentData = location.state?.contentData;
  
  const [contentData, setContentData] = useState(passedContentData || null);
  const [loading, setLoading] = useState(!passedContentData); // Only load if no data passed
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // ✅ Only fetch if no data was passed through navigation
    if (!passedContentData) {
      const fetchContent = async () => {
        try {
          const metaResponse = await fetch(`http://localhost:8000/api/content/${contentId}`);
          if (!metaResponse.ok) throw new Error(`HTTP error! status: ${metaResponse.status}`);
          
          const data = await metaResponse.json();
          console.log('Fetched content data:', data);
          
          setContentData(data);
        } catch (err) {
          console.error('Error fetching content:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchContent();
    } else {
      console.log('Using passed content data:', passedContentData);
    }
  }, [contentId, passedContentData]);

  // ✅ Handle both Google Drive and local files
  const getFileUrl = () => {
    if (contentData?.content_file_id) {
      // Google Drive file
      return `https://drive.google.com/file/d/${contentData.content_file_id}/preview`;
    } else if (contentData?.file_path) {
      // Local file (fallback)
      return `http://localhost:8000/api/content/file/${contentId}`;
    }
    return null;
  };

  const fileUrl = getFileUrl();
  
  const fileType = contentData?.file_type || 
                   contentData?.content_name?.split('.').pop()?.toLowerCase() || 
                   'pdf';

  const isGoogleDriveFile = contentData?.content_file_id ? true : false;

  const handleClose = async () => {
    try {
      const formData = new FormData();
      formData.append('student_id', 'STU001');
      formData.append('content_id', contentId);

      await fetch('http://127.0.0.1:8000/api/closeContentAccess', {
        method: 'POST',
        body: formData,
      });

      navigate(-1);
    } catch (error) {
      console.error('Error closing content access:', error);
      navigate(-1);
    }
  };

  const handleMarkAsDone = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/content/${contentId}/mark-done`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to mark content as done');
      }

      setDone(true);
    } catch (error) {
      console.error('Failed to mark as done:', error);
      alert('Error: Could not mark as done');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
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
        <Button onClick={() => navigate(-1)} variant="contained" sx={{ mt: 2 }}>
          Go Back
        </Button>
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
        <Box>
          <Typography variant="h6">
            {contentData.content_name || 'Untitled Content'}
          </Typography>
          {contentData.description && (
            <Typography variant="body2" color="text.secondary">
              {contentData.description}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {isGoogleDriveFile && (
            <Button
              variant="outlined"
              onClick={() => window.open(
                `https://drive.google.com/file/d/${contentData.content_file_id}/view`,
                '_blank'
              )}
            >
              Open in Drive
            </Button>
          )}

          <Button
            variant="contained"
            onClick={handleMarkAsDone}
            disabled={done}
            sx={{
              bgcolor: done ? '#003366' : 'white',
              color: done ? 'white' : '#003366',
              border: '1px solid #003366',
              '&:hover': {
                bgcolor: done ? '#003366' : '#e6f0ff',
              },
            }}
          >
            {done ? 'Marked as Done' : 'Mark as Done'}
          </Button>

          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
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
          <Box textAlign="center">
            <Typography variant="body1" gutterBottom>
              No file available for this content
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Content ID: {contentData.content_id}
            </Typography>
          </Box>
        ) : isGoogleDriveFile ? (
          <Box
            sx={{
              width: '90%',
              height: '80vh',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <iframe
              src={fileUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              title={contentData.content_name || 'Content'}
              style={{ borderRadius: '4px' }}
            />
          </Box>
        ) : (
          <Box textAlign="center">
            <Typography variant="body1">
              Local file support not implemented yet
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
