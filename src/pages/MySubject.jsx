import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, CircularProgress, useTheme } from '@mui/material';

const MySubject = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = "STU001"; // Replace with real student ID (from auth or context)

  useEffect(() => {
    axios
      .get(`http://localhost:8002/students/${studentId}/subjects`)
      .then((res) => {
        setSubjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch subjects:", err);
        setError("Unable to load subjects.");
        setLoading(false);
      });
  }, [studentId]);

  const handleSubjectClick = (subjectId) => {
    navigate(`/subject/${subjectId}`);
  };

  return (
    <Box>
      <Box display="flex">
        <Box
          flex={1}
          p={2}
          sx={{
            bgcolor: theme.palette.background.default,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={2}
            align="left"
            sx={{ color: theme.palette.text.primary }}
          >
            My Subjects
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : subjects.length === 0 ? (
            <Typography>No subjects found.</Typography>
          ) : (
            <Grid container spacing={5}>
              {subjects.map((subject) => (
                <Grid item xs={12} sm={6} md={4} key={subject.Subject_id}>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: '70px',
                      textAlign: 'center',
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      color: theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                    onClick={() => handleSubjectClick(subject.Subject_id)}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {subject.SubjectName}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MySubject;
