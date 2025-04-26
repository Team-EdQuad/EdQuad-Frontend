import React from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const ContentView = () => {
  const theme = useTheme(); // Access the current theme
  const navigate = useNavigate();
  const location = useLocation();
  const { fileUrl, fileType, fileName } = location.state || {}; // Get file details from state

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor={theme.palette.background.default} // Dynamic background color
      minHeight="100vh"
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        bgcolor={theme.palette.background.paper} // Dynamic header background
        boxShadow={1}
      >
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary, // Dynamic text color
          }}
        >
          {fileName || 'Content Viewer'}
        </Typography>
        <IconButton
          onClick={() => navigate(-1)} // Navigate back
          sx={{
            color: theme.palette.text.primary, // Dynamic icon color
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content Viewer */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={2}
        bgcolor={theme.palette.background.default} // Dynamic content background
      >
        {fileType === 'pdf' ? (
          // PDF Viewer
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
            <Viewer
              fileUrl={fileUrl}
              plugins={[defaultLayoutPluginInstance]}
              theme={theme.palette.mode} // Adapt to light/dark mode
            />
          </Worker>
        ) : fileType === 'mp4' ? (
          // Video Player
          <video
            controls
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              borderRadius: '8px',
              boxShadow: theme.shadows[3],
            }}
          >
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary, // Dynamic text color
            }}
          >
            Unsupported file type.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ContentView;