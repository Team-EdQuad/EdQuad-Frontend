import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SubjectContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme(); // Access the current theme

  // Dummy data for lessons
  const lessons = [
    {
      date: '2025-01-20',
      title: 'Lesson 1',
      files: [
        { name: 'Topic1.pdf', type: 'pdf', url: 'src/assets/pdf/topic1.pdf' },
        { name: 'lab1.mp4', type: 'mp4', url: 'src/assets/mp4/1.mp4' },
        { name: 'Topic2.pdf', type: 'pdf', url: '/assets/pdf/topic2.pdf' },
        { name: 'Assignment 1', type: 'assignment' },
      ],
    },
    {
      date: '2025-01-31',
      title: 'Lesson 2',
      files: [
        { name: 'Topic3.pdf', type: 'pdf', url: '/assets/pdf/topic3.pdf' },
        { name: 'song.mp4', type: 'mp4', url: 'src/assets/mp4/mp3.mkv' },
        { name: 'Assignment 2', type: 'assignment' },
      ],
    },
  ];

  // State to track which files are marked as done
  const [doneFiles, setDoneFiles] = useState({});

  const handleMarkAsDone = (lessonIndex, fileIndex) => {
    setDoneFiles((prev) => ({
      ...prev,
      [`${lessonIndex}-${fileIndex}`]: !prev[`${lessonIndex}-${fileIndex}`],
    }));
  };

  const handleFileClick = (file) => {
    if (file.type === 'assignment') {
      navigate(`/assignment-view/${file.name}`); // Navigate to AssignmentView page
    } else {
      navigate('/content-view', {
        state: {
          fileUrl: file.url, // Pass the file URL
          fileType: file.type, // Pass the file type (e.g., 'pdf', 'mp4')
          fileName: file.name, // Pass the file name
        },
      });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor={theme.palette.background.default} // Dynamic background color
      minHeight="100vh"
    >
      <Box display="flex" flex={1}>
        {/* Main Content */}
        <Box flex={1} p={3}>
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
              variant="h5"
              fontWeight="bold"
              sx={{
                color: theme.palette.text.primary, // Dynamic text color
              }}
            >
              Subject {id}
            </Typography>
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

          {/* Lessons Content */}
          <Box mt={3}>
            {lessons.map((lesson, lessonIndex) => (
              <Box key={lessonIndex} mb={4}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                >
                  {lesson.date} - {lesson.title}
                </Typography>
                <List>
                  {lesson.files.map((file, fileIndex) => (
                    <ListItem
                      key={fileIndex}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: theme.palette.background.paper, // Dynamic list item background
                        borderRadius: '8px',
                        mb: 1,
                        boxShadow: 1,
                      }}
                    >
                      <ListItemText
                        primary={file.name}
                        onClick={() => handleFileClick(file)} // Handle file click
                        sx={{
                          cursor: 'pointer',
                          color: file.type === 'assignment'
                            ? theme.palette.primary.main // Highlight assignments
                            : theme.palette.text.primary, // Default text color
                          textDecoration: file.type === 'assignment' ? 'underline' : 'none',
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => handleMarkAsDone(lessonIndex, fileIndex)}
                        sx={{
                          backgroundColor: doneFiles[`${lessonIndex}-${fileIndex}`]
                            ? theme.palette.primary.main // Set color when marked as done
                            : theme.palette.action.hover, // Set default color
                          color: doneFiles[`${lessonIndex}-${fileIndex}`]
                            ? theme.palette.primary.contrastText // Text color when marked as done
                            : theme.palette.text.primary, // Default text color
                          border: `1px solid ${theme.palette.primary.main}`, // Border color
                          '&:hover': {
                            backgroundColor: doneFiles[`${lessonIndex}-${fileIndex}`]
                              ? theme.palette.primary.dark // Hover color when marked as done
                              : theme.palette.action.hover, // Hover color when not marked as done
                          },
                        }}
                      >
                        Mark as Done
                      </Button>
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ mt: 2, bgcolor: theme.palette.divider }} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SubjectContent;