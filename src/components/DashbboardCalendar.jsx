import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3} sx={{ backgroundColor: "#81b8f5", borderRadius: "8px", ml:5, mr:2 , boxShadow:3, mt:4, mb:4}}>
        <Typography variant="h4" fontWeight="bold" mb={2} pb={2} sx={{borderBottom: 1, borderColor: "divider"}}>
          Calendar
        </Typography>
        <DateCalendar
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          sx={{backgroundColor: "white", borderRadius: "8px", width: "65%", boxShadow: 3}}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default Calendar;