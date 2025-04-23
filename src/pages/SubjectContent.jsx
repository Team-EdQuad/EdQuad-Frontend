import React, { useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const SubjectContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Dummy data for lessons
  const lessons = [
    {
      date: '2025-01-20',
      title: 'Lesson 1',
      files: [
        { name: 'Topic1.pdf', type: 'pdf' },
        { name: 'lab1.mp4', type: 'mp4' },
        { name: 'Topic2.pdf', type: 'pdf' },
        { name: 'Assignment 1', type: 'assignment' },
      ],
    },
    {
      date: '2025-01-31',
      title: 'Lesson 2',
      files: [
        { name: 'Topic3.pdf', type: 'pdf' },
        { name: 'song.mp4', type: 'mp4' },       
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


  const handleAssignmentClick = (assignmentName) => {
    navigate(`/assignment-view/${assignmentName}`); // Navigate to AssignmentView page with assignment name
  };

  return (
    <Box display="flex" flexDirection="column" bgcolor="#f5f5ff" minHeight="100vh">
    
      <Box display="flex" flex={1}>
      

        {/* Main Content */}
        <Box flex={1} p={3}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="#ffffff" boxShadow={1}>
            <Typography variant="h5" fontWeight="bold">
              Subject {id}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => window.history.back()}
            >
              Back
            </Button>
          </Box>

          {/* Lessons Content */}
          <Box mt={3}>
            {lessons.map((lesson, lessonIndex) => (
              <Box key={lessonIndex} mb={4}>
                <Typography variant="h6" fontWeight="bold" color="primary">
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
                        bgcolor: '#ffffff',
                        borderRadius: '8px',
                        mb: 1,
                        boxShadow: 1,
                      }}
                    >
                      <ListItemText primary={file.name}
                      onClick={() =>
                        file.type === 'assignment' && handleAssignmentClick(file.name)
                      } // Navigate if it's an assignment
                      sx={{
                        cursor: file.type === 'assignment' ? 'pointer' : 'default',
                        color: file.type === 'assignment' ? 'blue' : 'inherit',
                        textDecoration: file.type === 'assignment' ? 'underline' : 'none',
                      }}
                      
                      />
                      
                      
                      <Button
                        variant="contained"
                        onClick={() => handleMarkAsDone(lessonIndex, fileIndex)}
                        sx={{
                          backgroundColor: doneFiles[`${lessonIndex}-${fileIndex}`] ? 'blue' : 'white',
                          color: doneFiles[`${lessonIndex}-${fileIndex}`] ? 'white' : 'blue',
                          border: '1px solid blue',
                          '&:hover': {
                            backgroundColor: doneFiles[`${lessonIndex}-${fileIndex}`] ? 'darkblue' : '#f0f0f0',
                          },
                        }}
                      >
                        Mark as Done
                      </Button>
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      
    </Box>
  );
};

export default SubjectContent;