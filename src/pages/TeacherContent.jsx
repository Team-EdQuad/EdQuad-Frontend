import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { Assignment, LibraryBooks } from '@mui/icons-material';
import { StoreContext } from '../context/StoreContext';

const TeacherContent = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { subject, className, subject_id, class_id } = location.state || {}; 
  const {id:teacher_id} = useContext(StoreContext);

  const handleCreateAssignment = () => {
    navigate('/assignment-create', {
      state: { subject_id, class_id, teacher_id:  teacher_id } 
    }); 
  };

  const handleAddContent = () => {
    navigate('/add-content', { state: { class_id, subject_id } });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: 'url(https://thumbs.dreamstime.com/z/classroom-kids-teacher-professor-teaches-students-first-grade-elementary-school-class-little-children-preschool-120236345.jpg?ct=jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(0px)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://thumbs.dreamstime.com/z/classroom-kids-teacher-professor-teaches-students-first-grade-elementary-school-class-little-children-preschool-120236345.jpg?ct=jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(8px)',
          zIndex: -1,
        },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      {/* Content Container with Glass Effect */}
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minWidth: '500px',
          maxWidth: '800px',
          width: '100%',
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={2}
          sx={{
            color: theme.palette.text.primary,
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Teacher Dashboard
        </Typography>

        {/* Subject and Class Info */}
        <Box
          sx={{
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            mb: 4,
            border: '1px solid rgba(33, 150, 243, 0.2)',
          }}
        >
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{
              color: theme.palette.text.primary,
              textAlign: 'center',
            }}
          >
            {`Subject: ${subject} | Class: ${className}`}
          </Typography>
        </Box>

        {/* Action Cards */}
        <Grid container spacing={3} justifyContent="center">
          {/* Create Assignment Card */}
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              sx={{
                padding: '30px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  zIndex: 1,
                },
              }}
              onClick={handleCreateAssignment}
            >
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Assignment 
                  sx={{ 
                    fontSize: '3rem', 
                    color: 'white', 
                    mb: 2,
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                  }} 
                />
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    mb: 1,
                  }}
                >
                  Create Assignment
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.9rem',
                  }}
                >
                  Design and assign tasks to students
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Add Content Card */}
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              sx={{
                padding: '30px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '16px',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(240, 147, 251, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 35px rgba(240, 147, 251, 0.4)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  zIndex: 1,
                },
              }}
              onClick={handleAddContent}
            >
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <LibraryBooks 
                  sx={{ 
                    fontSize: '3rem', 
                    color: 'white', 
                    mb: 2,
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                  }} 
                />
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    mb: 1,
                  }}
                >
                  Add Content
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.9rem',
                  }}
                >
                  Upload learning materials and resources
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Additional Info Section */}
        <Box
          sx={{
            mt: 4,
            textAlign: 'center',
            padding: '16px',
            backgroundColor: 'rgba(0,0,0,0.02)',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontStyle: 'italic',
            }}
          >
            Select an option above to manage your classroom content
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TeacherContent;
