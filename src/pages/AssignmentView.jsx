import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
const Url = import.meta.env.VITE_BACKEND_URL;


const AssignmentView = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [assignment, setAssignment] = useState(null);
  
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(`${Url}/api/assignment/${assignmentId}`);
        const data = await response.json();
        setAssignment(data);
      } catch (error) {
        console.error('Error fetching assignment:', error);
        navigate(-1);
      }
    };
    fetchAssignment();
  }, [assignmentId, navigate]);
  
  if (!assignment) return <Typography>Loading...</Typography>;
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleView = () => {
    const fileName = assignment.assignment_file_path.split(/[\\/]/).pop();
    const fileUrl = `${Url}/api/assignment/file/${assignment.assignment_id}`;
    navigate('/assignment-file-view', {
      state: {
        assignmentFileUrl: fileUrl,
        assignmentFileName: fileName
      }
    });
  };
  
  const handleSubmission = () => {
    // Navigate to the submission page with the assignment ID
    navigate(`/submission/${assignment.assignment_id}`);
  };
  
  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {assignment.assignment_name}
      </Typography>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Back
      </Button>
      <Box p={3} boxShadow={2} borderRadius="12px" bgcolor={theme.palette.background.paper}>
        <Typography variant="h6" gutterBottom>Description</Typography>
        <Typography gutterBottom>
          {assignment.description || 'No description available.'}
        </Typography>
        <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <PictureAsPdfIcon color="error" sx={{ mr: 1 }} />
            <Typography>
              {assignment.assignment_file_path.split(/[\\/]/).pop()}
            </Typography>
          </Box>
          <Button variant="contained" onClick={handleView}>
            View
          </Button>
        </Box>
        <Box mt={3}>
          <Typography variant="h6">Deadline</Typography>
          <Typography>
            {new Date(assignment.Deadline).toLocaleString()}
          </Typography>
        </Box>
        <Box mt={4} display="flex" justifyContent="center">
          <Button variant="contained" onClick={handleSubmission}>
            Add Files
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AssignmentView;