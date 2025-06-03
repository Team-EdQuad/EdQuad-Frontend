import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Button, MenuItem, Select,
  FormControl, InputLabel, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TeacherSubject = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const teacher_id = "TCH001";

  // State
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('');
  const [subjectsClasses, setSubjectsClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);

  // Fetch data from API
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/subjectNclass/${teacher_id}`)
      .then((response) => {
        setSubjectsClasses(response.data.subjects_classes);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [teacher_id]);

  // Handle subject change
  const handleSubjectChange = (event) => {
    const selectedSubject = event.target.value;
    setSubject(selectedSubject);
    setClassName(''); // Reset class selection when subject changes

    const selected = subjectsClasses.find(
      (item) => item.subject_name === selectedSubject
    );
    setFilteredClasses(selected ? selected.classes : []);
  };

  // Handle class change
  const handleClassChange = (event) => {
    setClassName(event.target.value);
  };

  // Submit navigation
  const handleSubmit = () => {
    const selectedSubject = subjectsClasses.find(
      (item) => item.subject_name === subject
    );
    
    const selectedClass = selectedSubject?.classes.find(
      (cls) => cls.class_name === className
    );

    const subject_id = selectedSubject?.subject_id;
    const class_id = selectedClass?.class_id;

    navigate('/teacher-content', {
      state: {
        subject,
        className,
        subject_id,
        class_id
      }
    });
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
          minWidth: '400px',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          mb={3} 
          sx={{ 
            color: theme.palette.text.primary,
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Select Subject and Class
        </Typography>

        {/* Subject Dropdown */}
        <FormControl 
          sx={{ 
            mb: 3, 
            width: '100%',
            backgroundColor: theme.palette.background.paper, 
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            '& .MuiOutlinedInput-root': {
              fontSize: '1rem',
              height: '48px',
              '& fieldset': {
                borderColor: 'rgba(0,0,0,0.1)',
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.95rem',
              fontWeight: '500',
            }
          }}
        >
          <InputLabel 
            sx={{ 
              color: theme.palette.text.secondary,
              fontSize: '0.95rem',
              fontWeight: '500'
            }}
          >
            Select Subject
          </InputLabel>
          <Select
            value={subject}
            onChange={handleSubjectChange}
            sx={{ 
              color: theme.palette.text.primary,
              fontSize: '1rem',
              height: '48px',
              '& .MuiSelect-select': {
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
              }
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  '& .MuiMenuItem-root': {
                    fontSize: '0.95rem',
                    padding: '10px 16px',
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    }
                  }
                }
              }
            }}
          >
            {subjectsClasses.map((sub) => (
              <MenuItem key={sub.subject_id} value={sub.subject_name}>
                {sub.subject_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Class Dropdown */}
        <FormControl 
          sx={{ 
            mb: 3, 
            width: '100%',
            backgroundColor: theme.palette.background.paper, 
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            '& .MuiOutlinedInput-root': {
              fontSize: '1rem',
              height: '48px',
              '& fieldset': {
                borderColor: 'rgba(0,0,0,0.1)',
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              }
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.95rem',
              fontWeight: '500',
            }
          }}
        >
          <InputLabel 
            sx={{ 
              color: theme.palette.text.secondary,
              fontSize: '0.95rem',
              fontWeight: '500'
            }}
          >
            Select Class
          </InputLabel>
          <Select
            value={className}
            onChange={handleClassChange}
            sx={{ 
              color: theme.palette.text.primary,
              fontSize: '1rem',
              height: '48px',
              '& .MuiSelect-select': {
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
              }
            }}
            disabled={!filteredClasses.length}
            MenuProps={{
              PaperProps: {
                sx: {
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  '& .MuiMenuItem-root': {
                    fontSize: '0.95rem',
                    padding: '10px 16px',
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    }
                  }
                }
              }
            }}
          >
            {filteredClasses.map((cls) => (
              <MenuItem key={cls.class_id} value={cls.class_name}>
                {cls.class_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!subject || !className}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              padding: '10px 30px',
              borderRadius: '10px',
              minWidth: '140px',
              boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
              },
              '&:disabled': {
                background: 'rgba(0,0,0,0.12)',
                color: 'rgba(0,0,0,0.26)',
                transform: 'none',
                boxShadow: 'none',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TeacherSubject;
