import React, { useEffect, useState } from "react";
import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from "@mui/material";
import { getAllClasses, getStudentProgress } from "../services/teacherDService"; 

const currentYear = new Date().getFullYear();

const StudentProgressMonitoring = () => {
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(""); // Will be set to default class
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [studentProgress, setStudentProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await getAllClasses(); // returns { classes: [{ class_id, class_name }, ...] }
        setClassOptions(res.classes);

        // Set default class to "10-A"
        const defaultClass = res.classes.find(cls => cls.class_name === "6-A");
        if (defaultClass) {
          setSelectedClass(defaultClass.class_id);
          setClassName(defaultClass.class_name);
        }
      } catch (error) {
        console.error("Error loading class list:", error);
      }
    };
    loadClasses();
  }, []);

  useEffect(() => {
    const loadStudentProgress = async () => {
      if (!selectedClass) return;
      
      setLoading(true);
      try {
        const data = await getStudentProgress(selectedClass, selectedYear);
        setStudentProgress(data);
        
        // Update class name for display
        const classInfo = classOptions.find(c => c.class_id === selectedClass);
        if (classInfo) {
          setClassName(classInfo.class_name);
        }
      } catch (error) {
        console.error("Error loading student progress:", error);
      }
      setLoading(false);
    };

    loadStudentProgress();
  }, [selectedClass, selectedYear, classOptions]);

  // Function to format percentage values
  const formatPercentage = (value) => {
    return `${value}%`;
  };

  return (
    <Paper elevation={3} sx={{ mt: 4, p: 3, ml: 5, mr: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, pb: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Student Progress Monitoring
        </Typography>
      </Box>
      
      <Box sx={{ display: "flex", justifyContent: "right", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 6 }}>
          <FormControl size="small">
            <InputLabel>Year</InputLabel>
            <Select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)} 
              label="Year"
            >
              {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((year) => (
                <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small">
            <InputLabel>Class</InputLabel>
            <Select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)} 
              label="Class"
            >
              {classOptions.map((cls) => (
                <MenuItem key={cls.class_id} value={cls.class_id}>{cls.class_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" align="center" gutterBottom fontWeight={500}>
            {`Class ${className} Year ${selectedYear}`}
          </Typography>
          
          <TableContainer sx={{ maxHeight: 440, px:4, overflowY:'auto' }}>
            <Table stickyHeader aria-label="student progress table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Student Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>1st Term Average</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>2nd Term Average</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>3rd Term Average</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Academic Attendance</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Non-Academic Attendance</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Average Subject Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentProgress.map((student, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Avatar 
                            sx={{ 
                            bgcolor: ["#FFB74D", "#4FC3F7", "#AED581"][index % 3],
                            mr: 2 
                          }}
                        >
                          {student.student_name.charAt(0)}
                        </Avatar>
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{student.student_name}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{formatPercentage(student.first_term_avg)}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{formatPercentage(student.second_term_avg)}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{formatPercentage(student.third_term_avg)}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{formatPercentage(student.academic_attendance_rate)}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>
                      {student.non_academic_attendance_rate ? formatPercentage(student.non_academic_attendance_rate) : "-"}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{formatPercentage(student.avg_academic_progress)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Paper>
  );
};

export default StudentProgressMonitoring;