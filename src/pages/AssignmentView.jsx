import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const AssignmentView = () => {
  const { assignmentName } = useParams();
  const navigate = useNavigate();
  const theme = useTheme(); // Access the current theme
  const [doneFiles, setDoneFiles] = useState({});

  const lessonIndex = 0;
  const fileIndex = 0;

  const handleMarkAsDone = (lessonIndex, fileIndex) => {
    setDoneFiles((prev) => ({
      ...prev,
      [`${lessonIndex}-${fileIndex}`]: !prev[`${lessonIndex}-${fileIndex}`],
    }));
  };

  const handleAddFiles = () => {
    navigate('/submission'); // Navigate to Submission.jsx
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor={theme.palette.background.default} // Dynamic background color
      minHeight="100vh"
    >
      <Box display="flex" flex={1}>
        <Box flex={1} p={3}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: theme.palette.text.primary, // Dynamic text color
            }}
          >
            {assignmentName}
          </Typography>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => window.history.back()}
              sx={{
                color: theme.palette.text.primary, // Dynamic button text color
                borderColor: theme.palette.divider, // Dynamic border color
              }}
            >
              Back
            </Button>
          </Box>

          {/* Assignment Description */}
          <Box
            bgcolor={theme.palette.background.paper} // Dynamic card background
            p={3}
            borderRadius="8px"
            boxShadow={1}
            mb={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
              sx={{
                color: theme.palette.text.primary, // Dynamic text color
              }}
            >
              Description of the Assignment
            </Typography>
            <Typography
              variant="body1"
              textAlign="center"
              mb={2}
              sx={{
                color: theme.palette.text.secondary, // Dynamic secondary text color
              }}
            >
              Lorem ipsum dolor sit amet consectetur. Massa ultrices elit donec sem...
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              p={2}
              border={`1px solid ${theme.palette.divider}`} // Dynamic border color
              borderRadius="8px"
              mb={2}
            >
              <Box display="flex" alignItems="center">
                <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{
                    color: theme.palette.text.primary, // Dynamic text color
                  }}
                >
                  Assignment1.pdf
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.primary.main, // Dynamic button background
                  color: theme.palette.primary.contrastText, // Dynamic button text color
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark, // Dynamic hover background
                  },
                }}
              >
                Download
              </Button>
            </Box>
          </Box>

          {/* Deadline Section */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            bgcolor={theme.palette.background.paper} // Dynamic card background
            borderRadius="8px"
            boxShadow={1}
            mb={3}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: theme.palette.text.primary, // Dynamic text color
              }}
            >
              Deadline
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary, // Dynamic secondary text color
              }}
            >
              31-03-2025 &nbsp; | &nbsp; 18:00
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary.main, // Dynamic button background
                color: theme.palette.primary.contrastText, // Dynamic button text color
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark, // Dynamic hover background
                },
              }}
              onClick={handleAddFiles}
            >
              Add Files
            </Button>

            <Button
              variant="contained"
              onClick={() => handleMarkAsDone(lessonIndex, fileIndex)}
              sx={{
                backgroundColor: doneFiles[`${lessonIndex}-${fileIndex}`]
                  ? theme.palette.success.main // Dynamic background when marked as done
                  : theme.palette.action.hover, // Default background
                color: doneFiles[`${lessonIndex}-${fileIndex}`]
                  ? theme.palette.success.contrastText // Dynamic text color when marked as done
                  : theme.palette.text.primary, // Default text color
                border: `1px solid ${theme.palette.divider}`, // Dynamic border color
                '&:hover': {
                  backgroundColor: doneFiles[`${lessonIndex}-${fileIndex}`]
                    ? theme.palette.success.dark // Hover background when marked as done
                    : theme.palette.action.hover, // Default hover background
                },
              }}
            >
              {doneFiles[`${lessonIndex}-${fileIndex}`] ? 'Marked as Done' : 'Mark as Done'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AssignmentView;