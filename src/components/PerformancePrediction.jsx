import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

const PerformancePrediction = () => {
    return (
        <Paper elevation={3} sx={{ mt: 4, p: 3, ml:5, mr:2 }}>
          <Box sx={{borderBottom: 1, borderColor: "divider", mb:2, pb: 1}}>
          <Typography variant="h4" gutterBottom fontWeight="bold" >
            Performance Prediction
          </Typography>
          </Box>
        </Paper>
      );
};

export default PerformancePrediction;