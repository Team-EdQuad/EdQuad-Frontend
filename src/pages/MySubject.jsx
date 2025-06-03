import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, CircularProgress, useTheme } from '@mui/material';
import { MenuBook } from '@mui/icons-material';

const MySubject = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = "STU001";

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/subject/${studentId}`)
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
    <Box
      sx={{
        minHeight: "100vh",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Image with Blur */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(https://thumbs.dreamstime.com/z/pupil-kids-classroom-primary-school-children-pupils-smiling-boys-girls-study-schools-class-cartoon-vector-education-124097588.jpg?ct=jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(10px)',
          transform: 'scale(1.1)',
          zIndex: -2,
        }}
      />
      
      {/* Background Overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: -1,
        }}
      />

      {/* Main Content Container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          p: 3,
        }}
      >
        {/* Header Section with Glass Effect */}
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '20px 30px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            mb: 4,
            maxWidth: '1200px',
            margin: '0 auto 30px auto',
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: theme.palette.text.primary,
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            My Subjects
          </Typography>
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              }}
            >
              <CircularProgress 
                size={60}
                sx={{
                  color: theme.palette.primary.main,
                }}
              />
            </Box>
          ) : error ? (
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '30px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              }}
            >
              <Typography 
                color="error" 
                variant="h6"
                sx={{ fontWeight: '600' }}
              >
                {error}
              </Typography>
            </Box>
          ) : subjects.length === 0 ? (
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '30px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              }}
            >
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                No subjects found.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {subjects.map((subject) => (
                <Grid item xs={12} sm={6} md={4} key={subject.Subject_id}>
                  <Paper
                    elevation={0}
                    sx={{
                      padding: '30px 20px',
                      textAlign: 'center',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      minHeight: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'url(https://thumbs.dreamstime.com/b/hand-drawn-symbols-school-subjects-chalkboard-93532726.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        filter: 'blur(4px)',
                        opacity: 0.4,
                        transform: 'scale(1.1)',
                        zIndex: 1,
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 2,
                      },
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                        '&::after': {
                          background: 'rgba(255, 255, 255, 0.85)',
                        },
                      },
                    }}
                    onClick={() => handleSubjectClick(subject.Subject_id)}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        zIndex: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <MenuBook
                        sx={{
                          fontSize: '2.5rem',
                          color: theme.palette.primary.main,
                          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))',
                        }}
                      />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          color: theme.palette.text.primary,
                          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                          textAlign: 'center',
                          lineHeight: 1.2,
                          fontSize: '1.2rem',
                        }}
                      >
                        {subject.SubjectName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: '500',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontSize: '0.75rem',
                        }}
                      >
                        Click to explore
                      </Typography>
                    </Box>
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
