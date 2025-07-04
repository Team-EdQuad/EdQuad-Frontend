// import React, { useState, useEffect, useContext } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Checkbox,
//   TextField,
//   Divider,
//   InputAdornment,
//   Grid,
//   Card,
//   CardContent,
// } from "@mui/material";
// import { ArrowBackIos } from "@mui/icons-material";
// import { PieChart, Pie, Cell } from "recharts";
// import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { StoreContext } from "../context/StoreContext"; // Assuming this correctly provides studentId and token

// // --- Dummy data and unused functions (keeping for context, but not affecting deadlines fetch) ---
// const taskData = [
//   { name: "Total Task Completed", value: 92, color: "#00C9FF" },
//   { name: "Tasks Ontime", value: 75, color: "#FF69B4" },
//   { name: "Task Late", value: 68, color: "#FFA500" },
// ];

// // Note: handleCheck, handleTextChange, handleCheckboxChange were defined outside or missing state.
// // They are for the 'To Do List' which is commented out for now due to API data structure.
// // If you uncomment the To Do list, you'll need to properly define these and associated state.
// /*
// const handleCheck = (day, index) => {
//     // This requires 'checkedTasks' state to be defined
//     // const updated = [...checkedTasks[day]];
//     // updated[index] = !updated[index];
//     // setCheckedTasks({ ...checkedTasks, [day]: updated });
// };
// // Similarly for handleTextChange and handleCheckboxChange if they were used
// */

// const events = ["Event 1", "Event 2", "Sport event", "Sport event"];
// // --- End of dummy data/unused functions ---


// const StudentCalendar = () => {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { id: studentId, token } = useContext(StoreContext); // Destructure studentId and token
//   const [assignments, setAssignments] = useState([]);

//   console.log("Student ID from Context:", studentId);
//   console.log("Token from Context:", token);

//   useEffect(() => {
//     // Only proceed if studentId and token are available
//     if (!studentId || !token) {
//       console.warn("Student ID or Token not available. Skipping deadline fetch.");
//       setLoading(false); // Set loading to false if no ID/token
//       return;
//     }

//     const fetchDeadlines = async () => {
//       setLoading(true); // Start loading before fetch
//       try {
//         // --- IMPORTANT: Change URL to your API Gateway endpoint ---
//         const API_GATEWAY_URL = "http://localhost:8000"; // Assuming API Gateway runs on 8000
//         const res = await fetch(
//           `${API_GATEWAY_URL}/api/calendar/assignments/deadlines?student_id=${studentId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`, // Pass the token for authentication
//             },
//           }
//         );

//         if (!res.ok) {
//           // Handle HTTP errors (e.g., 404, 500)
//           const errorData = await res.json();
//           throw new Error(errorData.detail || `HTTP error! Status: ${res.status}`);
//         }

//         const data = await res.json();
//         console.log("Fetched Deadlines:", data); // Log the fetched data for debugging
//         setAssignments(data || []); // API returns an array directly, not data.assignments
//       } catch (error) {
//         console.error("Error fetching deadlines:", error);
//         setAssignments([]); // Clear assignments on error
//       } finally {
//         setLoading(false); // End loading after fetch completes or errors
//       }
//     };

//     fetchDeadlines();
//   }, [studentId, token]); // Re-run effect if studentId or token changes

//   return (
//     <Box
//       sx={{
//         backgroundColor: "#EEF2FB",
//         p: 4,
//         minHeight: "100vh",
//         fontFamily: "sans-serif",
//       }}
//     >
//       <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
//         Calendar
//       </Typography>

//       <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={4}>
//         {/* Calendar and Tasks Summary */}
//         <Box flex={1} minWidth="300px">
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DateCalendar
//               value={selectedDate}
//               onChange={(newValue) => setSelectedDate(newValue)}
//               sx={{
//                 backgroundColor: "white",
//                 borderRadius: "8px",
//                 width: "65%",
//                 boxShadow: 3,
//               }}
//             />
//           </LocalizationProvider>

//           {/* Events and Complete Tasks */}
//           <Box display="flex" justifyContent="center" mt={4} gap={4}>
//             <Box sx={{ width: "100%" }}>
//               <Typography variant="h6" fontWeight="bold" mb={2}>
//                 Upcoming Assignment Deadlines
//               </Typography>

//               <Grid container spacing={2}>
//                 {loading ? (
//                   <Grid item xs={12}>
//                     <Typography>Loading assignments...</Typography>
//                   </Grid>
//                 ) : assignments.length === 0 ? (
//                   <Grid item xs={12}>
//                     <Typography>No assignments found for your registered subjects.</Typography>
//                   </Grid>
//                 ) : (
//                   assignments.map((item) => (
//                     <Grid item xs={12} sm={6} md={4} key={item.assignment_id}>
//                       <Card sx={{ backgroundColor: "#ffffff", boxShadow: 3 }}>
//                         <CardContent>
//                           <Typography variant="h6" gutterBottom>
//                             {item.assignment_name}
//                           </Typography>
//                           <Typography variant="body2">
//                             <strong>Subject:</strong> {item.subject_id}
//                           </Typography>
//                           {/* Removed item.class_id as it's not projected by your current API */}
//                           <Typography variant="body2" color="error">
//                             <strong>Deadline:</strong>{" "}
//                             {item.deadline
//                               ? new Date(item.deadline).toLocaleString()
//                               : "N/A"}
//                           </Typography>
//                         </CardContent>
//                       </Card>
//                     </Grid>
//                   ))
//                 )}
//               </Grid>
//             </Box>
//             <Box minWidth="550px">
//               <Paper elevation={2} sx={{ p: 2 }}>
//                 <Typography variant="subtitle1" fontWeight="bold" textAlign="center">
//                   Complete Tasks
//                 </Typography>
//                 <Divider sx={{ mb: 2 }} />
//                 {taskData.map((item, i) => (
//                   <Box
//                     key={i}
//                     display="flex"
//                     flexDirection="row"
//                     alignItems="center"
//                     mb={2}
//                     gap={10}
//                   >
//                     <PieChart width={40} height={40}>
//                       <Pie
//                         data={[{ value: item.value }, { value: 100 - item.value }]}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={10}
//                         outerRadius={20}
//                         startAngle={90}
//                         endAngle={-270}
//                         dataKey="value"
//                       >
//                         <Cell fill={item.color} />
//                         <Cell fill="#f0f0f0" />
//                       </Pie>
//                     </PieChart>
//                     <Box ml={1} mb={0.75}>
//                       <Typography fontWeight="bold">{item.value}%</Typography>
//                       <Typography variant="body2">{item.name}</Typography>
//                     </Box>
//                   </Box>
//                 ))}
//               </Paper>
//             </Box>
//           </Box>
//         </Box>

//         {/* --- To Do List (Commented out due to incompatible data structure from API) --- */}
//         {/* If you need this, you'll have to process 'assignments' into a
//             different structure or fetch its data from a separate source.
//             Also, handleCheck, handleTextChange, handleCheckboxChange need to be defined
//             and manage their own state. */}
//         {/*
//         <Box minWidth="300px">
//             <Typography variant="h6" fontWeight="bold" mb={2}>To Do -</Typography>
//             {Object.entries(assignments).map(([day, tasks]) => (
//                 <Box key={day} mb={3}>
//                     <Typography variant="subtitle2" fontWeight="bold" mb={1}>
//                         {day.charAt(0).toUpperCase() + day.slice(1)}
//                     </Typography>
//                     {tasks.map((task, idx) => (
//                         <Box key={`${day}-${idx}`} mb={1}>
//                             <TextField
//                                 size="small"
//                                 value={task}
//                                 // onChange={(e) => handleTextChange(day, idx, e.target.value)} // Requires handleTextChange
//                                 fullWidth
//                                 InputProps={{
//                                     startAdornment: (
//                                         <InputAdornment position="start">
//                                             <Checkbox
//                                                 // checked={task.checked} // Requires 'checked' property on task
//                                                 // onChange={() => handleCheckboxChange(day, idx)} // Requires handleCheckboxChange
//                                             />
//                                         </InputAdornment>
//                                     )
//                                 }}
//                             />
//                         </Box>
//                     ))}
//                 </Box>
//             ))}
//         </Box>
//         */}
//       </Box>
//     </Box>
//   );
// };

// export default StudentCalendar;


import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  TextField,
  Divider,
  InputAdornment,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { PieChart, Pie, Cell } from "recharts";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StoreContext } from "../context/StoreContext";

// --- Dummy data and unused functions ---
const taskData = [
  { name: "Total Task Completed", value: 92, color: "#00C9FF" },
  { name: "Tasks Ontime", value: 75, color: "#FF69B4" },
  { name: "Task Late", value: 68, color: "#FFA500" },
];

const events = ["Event 1", "Event 2", "Sport event", "Sport event"];
// --- End of dummy data/unused functions ---

const StudentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
//   const { id: studentId, token } = useContext(StoreContext);
  const { id: userId, token, role } = useContext(StoreContext); // Get generic userId and userType

  const [assignments, setAssignments] = useState([]);

  console.log("User ID from Context:", userId);
  console.log("User Type from Context:", role);
  console.log("Token from Context:", token);

  useEffect(() => {
    // Determine the ID parameter based on userType
    let fetchParam = "";
    let fetchId = "";
    if (role === "student" && userId) {
      fetchParam = "student_id";
      fetchId = userId;
    } else if (role === "teacher" && userId) {
      fetchParam = "teacher_id";
      fetchId = userId;
    } else {
      console.warn("User ID or User Type not available. Skipping deadline fetch.");
      setLoading(false);
      return;
    }

    const fetchDeadlines = async () => {
      setLoading(true);
      try {
        const API_GATEWAY_URL = "http://localhost:8000"; // Confirm your API Gateway port
        // Construct the URL dynamically based on user type
        const url = `${API_GATEWAY_URL}/api/calendar/assignments/deadlines?${fetchParam}=${fetchId}`;
        console.log(url)
        
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token for authentication
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || `HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched Deadlines:", data);
        setAssignments(data || []);
      } catch (error) {
        console.error("Error fetching deadlines:", error);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, [userId, token, role]); // Re-run effect if userId, token, or userType changes

  return (
    <Box
      sx={{
        backgroundColor: "#EEF2FB",
        p: 4,
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Calendar
      </Typography>

      <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={4}>
        <Box flex={1} minWidth="300px">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
                width: "65%",
                boxShadow: 3,
              }}
            />
          </LocalizationProvider>

          <Box display="flex" justifyContent="center" mt={4} gap={4}>
            <Box sx={{ width: "100%" }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Upcoming Assignment Deadlines
              </Typography>

              <Grid container spacing={2}>
                {loading ? (
                  <Grid item xs={12}>
                    <Typography>Loading assignments...</Typography>
                  </Grid>
                ) : assignments.length === 0 ? (
                  <Grid item xs={12}>
                    <Typography>No assignments found for your account.</Typography>
                  </Grid>
                ) : (
                  assignments.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.assignment_id}>
                      <Card sx={{ backgroundColor: "#ffffff", boxShadow: 3 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {item.assignment_name}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Subject:</strong> {item.subject_id}
                          </Typography>
                          {item.class_id && ( // Only display class if it's available
                            <Typography variant="body2">
                              <strong>Class:</strong> {item.class_id}
                            </Typography>
                          )}
                          {item.teacher_id && ( // Only display teacher if it's available
                            <Typography variant="body2">
                              <strong>Created by:</strong> {item.teacher_id}
                            </Typography>
                          )}
                          <Typography variant="body2" color="error">
                            <strong>Deadline:</strong>{" "}
                            {item.deadline
                              ? new Date(item.deadline).toLocaleString()
                              : "N/A"}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            </Box>
            <Box minWidth="550px">
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" textAlign="center">
                  Complete Tasks
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {taskData.map((item, i) => (
                  <Box
                    key={i}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    mb={2}
                    gap={10}
                  >
                    <PieChart width={40} height={40}>
                      <Pie
                        data={[{ value: item.value }, { value: 100 - item.value }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={10}
                        outerRadius={20}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                      >
                        <Cell fill={item.color} />
                        <Cell fill="#f0f0f0" />
                      </Pie>
                    </PieChart>
                    <Box ml={1} mb={0.75}>
                      <Typography fontWeight="bold">{item.value}%</Typography>
                      <Typography variant="body2">{item.name}</Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>
            </Box>
          </Box>
        </Box>

        {/* --- To Do List (Still commented out) --- */}
      </Box>
    </Box>
  );
};

export default StudentCalendar;