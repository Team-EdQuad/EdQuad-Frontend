import React, { useState, useEffect, useContext  } from 'react';
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
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
const Url = import.meta.env.VITE_BACKEND_URL;

const ReviewAutoGradedAssignments = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: teacher_id } = useContext(StoreContext);

  const [onTime, setOnTime] = useState([]);
  const [late, setLate] = useState([]);
  const [marksInput, setMarksInput] = useState({});
  const [actionInput, setActionInput] = useState({});

  useEffect(() => {
    axios
      .get(`${Url}/api/auto_graded_submissions/${teacher_id}`)
      .then(({ data }) => {
        setOnTime(data.on_time_submissions || []);
        setLate(data.late_submissions || []);

        const initialMarks = {};
        const initialActions = {};

        [...(data.on_time_submissions || []), ...(data.late_submissions || [])].forEach(sub => {
          initialMarks[sub.submission_id] = sub.marks || '';
          initialActions[sub.submission_id] = 'approve';
        });

        setMarksInput(initialMarks);
        setActionInput(initialActions);
      })
      .catch((err) => console.error('Error fetching auto-graded submissions:', err));
  }, []);

  const handleMarkChange = (submission_id, value) => {
    setMarksInput((prev) => ({ ...prev, [submission_id]: value }));
    const originalMarks = [...onTime, ...late].find(s => s.submission_id === submission_id)?.marks;
    if (parseFloat(value) !== originalMarks) {
      setActionInput((prev) => ({ ...prev, [submission_id]: 'modify' }));
    }
  };

  const handleActionChange = (submission_id, value) => {
    setActionInput((prev) => ({ ...prev, [submission_id]: value }));
  };

  const handleReviewSubmission = (submission_id) => {
    const marks = parseFloat(marksInput[submission_id]);
    const action = actionInput[submission_id];

    if (isNaN(marks) || marks < 0 || marks > 100) {
      alert('Enter a valid mark between 0 and 100');
      return;
    }

    const formData = new URLSearchParams();
    formData.append('submission_id', submission_id);
    formData.append('marks', marks);
    formData.append('action', action);

    axios
      .post(`${Url}/api/review_auto_graded_marks/${teacher_id}`, formData)
      .then(() => {
        setOnTime(prev => prev.filter(s => s.submission_id !== submission_id));
        setLate(prev => prev.filter(s => s.submission_id !== submission_id));
        alert(`Marks ${action === 'approve' ? 'approved' : 'modified'} successfully!`);
      })
      .catch(err => {
        console.error('Review failed:', err);
        alert('Failed to review marks');
      });
  };

  const renderTable = (title, submissions) => (
    <Box mt={5} width="100%">
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {['Student ID', 'Class', 'Subject', 'Assignment', 'File', 'AI Marks', 'Review Marks', 'Action', 'Review'].map((h) => (
                <TableCell key={h} sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 'bold',
                }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.submission_id}>
                <TableCell>{sub.student_id}</TableCell>
                <TableCell>{sub.class_name}</TableCell>
                <TableCell>{sub.subject_name}</TableCell>
                <TableCell>{sub.assignment_name}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.primary.main, textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={() => navigate(`/submission/view/${sub.submission_id}`)}
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
                    onChange={(e) => handleMarkChange(sub.submission_id, e.target.value)}
                    sx={{ width: '80px' }}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <Select
                      value={actionInput[sub.submission_id] || 'approve'}
                      onChange={(e) => handleActionChange(sub.submission_id, e.target.value)}
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
                      backgroundColor: actionInput[sub.submission_id] === 'approve'
                        ? theme.palette.success.main
                        : theme.palette.warning.main,
                      color: theme.palette.primary.contrastText,
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
    </Box>
  );

  return (
    <Box p={3} minHeight="100vh" bgcolor={theme.palette.background.default}>
      <Box display="flex" alignItems="center" mb={3}>
        <SmartToyIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 30 }} />
        <Typography variant="h5" fontWeight="bold">
          Review AI-Graded Assignments
        </Typography>
      </Box>

      {onTime.length === 0 && late.length === 0 ? (
        <Typography variant="h6" color={theme.palette.text.secondary}>
          No auto-graded submissions pending review
        </Typography>
      ) : (
        <>
          {onTime.length > 0 && renderTable('On-Time Submissions', onTime)}
          {late.length > 0 && renderTable('Late Submissions', late)}
        </>
      )}
    </Box>
  );
};

export default ReviewAutoGradedAssignments;
