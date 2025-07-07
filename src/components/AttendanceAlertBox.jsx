import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { getLowAttendanceRiskStudentsCount } from "../services/teacherDService"; // <-- Make sure this exists

const AttendanceAlertBox = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await getLowAttendanceRiskStudentsCount();
        setCount(response.low_attendance_student_count); // Adjusted to match actual backend response
      } catch (error) {
        console.error("Failed to fetch attendance risk count", error);
      }
    };

    fetchCount();
  }, []);

  return (
    <Box
      sx={{
        border: "2px solid red",
        borderRadius: "12px",
        padding: "40px",
        textAlign: "center",
        backgroundColor: "#fefefe",
        width: "28%",
        boxShadow: 3,
        mr: 2,
        ml: 2,
        mt: 8,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
        <WarningAmberIcon sx={{ color: "red", mr: 1 }} />
        <Typography variant="h4" sx={{ color: "red", fontWeight: "bold" }}>
          Attendance Alert
        </Typography>
      </Box>

      <Typography variant="h1" sx={{ color: "red", fontWeight: "bold", m: 2 }}>
        {count}
      </Typography>

      <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
        Students with Low Attendance Risk
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.href = "/attendance/analysis"}
      >
        View Risk Details
      </Button>
    </Box>
  );
};

export default AttendanceAlertBox;
