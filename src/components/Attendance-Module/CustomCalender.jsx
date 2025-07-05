// import React, { useState } from 'react';
// import { Box, Paper, Typography } from '@mui/material';
// import CustomDropdown from './CustomDropdown';

// const Calendar = ({attendanceData}) => {
//   const [month, setMonth] = useState('April');

//   const handleMonthChange = (e) => {
//     setMonth(e.target.value);
//   };

//   const monthOptions = [
//     { label: 'January', value: 'January' },
//     { label: 'February', value: 'February' },
//     { label: 'March', value: 'March' },
//     { label: 'April', value: 'April' },
//     { label: 'May', value: 'May' },
//     { label: 'June', value: 'June' },
//     { label: 'July', value: 'July' },
//     { label: 'August', value: 'August' },
//     { label: 'September', value: 'September' },
//     { label: 'October', value: 'October' },
//     { label: 'November', value: 'November' },
//     { label: 'December', value: 'December' },
//   ];

//   const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

//   const year = 2025;

//   const totalDaysInMonth = new Date(year, monthOptions.findIndex(m => m.value === month) + 1, 0).getDate();
//   const firstDay = new Date(`${year}-${(monthOptions.findIndex(m => m.value === month) + 1).toString().padStart(2, '0')}-01`).getDay();
//   const firstDayAdjusted = (firstDay + 6) % 7; // to make Monday = 0, Sunday = 6

//   const items = [
//     ...Array(firstDayAdjusted).fill(null),
//     ...Array.from({ length: totalDaysInMonth }, (_, index) => index + 1),
//   ];

//   // Max 5 rows
//   const maxItems = 35;
//   if (items.length > maxItems) {
//     const overflowItems = items.splice(maxItems);
//     overflowItems.forEach((day) => {
//       const weekdayIndex = (firstDayAdjusted + day - 1) % 7;
//       for (let i = weekdayIndex; i < maxItems; i += 7) {
//         if (items[i] == null) {
//           items[i] = day;
//           break;
//         }
//       }
//     });
//   }

//   return (
//     <Paper elevation={0} sx={{ paddingX: '25px' }}>
//       <Box display="flex" justifyContent="right" alignItems="center" mb={2}>
//         {/* <Typography variant="h4" fontWeight="bold" color="#000">Academic</Typography> */}
//         <CustomDropdown
//           value={month}
//           onChange={handleMonthChange}
//           menuItems={monthOptions}
//         />
//       </Box>

//       {/* Weekdays */}
//       <Box display="grid" gridTemplateColumns="repeat(7, 59px)" gap="8px" mb={2}>
//         {weekdays.map((day) => (
//           <Box
//             key={day}
//             sx={{
//               width: '59px',
//               height: '20px',
//               textAlign: 'center',
//               fontWeight: 'bold',
//             }}
//           >
//             {day}
//           </Box>
//         ))}
//       </Box>

//       {/* Dates grid */}
//       <Box display="grid" gridTemplateColumns="repeat(7, 59px)" gridAutoRows="59px" gap="8px">
//         {items.map((item, index) => {
//           const monthNumber = (monthOptions.findIndex(m => m.value === month) + 1).toString().padStart(2, '0');
//           const dayNumber = item?.toString().padStart(2, '0');
//           const dateKey = item ? `${year}-${monthNumber}-${dayNumber}` : null;

//           return (
//             <Paper
//               key={index}
//               elevation={0}
//               sx={{
//                 position: 'relative',
//                 width: '59px',
//                 height: '59px',
//                 backgroundColor: item
//                   ? attendanceData[dateKey] === 'Absent'
//                     ? '#BB109D' // Absent color
//                     : (index % 7 === 5 || index % 7 === 6)
//                       ? '#65A6FA' // Sat/Sun color
//                       : '#49C3FB' // Weekday color
//                   : 'transparent',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontSize: '14px',
//                 fontWeight: 'bold',
//                 color: item
//                   ? attendanceData[dateKey] === 'Absent'
//                     ? '#FFFFFF' // White text for absent
//                     : '#000000' // Black text normally
//                   : 'transparent',
//               }}
//             >

//               {item && attendanceData[dateKey] !== undefined && (
//                 <Typography>{attendanceData[dateKey]}</Typography>
//               )}

//               {/* Small badge for date */}
//               {item && (
//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     top: 0,
//                     right: 0,
//                     width: '17px',
//                     height: '12px',
//                     backgroundColor: '#9B57CC',
//                     borderBottomLeftRadius: '2px',
//                     borderBottom: '2px solid #fff',
//                     borderLeft: '2px solid #fff',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     fontSize: '8px',
//                     color: '#fff',
//                     zIndex: 10,
//                   }}
//                 >
//                   {item}
//                 </Box>
//               )}
//             </Paper>
//           );
//         })}
//       </Box>
//     </Paper>
//   );
// };

// export default Calendar;





// import React from 'react';
// import { Box, Paper, Typography } from '@mui/material';

// const Calendar = ({ attendanceData, month }) => {
//   const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

//   const year = 2025;

//   const monthOptions = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const totalDaysInMonth = new Date(year, monthOptions.findIndex(m => m === month) + 1, 0).getDate();
//   const firstDay = new Date(`${year}-${(monthOptions.findIndex(m => m === month) + 1).toString().padStart(2, '0')}-01`).getDay();
//   const firstDayAdjusted = (firstDay + 6) % 7; 

//   const items = [
//     ...Array(firstDayAdjusted).fill(null),
//     ...Array.from({ length: totalDaysInMonth }, (_, index) => index + 1),
//   ];

//   // Max 5 rows
//   const maxItems = 35;
//   if (items.length > maxItems) {
//     const overflowItems = items.splice(maxItems);
//     overflowItems.forEach((day) => {
//       const weekdayIndex = (firstDayAdjusted + day - 1) % 7;
//       for (let i = weekdayIndex; i < maxItems; i += 7) {
//         if (items[i] == null) {
//           items[i] = day;
//           break;
//         }
//       }
//     });
//   }

//   return (
//     <Paper elevation={0} sx={{ paddingX: '25px' }}>
//       {/* Weekdays */}
//       <Box display="grid" gridTemplateColumns="repeat(7, 59px)" gap="8px" mb={2}>
//         {weekdays.map((day) => (
//           <Box
//             key={day}
//             sx={{
//               width: '59px',
//               height: '20px',
//               textAlign: 'center',
//               fontWeight: 'bold',
//             }}
//           >
//             {day}
//           </Box>
//         ))}
//       </Box>

//       {/* Dates grid */}
//       <Box display="grid" gridTemplateColumns="repeat(7, 59px)" gridAutoRows="59px" gap="8px">
//         {items.map((item, index) => {
//           const monthNumber = (monthOptions.findIndex(m => m === month) + 1).toString().padStart(2, '0');
//           const dayNumber = item?.toString().padStart(2, '0');
//           const dateKey = item ? `${year}-${monthNumber}-${dayNumber}` : null;

//           return (
//             <Paper
//               key={index}
//               elevation={0}
//               sx={{
//                 position: 'relative',
//                 width: '59px',
//                 height: '59px',
//                 backgroundColor: item
//                   ? attendanceData[dateKey] === 'absent'
//                     ? '#BB109D' // Absent
//                     : attendanceData[dateKey] === 'closed'
//                       ? '#F44336' // School closed day (non-weekend)
//                       : (index % 7 === 5 || index % 7 === 6)
//                         ? '#65A6FA' // Weekend
//                         : '#49C3FB' // Normal present day
//                   : 'transparent',

//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontSize: '14px',
//                 fontWeight: 'bold',
//                 color: item
//                   ? attendanceData[dateKey] === 'Absent'
//                     ? '#FFFFFF'
//                     : '#000000'
//                   : 'transparent',
//               }}
//             >
//               {item && attendanceData[dateKey] !== undefined && (
//                 <Typography>{attendanceData[dateKey]}</Typography>
//               )}

//               {/* Small badge for date */}
//               {item && (
//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     top: 0,
//                     right: 0,
//                     width: '17px',
//                     height: '12px',
//                     backgroundColor: '#9B57CC',
//                     borderBottomLeftRadius: '2px',
//                     borderBottom: '2px solid #fff',
//                     borderLeft: '2px solid #fff',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     fontSize: '8px',
//                     color: '#fff',
//                     zIndex: 10,
//                   }}
//                 >
//                   {item}
//                 </Box>
//               )}
//             </Paper>
//           );
//         })}
//       </Box>
//     </Paper>
//   );
// };

// export default Calendar;







import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const Calendar = ({ attendanceData, month }) => {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const year = 2025;

  const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const totalDaysInMonth = new Date(year, monthOptions.findIndex(m => m === month) + 1, 0).getDate();
  const firstDay = new Date(`${year}-${(monthOptions.findIndex(m => m === month) + 1).toString().padStart(2, '0')}-01`).getDay();
  const firstDayAdjusted = (firstDay + 6) % 7;

  const items = [
    ...Array(firstDayAdjusted).fill(null),
    ...Array.from({ length: totalDaysInMonth }, (_, index) => index + 1),
  ];

  // Limit to 5 rows
  const maxItems = 35;
  if (items.length > maxItems) {
    const overflowItems = items.splice(maxItems);
    overflowItems.forEach((day) => {
      const weekdayIndex = (firstDayAdjusted + day - 1) % 7;
      for (let i = weekdayIndex; i < maxItems; i += 7) {
        if (items[i] == null) {
          items[i] = day;
          break;
        }
      }
    });
  }

  // ✅ Calculate school closed (missing weekday) dates
  const closedDates = [];
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const date = new Date(year, monthOptions.findIndex(m => m === month), day);
    const weekday = date.getDay(); // 0 (Sun) to 6 (Sat)
    if (weekday === 0 || weekday === 6) continue; // Skip weekends

    const dateKey = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    if (!(dateKey in attendanceData)) {
      closedDates.push(dateKey);
    }
  }

  return (
    <Paper elevation={0} sx={{ paddingX: '25px' }}>
      {/* Weekdays Header */}
      <Box display="grid" gridTemplateColumns="repeat(7, 59px)" gap="8px" mb={2}>
        {weekdays.map((day) => (
          <Box
            key={day}
            sx={{
              width: '59px',
              height: '20px',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {day}
          </Box>
        ))}
      </Box>

      {/* Dates Grid */}
      <Box display="grid" gridTemplateColumns="repeat(7, 59px)" gridAutoRows="59px" gap="8px">
        {items.map((item, index) => {
          const monthNumber = (monthOptions.findIndex(m => m === month) + 1).toString().padStart(2, '0');
          const dayNumber = item?.toString().padStart(2, '0');
          const dateKey = item ? `${year}-${monthNumber}-${dayNumber}` : null;

          return (
            <Paper
              key={index}
              elevation={0}
              sx={{
                position: 'relative',
                width: '59px',
                height: '59px',
                backgroundColor: item
                  ? attendanceData[dateKey] === 'Absent'
                    ? '#BB109D' // Absent
                    : closedDates.includes(dateKey)
                      ? '#65A6FA' // School closed (red)
                      : (index % 7 === 5 || index % 7 === 6)
                        ? '#65A6FA' // Weekend
                        : '#49C3FB' // Present
                  : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                color: item
                  ? (attendanceData[dateKey] === 'Absent' || closedDates.includes(dateKey))
                    ? '#FFFFFF'
                    : '#000000'
                  : 'transparent',
              }}
            >
              {/* Status Text */}
              {item && attendanceData[dateKey] !== undefined && (
                <Typography>{attendanceData[dateKey]}</Typography>
              )}
              {item && closedDates.includes(dateKey) && (
                <Typography></Typography>
              )}

              {/* Date Badge */}
              {item && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '17px',
                    height: '12px',
                    backgroundColor: '#9B57CC',
                    borderBottomLeftRadius: '2px',
                    borderBottom: '2px solid #fff',
                    borderLeft: '2px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8px',
                    color: '#fff',
                    zIndex: 10,
                  }}
                >
                  {item}
                </Box>
              )}
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
};

export default Calendar;
