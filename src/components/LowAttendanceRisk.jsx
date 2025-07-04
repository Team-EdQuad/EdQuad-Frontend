import React, { useEffect, useState } from "react";
import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { getLowAttendanceRiskStudents } from "../services/teacherDService"; 

const LowAttendanceRisk = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLowAttendanceRiskStudents();
        setStudents(data || []);
      } catch (error) {
        console.error("Error fetching low attendance students", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Paper elevation={3} sx={{ mt: 4, p: 3, ml: 5, mr: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, pb: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Low Attendance Risk
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={100}>
          <CircularProgress />
        </Box>
      ) : students.length === 0 ? (
        <Typography>No students with low attendance.</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Student ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Class</strong></TableCell>
                <TableCell><strong>Attendance %</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.student_id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.class_name}</TableCell>
                  <TableCell>{student.attendance_rate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default LowAttendanceRisk;
