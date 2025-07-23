import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { getLowAttendanceRiskStudentsCount } from "../services/teacherDService";

const AttendanceAlertBox = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await getLowAttendanceRiskStudentsCount();
        setCount(response.low_attendance_student_count);
      } catch (error) {
        console.error("Failed to fetch attendance risk count", error);
      }
    };

    fetchCount();
  }, []);

  return (
    <Box
      sx={{
        border: "1.5px solid #d32f2f",
        borderRadius: 2,
        p: 4,
        textAlign: "center",
        backgroundColor: "#fff5f5",
        width: "28%",
        boxShadow: "0 2px 6px rgba(211, 47, 47, 0.2)",
        mr: 2,
        ml: 2,
        mt: 8,
        userSelect: "none",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
        <WarningAmberIcon sx={{ color: "#d32f2f", mr: 1, fontSize: 30 }} />
        <Typography variant="h5" sx={{ color: "#d32f2f", fontWeight: "600" }}>
          Attendance Alert
        </Typography>
      </Box>

      <Typography
        variant="h2"
        sx={{ color: "#b71c1c", fontWeight: "700", my: 2, letterSpacing: "0.05em" }}
      >
        {count}
      </Typography>

      <Typography variant="body1" sx={{ fontWeight: "600", mb: 3, color: "#880e0e" }}>
        Students with Low Attendance Risk
      </Typography>

      <Button
        variant="contained"
        color="error"
        onClick={() => (window.location.href = "/dashboard#attendance-risk")}
        sx={{ textTransform: "none", fontWeight: "600", px: 4 }}
      >
        View Risk Details
      </Button>
    </Box>
  );
};

export default AttendanceAlertBox;
