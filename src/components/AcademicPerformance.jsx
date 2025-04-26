import React from "react";
import { Box, Typography } from "@mui/material";

const AcademicPerformance = () => {
  return (
    <Box p={3} sx={{ backgroundColor: "#fff", borderRadius: "8px" }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Academic Performance
      </Typography>
      {/* Add bar chart here */}
      <Typography>Bar chart for academic performance goes here.</Typography>
    </Box>
  );
};

export default AcademicPerformance;