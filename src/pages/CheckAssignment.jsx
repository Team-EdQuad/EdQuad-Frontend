import React, { useState, useEffect, useContext } from 'react';
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
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const Url = import.meta.env.VITE_BACKEND_URL;

const CheckAssignment = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: teacher_id } = useContext(StoreContext);

  const [onTimeSubmissions, setOnTimeSubmissions] = useState([]);
  const [lateSubmissions, setLateSubmissions] = useState([]);
  const [marksInput, setMarksInput] = useState({});

  useEffect(() => {
    axios
      .get(`${Url}/api/submission_view/${teacher_id}`)
      .then(({ data }) => {
        setOnTimeSubmissions(data.on_time_submissions || []);
        setLateSubmissions(data.late_submissions || []);
      })
      .catch((err) => console.error('Error fetching submissions:', err));
  }, [teacher_id]);

  const handleMarkChange = (submission_id, value) => {
    setMarksInput((prev) => ({
      ...prev,
      [submission_id]: value,
    }));
  };

  const handleSubmitMarks = (submission_id) => {
    const marks = parseInt(marksInput[submission_id], 10);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      alert('Please enter a valid number between 0 and 100');
      return;
    }

    const formData = new URLSearchParams();
    formData.append('submission_id', submission_id);
    formData.append('marks', marks);

    axios
      .post(`${Url}/api/update_submission_marks/${teacher_id}`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
        },
      })
      .then(({ data }) => {
        const updateList = (list) =>
          list.map((s) =>
            s.submission_id === submission_id ? { ...s, marks: data.marks } : s
          );

        setOnTimeSubmissions((prev) => updateList(prev));
        setLateSubmissions((prev) => updateList(prev));

        alert('Marks updated successfully!');
        window.location.reload();
      })
      .catch((err) => {
        console.error('Error updating marks:', err);
        alert('Failed to update marks');
      });
  };

  const renderSubmissionTable = (title, submissionList, highlightLate = false) => (
    <>
      <Typography
        variant="h6"
        fontWeight="bold"
        mt={4}
        mb={2}
        color={highlightLate ? theme.palette.error.main : theme.palette.primary.main}
      >
        {title}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: '8px',
          boxShadow: 1,
          maxWidth: '1000px',
          mb: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {['Student ID', 'Class', 'Subject', 'Assignment', 'File', 'Marks', 'Action'].map(
                (h) => (
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
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {submissionList.map((sub) => (
              <TableRow
                key={sub.submission_id}
                sx={{
                  backgroundColor: highlightLate
                    ? theme.palette.error.light
                    : theme.palette.action.hover,
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
                      onClick={() => navigate(`/submission/view/${sub.submission_id}`)}
                    >
                      {sub.file_name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={
                      marksInput[sub.submission_id] ??
                      (sub.marks != null ? sub.marks : '')
                    }
                    onChange={(e) =>
                      handleMarkChange(sub.submission_id, e.target.value)
                    }
                    sx={{ width: '80px' }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleSubmitMarks(sub.submission_id)}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Submit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

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
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        color={theme.palette.text.primary}
      >
        Check Assignments
      </Typography>

      {renderSubmissionTable('🟢 On Time Submissions', onTimeSubmissions)}
      {renderSubmissionTable('🔴 Late Submissions', lateSubmissions, true)}
    </Box>
  );
};

export default CheckAssignment;
