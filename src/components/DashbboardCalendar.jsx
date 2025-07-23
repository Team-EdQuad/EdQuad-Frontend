// import React, { useState } from "react";
// import { Box, Typography } from "@mui/material";
// import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// const Calendar = () => {
//   const [selectedDate, setSelectedDate] = useState(null);

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box p={3} sx={{ backgroundColor: "#81b8f5", borderRadius: "8px", ml:5, mr:2 , boxShadow:3, mt:4, mb:4}}>
//         <Typography variant="h4" fontWeight="bold" mb={2} pb={2} sx={{borderBottom: 1, borderColor: "divider"}}>
//           Calendar
//         </Typography>
//         <DateCalendar
//           value={selectedDate}
//           onChange={(newValue) => setSelectedDate(newValue)}
//           sx={{backgroundColor: "white", borderRadius: "8px", width: "65%", boxShadow: 3}}
//         />
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default Calendar;

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          borderRadius: 3,
          mt: 4,
          mx: 5,
          pb: 2,
          background: "rgba(255, 255, 255, 0.5)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
          mb: 2,
        }}
      >
        {/* Gradient Header */}
        <Box
          sx={{
            p: 3,
            background: "linear-gradient(90deg, #2196f3 0%, #1976d2 100%)",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="white">
            Calendar
          </Typography>
        </Box>

        {/* Calendar Body */}
        <Box sx={{ p: 4, pb:2 , display: "flex", justifyContent: "center" }}>
          <DateCalendar
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            sx={{
              backgroundColor: "rgba(38, 106, 174, 0.82)",
              borderRadius: "12px",
              // width: "fit-content",
              boxShadow: 3,
              p: 2,
              width: "65%",
            }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Calendar;
