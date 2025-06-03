import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
  useTheme,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReviewAutoGradedAssignments = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const teacher_id = 'TCH001';

  const [submissions, setSubmissions] = useState([]);
  const [marksInput, setMarksInput] = useState({});
  const [actionInput, setActionInput] = useState({});

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/auto_graded_submissions/${teacher_id}`)
      .then(({ data }) => {
        setSubmissions(data);
        // Initialize marks input with AI-generated marks
        const initialMarks = {};
        const initialActions = {};
        data.forEach(sub => {
          initialMarks[sub.submission_id] = sub.marks || '';
          initialActions[sub.submission_id] = 'approve';
        });
        setMarksInput(initialMarks);
        setActionInput(initialActions);
      })
      .catch((err) => console.error('Error fetching auto-graded submissions:', err));
  }, []);

  const handleMarkChange = (submission_id, value) => {
    setMarksInput((prev) => ({
      ...prev,
      [submission_id]: value,
    }));
    
    // Auto-set action to "modify" if marks are changed from original
    const originalMarks = submissions.find(s => s.submission_id === submission_id)?.marks;
    if (parseFloat(value) !== originalMarks) {
      setActionInput(prev => ({
        ...prev,
        [submission_id]: 'modify'
      }));
    }
  };

  const handleActionChange = (submission_id, action) => {
    setActionInput((prev) => ({
      ...prev,
      [submission_id]: action,
    }));
  };

  const handleReviewSubmission = (submission_id) => {
    const marks = parseFloat(marksInput[submission_id]);
    const action = actionInput[submission_id];
    
    if (isNaN(marks) || marks < 0 || marks > 100) {
      alert('Please enter a valid number between 0 and 100');
      return;
    }

    // Create URL-encoded form data
    const formData = new URLSearchParams();
    formData.append('submission_id', submission_id);
    formData.append('marks', marks);
    formData.append('action', action);

    axios
      .post(
        `http://127.0.0.1:8000/api/review_auto_graded_marks/${teacher_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
          },
        }
      )
      .then(({ data }) => {
        console.log('Review response:', data);
        // Remove the reviewed submission from the list
        setSubmissions((prev) =>
          prev.filter(s => s.submission_id !== submission_id)
        );
        alert(`Marks ${action === 'approve' ? 'approved' : 'modified'} successfully!`);
      })
      .catch((err) => {
        console.error('Error reviewing marks:', err);
        alert('Failed to review marks');
      });
  };

  const getOriginalMarks = (submission_id) => {
    return submissions.find(s => s.submission_id === submission_id)?.marks || 0;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor={theme.palette.background.default}
      minHeight="100vh"
      p={3}
    >
      <Box display="flex" alignItems="center" mb={3}>
        <SmartToyIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 30 }} />
        <Typography
          variant="h5"
          fontWeight="bold"
          color={theme.palette.text.primary}
        >
          Review AI-Graded Assignments
        </Typography>
      </Box>

      {submissions.length === 0 ? (
        <Typography variant="h6" color={theme.palette.text.secondary}>
          No auto-graded submissions pending review
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '8px',
            boxShadow: 1,
            maxWidth: '1200px',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {[
                  'Student ID', 
                  'Class', 
                  'Subject', 
                  'Assignment', 
                  'File', 
                  'AI Marks', 
                  'Review Marks', 
                  'Action', 
                  'Review'
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 'bold',
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((sub) => (
                <TableRow
                  key={sub.submission_id}
                  sx={{
                    backgroundColor:
                      submissions.indexOf(sub) % 2 === 0
                        ? theme.palette.action.hover
                        : theme.palette.background.default,
                  }}
                >
                  <TableCell>{sub.student_id}</TableCell>
                  <TableCell>{sub.class_name}</TableCell>
                  <TableCell>{sub.subject_name}</TableCell>
                  <TableCell>{sub.assignment_name}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.primary.main,
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          navigate(`/submission/view/${sub.submission_id}`)
                        }
                      >
                        {sub.file_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${sub.marks || 0}/100`}
                      color="info"
                      size="small"
                      icon={<SmartToyIcon />}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      size="small"
                      type="number"
                      value={marksInput[sub.submission_id] || ''}
                      onChange={(e) =>
                        handleMarkChange(sub.submission_id, e.target.value)
                      }
                      sx={{
                        width: '80px',
                        backgroundColor: theme.palette.background.paper,
                      }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <Select
                        value={actionInput[sub.submission_id] || 'approve'}
                        onChange={(e) =>
                          handleActionChange(sub.submission_id, e.target.value)
                        }
                      >
                        <MenuItem value="approve">Approve</MenuItem>
                        <MenuItem value="modify">Modify</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleReviewSubmission(sub.submission_id)}
                      sx={{
                        backgroundColor: 
                          actionInput[sub.submission_id] === 'approve' 
                            ? theme.palette.success.main 
                            : theme.palette.warning.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                          backgroundColor: 
                            actionInput[sub.submission_id] === 'approve' 
                              ? theme.palette.success.dark 
                              : theme.palette.warning.dark,
                        },
                      }}
                    >
                      {actionInput[sub.submission_id] === 'approve' ? 'Approve' : 'Update'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ReviewAutoGradedAssignments;
