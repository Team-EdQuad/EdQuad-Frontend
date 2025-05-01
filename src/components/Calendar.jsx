import React from "react";
import { Box, Typography } from "@mui/material";

const Calendar = () => {
  return (
    <Box p={3} sx={{ backgroundColor: "#fff", borderRadius: "8px" }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Calendar
      </Typography>
      {/* Add calendar component here */}
      <Typography>Interactive calendar goes here.</Typography>
    </Box>
  );
};

export default Calendar;