import React from "react";
import { Box, Typography } from "@mui/material";

const PerformancePrediction = () => {
  return (
    <Box p={3} sx={{ backgroundColor: "#fff", borderRadius: "8px" }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Performance Prediction
      </Typography>
      {/* Add risk level indicator here */}
      <Typography>Risk level indicator goes here.</Typography>
    </Box>
  );
};

export default PerformancePrediction;