import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';

const AddExamMarks = () => {
  const theme = useTheme();
  // const teacher_id = 'TCH001'; // Matches provided API response
  const { id: teacher_id } = useContext(StoreContext);

  // State variables
  const [subjectsClasses, setSubjectsClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState('');
  const [gradeClass, setGradeClass] = useState('');
  const [studentId, setStudentId] = useState('');
  const [examYear, setExamYear] = useState('');
  const [term, setTerm] = useState('');
  const [marks, setMarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // Fetch subjects and classes
  useEffect(() => {
    const fetchSubjectsClasses = async () => {
      setIsLoadingSubjects(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/subjectNclass/${teacher_id}`);
        setSubjectsClasses(response.data.subjects_classes); // [{ subject_id, subject_name, classes: [{ class_id, class_name }] }]
        setSubjects(response.data.subjects_classes); // Use directly since subject_id and subject_name are included
      } catch (err) {
        console.error('Error fetching subjects and classes:', err.response?.data || err.message);
        alert('Failed to load subjects');
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    fetchSubjectsClasses();
  }, []);

  // Update classes based on selected subject
  useEffect(() => {
    if (subject && subjectsClasses.length > 0) {
      setIsLoadingClasses(true);
      const selectedSubject = subjectsClasses.find(sc => sc.subject_name === subject);
      if (selectedSubject) {
        setClasses(selectedSubject.classes); // [{ class_id, class_name }]
      } else {
        setClasses([]);
      }
      setIsLoadingClasses(false);
    } else {
      setClasses([]);
    }
    setGradeClass('');
    setStudentId('');
  }, [subject, subjectsClasses]);

  // Fetch students based on selected class and subject
  useEffect(() => {
    if (gradeClass && subject && subjectsClasses.length > 0) {
      setIsLoadingStudents(true);
      const selectedSubject = subjectsClasses.find(sc => sc.subject_name === subject);
      if (selectedSubject) {
        const selectedClass = classes.find(cls => cls.class_name === gradeClass);
        if (selectedClass) {
          const fetchStudents = async () => {
            try {
              const response = await axios.get(
                `http://127.0.0.1:8000/api/studentlist/${selectedClass.class_id}/${selectedSubject.subject_id}`
              );
              setStudents(response.data.students); // [{ student_id, full_name }]
            } catch (err) {
              console.error('Error fetching students:', err.response?.data || err.message);
              setStudents([]);
              alert('Failed to load students');
            } finally {
              setIsLoadingStudents(false);
            }
          };
          fetchStudents();
        } else {
          setStudents([]);
          setIsLoadingStudents(false);
        }
      } else {
        setStudents([]);
        setIsLoadingStudents(false);
      }
    } else {
      setStudents([]);
      setIsLoadingStudents(false);
    }
    setStudentId('');
  }, [gradeClass, subject, subjectsClasses, classes]);

  const handleSubmit = () => {
    // Validation
    if (!subject || !gradeClass || !studentId || !examYear || !term || !marks) {
      alert('Please fill in all fields');
      return;
    }

    const examYearValue = parseInt(examYear, 10);
    if (isNaN(examYearValue) || examYearValue < 1900 || examYearValue > 9999) {
      alert('Please enter a valid exam year (e.g., 2023)');
      return;
    }

    const marksValue = parseFloat(marks);
    if (isNaN(marksValue) || marksValue < 0 || marksValue > 100) {
      alert('Please enter a valid number for marks between 0 and 100');
      return;
    }

    setIsSubmitting(true);
    const formData = new URLSearchParams();
    formData.append('teacher_id', teacher_id);
    formData.append('student_id', studentId);
    formData.append('exam_year', examYearValue);
    formData.append('subject_name', subject);
    formData.append('term', term);
    formData.append('marks', marksValue);

    axios
      .post(
        'http://127.0.0.1:8000/api/update_exam_marks',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
          },
        }
      )
      .then(({ data }) => {
        console.log('Exam Marks Submitted:', data);
        alert(`Exam marks added successfully! Exam ID: ${data.exam_id}`);
        window.location.reload();
      })
      .catch((err) => {
        console.error('Error submitting exam marks:', err.response?.data || err.message);
        alert(`Failed to add exam marks: ${err.response?.data?.detail || err.message}`);
      })
      .finally(() => {
        setIsSubmitting(false);
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
        Add Exam Marks
      </Typography>

      {/* Subject Dropdown */}
      <FormControl fullWidth sx={{ mb: 3, maxWidth: '600px', backgroundColor: theme.palette.background.paper, borderRadius: '8px' }}>
        <InputLabel sx={{ color: theme.palette.text.secondary }}>Select Subject</InputLabel>
        <Select
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            setGradeClass('');
            setStudentId('');
          }}
          sx={{ color: theme.palette.text.primary }}
          disabled={isLoadingSubjects}
        >
          <MenuItem value="">
            <em>{isLoadingSubjects ? 'Loading...' : 'Select Subject'}</em>
          </MenuItem>
          {subjects.map((sub) => (
            <MenuItem key={sub.subject_id} value={sub.subject_name}>
              {sub.subject_name}
            </MenuItem>
          ))}
        </Select>
        {isLoadingSubjects && <CircularProgress size={24} sx={{ position: 'absolute', right: '20px', top: '15px' }} />}
      </FormControl>

      {/* Grade and Class Dropdown */}
      <FormControl fullWidth sx={{ mb: 3, maxWidth: '600px', backgroundColor: theme.palette.background.paper, borderRadius: '8px' }}>
        <InputLabel sx={{ color: theme.palette.text.secondary }}>Select Grade and Class</InputLabel>
        <Select
          value={gradeClass}
          onChange={(e) => {
            setGradeClass(e.target.value);
            setStudentId('');
          }}
          sx={{ color: theme.palette.text.primary }}
          disabled={isLoadingClasses || !subject}
        >
          <MenuItem value="">
            <em>{isLoadingClasses ? 'Loading...' : 'Select Grade and Class'}</em>
          </MenuItem>
          {classes.map((cls) => (
            <MenuItem key={cls.class_id} value={cls.class_name}>
              {cls.class_name}
            </MenuItem>
          ))}
        </Select>
        {isLoadingClasses && <CircularProgress size={24} sx={{ position: 'absolute', right: '20px', top: '15px' }} />}
      </FormControl>

      {/* Student ID Dropdown */}
      <FormControl fullWidth sx={{ mb: 3, maxWidth: '600px', backgroundColor: theme.palette.background.paper, borderRadius: '8px' }}>
        <InputLabel sx={{ color: theme.palette.text.secondary }}>Select Student</InputLabel>
        <Select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          sx={{ color: theme.palette.text.primary }}
          disabled={isLoadingStudents || !gradeClass}
        >
          <MenuItem value="">
            <em>{isLoadingStudents ? 'Loading...' : 'Select Student'}</em>
          </MenuItem>
          {students.map((stu) => (
            <MenuItem key={stu.student_id} value={stu.student_id}>
              {stu.student_id} - {stu.full_name}
            </MenuItem>
          ))}
        </Select>
        {isLoadingStudents && <CircularProgress size={24} sx={{ position: 'absolute', right: '20px', top: '15px' }} />}
      </FormControl>

      {/* Exam Year */}
      <TextField
        label="Exam Year"
        variant="outlined"
        type="number"
        fullWidth
        sx={{ mb: 3, maxWidth: '600px' }}
        value={examYear}
        onChange={(e) => setExamYear(e.target.value)}
        inputProps={{ step: 1 }}
      />

      {/* Term Dropdown */}
      <FormControl fullWidth sx={{ mb: 3, maxWidth: '600px', backgroundColor: theme.palette.background.paper, borderRadius: '8px' }}>
        <InputLabel sx={{ color: theme.palette.text.secondary }}>Select Term</InputLabel>
        <Select
          value={term}
          onChange={(e) => setTerm(Number(e.target.value))}
          sx={{ color: theme.palette.text.primary }}
        >
          <MenuItem value="">
            <em>Select Term</em>
          </MenuItem>
          {[1, 2, 3].map((t) => (
            <MenuItem key={t} value={t}>
              Term {t}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Marks */}
      <TextField
        label="Marks"
        variant="outlined"
        type="number"
        fullWidth
        sx={{ mb: 3, maxWidth: '600px' }}
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
        inputProps={{ step: 0.1 }}
      />

      {/* Submit Button */}
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={isSubmitting}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': { backgroundColor: theme.palette.primary.dark },
        }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </Box>
  );
};

export default AddExamMarks;