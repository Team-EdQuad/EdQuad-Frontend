import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  useTheme,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { PieChart, Pie, Cell } from "recharts";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StoreContext } from "../context/StoreContext";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isYesterday from "dayjs/plugin/isYesterday";

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

const StudentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id: userId, token, role } = useContext(StoreContext);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState("Today");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const theme = useTheme();

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
    setPage(1);
  };

  const currentList = categorizedAssignments[labelMap[activeTab]] || [];
  const paginatedList = currentList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box sx={{ backgroundColor: "#EEF2FB", p: 4, minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Calendar
      </Typography>

      <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={4}>
        <Box flex={1} minWidth="300px">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              sx={{ backgroundColor: "white", borderRadius: "8px", width: "65%", boxShadow: 3 }}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      <Box flex={2} minWidth="600px" sx={{ mt: 8 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>Assignment Deadlines</Typography>

        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {tabLabels.map((label) => (
            <Tab key={label} label={label} value={label} />
          ))}
        </Tabs>

        <Box sx={{ minHeight: "300px", mt: 2 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : paginatedList.length === 0 ? (
            <Typography>No {activeTab.toLowerCase()} assignments available.</Typography>
          ) : (
            <Grid container spacing={2}>
              {paginatedList.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.assignment_id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{item.assignment_name}</Typography>
                      <Typography variant="body2">Subject: {item.subject_id}</Typography>
                      {item.class_id && <Typography variant="body2">Class: {item.class_id}</Typography>}
                      {item.teacher_id && <Typography variant="body2">Created by: {item.teacher_id}</Typography>}
                      <Typography variant="body2" color="error">
                        Deadline: {dayjs(item.deadline).format("DD MMM YYYY, h:mm A")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {currentList.length > itemsPerPage && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(currentList.length / itemsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StudentCalendar;
