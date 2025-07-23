import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { getLowAttendanceRiskStudents } from "../services/teacherDService";

const LowAttendanceRisk = () => {
  console.log("Rendering LowAttendanceRisk..."); // 👈 This should appear no matter what

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const classes = [
    { class_id: "CLS001", class_name: "10-A" },
    { class_id: "CLS002", class_name: "10-B" },
    { class_id: "CLS003", class_name: "11-A" },
    { class_id: "CLS004", class_name: "11-B" },
    { class_id: "CLS005", class_name: "12-A" },
    { class_id: "CLS013", class_name: "13-A" },
  ];

  const getClassName = (class_id) => {
    const found = classes.find((cls) => cls.class_id === class_id);
    return found ? found.class_name : class_id;
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      console.log("Fetching low attendance risk students...");
      const studentsArray = await getLowAttendanceRiskStudents();
      console.log("Fetched studentsArray:", studentsArray, Array.isArray(studentsArray));

      setStudents(studentsArray || []);
    } catch (error) {
      console.error("Error fetching low attendance students", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

console.log("students in component:", students, Array.isArray(students));

  return (
    <Paper elevation={3} sx={{ mt: 4, p: 3, ml: 5, mr: 2, borderRadius: "12px" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, pb: 1 }}>
        <Typography variant="h4" fontWeight="bold">
          Low Attendance Risks
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={100}>
          <CircularProgress />
        </Box>
      ) : students.length === 0 ? (
        <Typography>No students with low attendance.</Typography>
      ) : (
        <Box>
          <Box display="flex" fontWeight="bold" px={1.5} mb={1}>
            <Box width="45%">Student Name</Box>
            <Box width="25%">Class</Box>
            <Box width="30%">Attendance</Box>
          </Box>

          {students.map((student, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                p: 1.5,
                mb: 1.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fafafa",
              }}
            >
              <Avatar sx={{ bgcolor: "#ffd600", color: "#1976d2", mr: 2 }}>
                <PersonIcon />
              </Avatar>

              <Box width="100%" display="flex" alignItems="center">
                <Box width="45%">
                  <Typography fontWeight="600">{student.full_name}</Typography>
                </Box>
                <Box width="25%">
                  <Typography>{getClassName(student.class_id)}</Typography>
                </Box>
                <Box width="30%">
                  <Typography fontWeight="bold">{student.attendance_rate}%</Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default LowAttendanceRisk;