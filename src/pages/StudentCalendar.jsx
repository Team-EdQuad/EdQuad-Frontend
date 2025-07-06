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
const Url = import.meta.env.VITE_BACKEND_URL;


const taskData = [
  { name: "Total Task Completed", value: 92, color: "#00C9FF" },
  { name: "Tasks Ontime", value: 75, color: "#FF69B4" },
  { name: "Task Late", value: 68, color: "#FFA500" },
];

const events = ["Event 1", "Event 2", "Sport event", "Sport event"];


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
        const url = `${Url}/api/calendar/assignments/deadlines?${fetchParam}=${fetchId}`;
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
      </Box>
    </Box>
  );
};

export default StudentCalendar;