import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';


const AssignmentView = () => {
  const { assignmentName } = useParams();
  const navigate = useNavigate();
  // ✅ State defined inside the component
  const [doneFiles, setDoneFiles] = useState({});

  // ✅ Dummy values for example — update based on your logic
  const lessonIndex = 0;
  const fileIndex = 0;

  const handleMarkAsDone = (lessonIndex, fileIndex) => {
    setDoneFiles((prev) => ({
      ...prev,
      [`${lessonIndex}-${fileIndex}`]: !prev[`${lessonIndex}-${fileIndex}`],
    }));
  };


  
  const handleAddFiles = () => {
    navigate('/submission'); // ✅ navigate to Submission.jsx (route path should match this)
  };


  return (
    <Box display="flex" flexDirection="column" bgcolor="#f5f5ff" minHeight="100vh">
      
      <Box display="flex" flex={1}>
        
        <Box flex={1} p={3}>
          <Typography variant="h4" fontWeight="bold">
            {assignmentName}
          </Typography>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => window.history.back()}
            >
              Back
            </Button>
          </Box>

          {/* Assignment Description */}
          <Box
            bgcolor="#ffffff"
            p={3}
            borderRadius="8px"
            boxShadow={1}
            mb={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Description of the Assignment
            </Typography>
            <Typography variant="body1" textAlign="center" mb={2}>
              Lorem ipsum dolor sit amet consectetur. Massa ultrices elit donec sem...
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              p={2}
              border="1px solid #e0e0e0"
              borderRadius="8px"
              mb={2}
            >
              <Box display="flex" alignItems="center">
                <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
                <Typography variant="body1" fontWeight="bold">
                  Assignment1.pdf
                </Typography>
              </Box>
              <Button variant="contained" color="primary">
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
            bgcolor="#ffffff"
            borderRadius="8px"
            boxShadow={1}
            mb={3}
          >
            <Typography variant="h6" fontWeight="bold">
              Deadline
            </Typography>
            <Typography variant="body1">31-03-2025 &nbsp; | &nbsp; 18:00</Typography>
          </Box>

          {/* Action Buttons */}
          <Box display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" color="primary" onClick={handleAddFiles}>
              Add Files
            </Button>

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
              {doneFiles[`${lessonIndex}-${fileIndex}`] ? 'Marked as Done' : 'Mark as Done'}
            </Button>
          </Box>
        </Box>
      </Box>

    </Box>
  );
};

export default AssignmentView;
