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
const Url = import.meta.env.VITE_BACKEND_URL;


const AssignmentFileView = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get state from navigation
  const { assignmentFileUrl, assignmentFileName, fileId } = location.state || {};

  const fileType = assignmentFileName?.split('.').pop()?.toLowerCase() || 'pdf';

  //  Check if it's a Google Drive file
  const isGoogleDriveFile = assignmentFileUrl?.includes('drive.google.com') || fileId;

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        if (!assignmentFileUrl && !fileId) {
          throw new Error('No file URL or file ID provided');
        }

        //  Handle Google Drive files differently
        if (isGoogleDriveFile) {
          // For Google Drive, we don't fetch content directly due to CORS
          // We'll handle it in the render section
          setLoading(false);
          return;
        }

        //  Handle local files
        if (fileType === 'txt') {
          const response = await fetch(assignmentFileUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status}`);
          }
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
  }, [assignmentFileUrl, fileId, fileType, isGoogleDriveFile]);

  // ✅ Get the appropriate URL for viewing
  const getViewUrl = () => {
    if (fileId) {
      // Google Drive file ID
      return `https://drive.google.com/file/d/${fileId}/preview`;
    } else if (isGoogleDriveFile) {
      // Convert view URL to preview URL
      return assignmentFileUrl.replace('/view', '/preview');
    } else {
      // Local file
      return assignmentFileUrl;
    }
  };

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
        <Box>
          {/* ✅ Add external link button for Google Drive files */}
          {isGoogleDriveFile && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => window.open(
                fileId 
                  ? `https://drive.google.com/file/d/${fileId}/view`
                  : assignmentFileUrl,
                '_blank'
              )}
              sx={{ mr: 1 }}
            >
              Open in Drive
            </Button>
          )}
          <IconButton onClick={() => navigate(-1)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Content Area */}
      <Box sx={{
        flex: 1,
        p: 3,
        display: 'flex',
        justifyContent: 'center',
        overflow: 'auto'
      }}>
        {isGoogleDriveFile ? (
          // ✅ Google Drive files - use iframe
          <Box sx={{
            width: '90%',
            height: '80vh',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <iframe
              src={getViewUrl()}
              width="100%"
              height="100%"
              frameBorder="0"
              title={assignmentFileName || 'Assignment File'}
              style={{ borderRadius: '4px' }}
            />
          </Box>
        ) : fileType === 'pdf' ? (
          // ✅ Local PDF files
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
          // ✅ Text files
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
          // ✅ Unsupported file types
          <Box textAlign="center">
            <Typography variant="body1" gutterBottom>
              Unsupported file type: .{fileType || 'unknown'}
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => window.open(
                fileId 
                  ? `https://drive.google.com/file/d/${fileId}/view`
                  : assignmentFileUrl,
                '_blank'
              )}
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
