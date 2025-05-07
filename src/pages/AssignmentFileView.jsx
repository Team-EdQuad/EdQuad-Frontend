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

const AssignmentFileView = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get state from navigation
  const { assignmentFileUrl, assignmentFileName } = location.state || {};

  const fileType = assignmentFileName?.split('.').pop()?.toLowerCase() || 'unknown';


  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        if (!assignmentFileUrl) {
          throw new Error('No file URL provided');
        }

        if (fileType === 'txt') {
            const response = await fetch(assignmentFileUrl);
            const text = await response.text();
            setFileContent(text);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFileContent();
  }, [assignmentFileUrl,fileType]);

  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
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
    <Box sx={{ 
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        bgcolor: theme.palette.background.paper,
        boxShadow: 1
      }}>
        <Typography variant="h6">
          {assignmentFileName || 'Assignment File'}
        </Typography>
        <IconButton onClick={() => navigate(-1)}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content Area */}
      <Box sx={{
        flex: 1,
        p: 3,
        display: 'flex',
        justifyContent: 'center',
        overflow: 'auto'
      }}>
        {fileType === 'pdf' ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div style={{ 
              width: '80%', 
              height: '90vh',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '4px'
            }}>
              <Viewer fileUrl={assignmentFileUrl} />
            </div>
          </Worker>
        ) : fileType === 'txt' ? (
          <Box sx={{
            width: '80%',
            p: 3,
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            whiteSpace: 'pre-wrap',
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Typography variant="body1">
              {fileContent || 'No text content available'}
            </Typography>
          </Box>
        ) : (
          <Box textAlign="center">
            <Typography variant="body1">
              Unsupported file type: .{fileType || 'unknown'}
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => window.open(assignmentFileUrl, '_blank')}
            >
              Open in New Tab
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AssignmentFileView;