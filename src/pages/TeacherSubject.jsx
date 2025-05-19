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
  const teacher_id = "TCH002";

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
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor={theme.palette.background.default}
      minHeight="100vh"
      p={3}
    >
      <Typography variant="h5" fontWeight="bold" mb={3} sx={{ color: theme.palette.text.primary }}>
        Select Subject and Class
      </Typography>

      {/* Subject Dropdown */}
      <FormControl sx={{ mb: 3, width: '300px', backgroundColor: theme.palette.background.paper, borderRadius: '8px' }}>
        <InputLabel sx={{ color: theme.palette.text.secondary }}>Select Subject</InputLabel>
        <Select
          value={subject}
          onChange={handleSubjectChange}
          sx={{ color: theme.palette.text.primary }}
        >
          {subjectsClasses.map((sub) => (
            <MenuItem key={sub.subject_id} value={sub.subject_name}>
              {sub.subject_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Class Dropdown (filtered based on subject) */}
      <FormControl sx={{ mb: 3, width: '300px', backgroundColor: theme.palette.background.paper, borderRadius: '8px' }}>
        <InputLabel sx={{ color: theme.palette.text.secondary }}>Select Class</InputLabel>
        <Select
          value={className}
          onChange={handleClassChange}
          sx={{ color: theme.palette.text.primary }}
          disabled={!filteredClasses.length} // Disable if no subject is selected
        >
          {filteredClasses.map((cls) => (
            <MenuItem key={cls.class_id} value={cls.class_name}>
              {cls.class_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Submit Button */}
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!subject || !className}
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
    </Box>
  );
};

export default TeacherSubject;
