import React from "react";
import { Box, Typography } from "@mui/material";

const AttendanceOverview = () => {
  return (
    <Box p={3} sx={{ backgroundColor: "#fff", borderRadius: "8px" }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Attendance Overview
      </Typography>
      {/* Add charts and gauges here */}
      <Typography>Attendance charts and gauges go here.</Typography>
    </Box>
  );
};

export default AttendanceOverview;