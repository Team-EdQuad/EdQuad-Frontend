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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(`${Url}/api/assignment/${assignmentId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Assignment data:', data); 
        setAssignment(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignment:', error);
        setError('Failed to load assignment');
        setLoading(false);
      }
    };
    
    fetchAssignment();
  }, [assignmentId, navigate]);
  
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!assignment) return <Typography>Assignment not found</Typography>;
  
  const handleBack = () => {
    navigate(-1);
  };
  

  const handleView = () => {
   if (assignment.assignment_file_path) {
    // Local file
    const fileUrl = `${Url}/api/assignment/file/${assignment.assignment_id}`;
    navigate('/assignment-file-view', {
      state: {
        assignmentFileUrl: fileUrl,
        assignmentFileName: assignment.assignment_file_path.split(/[\\/]/).pop()
      }
    });
  } else {
    alert('No file available for this assignment');
  }
};

  
  const handleSubmission = () => {
    navigate(`/submission/${assignment.assignment_id}`);
  };
  
  // Get file name for display
  const getFileName = () => {
    if (assignment.file_name) {
      return assignment.file_name;
    } else if (assignment.assignment_file_path) {
      return assignment.assignment_file_path.split(/[\\/]/).pop();
    } else {
      return `${assignment.assignment_name}.pdf`;
    }
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
        
        {/*  Only show file section if file exists */}
        {(assignment.assignment_file_id || assignment.assignment_file_path) && (
          <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <PictureAsPdfIcon color="error" sx={{ mr: 1 }} />
              <Typography>
                {getFileName()}
              </Typography>
            </Box>
            <Button variant="contained" onClick={handleView}>
              View File
            </Button>
          </Box>
        )}
        
        <Box mt={3}>
          <Typography variant="h6">Deadline</Typography>
          <Typography>
            {new Date(assignment.Deadline || assignment.deadline).toLocaleString()}
          </Typography>
        </Box>
        
        <Box mt={4} display="flex" justifyContent="center">
          <Button variant="contained" onClick={handleSubmission}>
            Submit Assignment
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AssignmentView;
