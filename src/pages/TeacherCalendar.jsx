import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isYesterday from "dayjs/plugin/isYesterday";
import { StoreContext } from "../context/StoreContext";
const Url = import.meta.env.VITE_BACKEND_URL;

dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(isYesterday);

const tabLabels = ["Upcoming", "Today", "Tomorrow", "Yesterday"];
const labelMap = {
  Upcoming: "upcoming",
  Today: "today",
  Tomorrow: "tomorrow",
  Yesterday: "yesterday",
};

const TeacherCalendar = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(true);
  const { id: userId, token, role } = useContext(StoreContext);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState("Today");

  useEffect(() => {
    let fetchParam = "";
    let fetchId = "";

    if (role === "student" && userId) {
      fetchParam = "student_id";
      fetchId = userId;
    } else if (role === "teacher" && userId) {
      fetchParam = "teacher_id";
      fetchId = userId;
    } else {
      setLoading(false);
      return;
    }

    const fetchDeadlines = async () => {
      setLoading(true);
      try {
        const url = `${Url}/api/calendar/assignments/deadlines?${fetchParam}=${fetchId}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || `HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setAssignments(data || []);
      } catch (error) {
        console.error("Error fetching deadlines:", error);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, [userId, token, role]);

  const categorizedAssignments = {
    today: [],
    tomorrow: [],
    yesterday: [],
    upcoming: [],
  };

  assignments.forEach((assignment) => {
    const deadline = dayjs(assignment.deadline);
    if (deadline.isToday()) {
      categorizedAssignments.today.push(assignment);
    } else if (deadline.isTomorrow()) {
      categorizedAssignments.tomorrow.push(assignment);
    } else if (deadline.isYesterday()) {
      categorizedAssignments.yesterday.push(assignment);
    } else if (deadline.isAfter(dayjs(), "day")) {
      categorizedAssignments.upcoming.push(assignment);
    }
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const currentList = categorizedAssignments[labelMap[activeTab]] || [];

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        p: theme.spacing(4),
        minHeight: "100vh",
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center" mb={theme.spacing(4)} color="primary.main">
        Your Calendar
      </Typography>

      <Grid container spacing={theme.spacing(4)} direction='row' >
        {/* Calendar Section */}
        <Grid item xs={12} md={4} width="1080px">
          <Card sx={{ p: theme.spacing(2), boxShadow: theme.shadows[3], borderRadius: theme.shape.borderRadius }}>
            <Typography variant="h6" component="h2" fontWeight="bold" mb={theme.spacing(2)} color="text.primary">
              Select a Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                sx={{
                  width: "100%",
                  "& .MuiPickersDay-root.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              />
            </LocalizationProvider>
          </Card>
        </Grid>

        {/* Assignment Deadlines Section */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" component="h2" fontWeight="bold" mb={theme.spacing(2)} color="text.primary" width="1080px" >
            Assignment Deadlines
          </Typography>

          {/* Tabs for categorization */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: theme.shape.borderRadius,
              mb: theme.spacing(3),
              boxShadow: theme.shadows[2],
              "& .MuiTab-root": {
                fontWeight: "bold",
                textTransform: "capitalize",
              },
              "& .Mui-selected": {
                color: theme.palette.primary.main,
              },
            }}
          >
            {tabLabels.map((label) => (
              <Tab key={label} label={label} value={label} />
            ))}
          </Tabs>

          {/* Content Area for Assignments - Apply minHeight to ensure consistent space */}
          <Box
            sx={{
              minHeight: '280px', // Adjust this based on your average card height + some padding
              display: 'flex',
              flexDirection: 'column',
              // Center content only if no assignments or loading, otherwise align to start
              justifyContent: (currentList.length === 0 && !loading) || loading ? 'center' : 'flex-start',
              alignItems: (currentList.length === 0 && !loading) || loading ? 'center' : 'stretch', // Allow inner components to fill width
              p: theme.spacing(1), // Internal padding for the box
            }}
            width="1080px"
          >
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
                <Typography ml={2}>Loading assignments...</Typography>
              </Box>
            ) : assignments.length === 0 ? (
              <Card
                sx={{
                  p: theme.spacing(3),
                  boxShadow: theme.shadows[1],
                  borderRadius: theme.shape.borderRadius,
                  width: '100%',
                  minHeight: '200px', // Set a substantial minHeight for the "no content" card
                  display: 'flex',
                  alignItems: 'center', // Vertically center content
                  justifyContent: 'center', // Horizontally center content
                }}
              >
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  No assignments found for your account.
                </Typography>
              </Card>
            ) : currentList.length === 0 ? (
              <Card
                sx={{
                  p: theme.spacing(3),
                  boxShadow: theme.shadows[1],
                  borderRadius: theme.shape.borderRadius,
                  width: '100%',
                  minHeight: '200px', // Set a substantial minHeight for the "no content" card
                  display: 'flex',
                  alignItems: 'center', // Vertically center content
                  justifyContent: 'center', // Horizontally center content
                }}
              >
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  No {activeTab.toLowerCase()} assignments available.
                </Typography>
              </Card>
            ) : (
              <Grid container spacing={theme.spacing(2)}>
                {currentList.map((item) => (
                  <Grid item xs={12} sm={6} lg={4} key={item.assignment_id}>
                    <Card
                      sx={{
                        height: "100%", // Ensures all cards in a row have equal height if content allows
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: theme.shadows[4],
                        borderRadius: theme.shape.borderRadius,
                        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: theme.shadows[6],
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" component="h3" gutterBottom color="primary.dark">
                          {item.assignment_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Subject:</strong> {item.subject_id}
                        </Typography>
                        {item.class_id && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Class:</strong> {item.class_id}
                          </Typography>
                        )}
                        {item.teacher_id && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Created by:</strong> {item.teacher_id}
                          </Typography>
                        )}
                        <Typography variant="body1" color="error.main" fontWeight="medium" sx={{ mt: 2 }}>
                          <strong>Deadline:</strong>{" "}
                          {dayjs(item.deadline).format("DD MMM YYYY, h:mm A")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherCalendar;