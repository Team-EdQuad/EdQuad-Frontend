import React, { useEffect, useState } from "react";
import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { getAllClasses, getWeeklyAttendance } from "../services/teacherDService";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Get current date information
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentWeek = getWeekNumber(currentDate);

// Helper function to get week number
function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

// Helper function to get week range (for display purposes)
function getWeekDateRange(year, weekNum) {
  const simple = new Date(year, 0, 1 + (weekNum - 1) * 7);
  const dow = simple.getDay();
  const startDate = new Date(simple);
  if (dow <= 4) {
    startDate.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    startDate.setDate(simple.getDate() + 8 - simple.getDay());
  }
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  return {
    start: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    end: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  };
}

const ClassAttendanceAnalysis = () => {
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedWeek, setSelectedWeek] = useState(currentWeek - 1); // Default to last week
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");

  // Generate weeks for dropdown (1-52)
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await getAllClasses();
        setClassOptions(res.classes);

        // Set default class to "6-A"
        const defaultClass = res.classes.find(cls => cls.class_name === "6-A");
        if (defaultClass) {
          setSelectedClass(defaultClass.class_id);
          setClassName(defaultClass.class_name);
        }
      } catch (error) {
        console.error("Error loading class list:", error);
      }
    };
    loadClasses();
  }, []);

  useEffect(() => {
    const loadAttendanceData = async () => {
      if (!selectedClass) return;
      
      setLoading(true);
      try {
        const data = await getWeeklyAttendance(selectedClass, selectedYear, selectedWeek);
        
        // Sort data by weekday order
        const weekdayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        data.sort((a, b) => weekdayOrder.indexOf(a.weekday) - weekdayOrder.indexOf(b.weekday));
        
        setAttendanceData(data);
        
        // Update class name for display
        const classInfo = classOptions.find(c => c.class_id === selectedClass);
        if (classInfo) {
          setClassName(classInfo.class_name);
        }
      } catch (error) {
        console.error("Error loading attendance data:", error);
      }
      setLoading(false);
    };

    loadAttendanceData();
  }, [selectedClass, selectedYear, selectedWeek, classOptions]);

  // Prepare chart data
  const chartData = attendanceData ? {
    labels: attendanceData.map(item => item.weekday),
    datasets: [
      {
        label: 'Present',
        data: attendanceData.map(item => item.Present),
        backgroundColor: 'green', // Green color
        stack: 'Stack 0',
      },
      {
        label: 'Absent',
        data: attendanceData.map(item => item.Absent),
        backgroundColor: 'red', // Red color
        stack: 'Stack 0',
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Attendance Rate (%)',
          font: {
            size: 14
          }
        },
        max: attendanceData ? Math.max(...attendanceData.map(item => item.Present + item.Absent)) * 1.1 : 100
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            const total = attendanceData[context.dataIndex].Present + attendanceData[context.dataIndex].Absent;
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Get week date range for display
  const weekRange = selectedYear && selectedWeek ? 
    getWeekDateRange(parseInt(selectedYear), parseInt(selectedWeek)) : 
    { start: '', end: '' };

  return (
    <Paper elevation={3} sx={{ mt: 4, p: 3, ml: 5, mr: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, pb: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Class Attendance Analysis
        </Typography>
      </Box>
      
      <Box sx={{ display: "flex", justifyContent: "right", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 6 }}>
          <FormControl size="small">
            <InputLabel>Year</InputLabel>
            <Select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)} 
              label="Year"
            >
              {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small">
            <InputLabel>Week</InputLabel>
            <Select 
              value={selectedWeek} 
              onChange={(e) => setSelectedWeek(e.target.value)} 
              label="Week"
            >
              {weeks.map((week) => (
                <MenuItem key={week} value={week}>
                  {`Week ${week}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small">
            <InputLabel>Class</InputLabel>
            <Select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)} 
              label="Class"
            >
              {classOptions.map((cls) => (
                <MenuItem key={cls.class_id} value={cls.class_id}>{cls.class_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" fontWeight={500}>
              {`Class ${className} Year ${selectedYear}`}
            </Typography>
            <Typography variant="subtitle1">
              {`Week ${selectedWeek} (${weekRange.start} - ${weekRange.end})`}
            </Typography>
          </Box>
          
          <Box sx={{ height: 350, mx: 5 }}>
            {chartData && (
              <Bar data={chartData} options={chartOptions} />
            )}
          </Box>
          
          {/* <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mx: 2 }}>
              <Box sx={{ width: 16, height: 16, backgroundColor: "#12db4b", mr: 1 }}></Box>
              <Typography>Present</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mx: 2 }}>
              <Box sx={{ width: 16, height: 16, backgroundColor: "#ff6b6b", mr: 1 }}></Box>
              <Typography>Absent</Typography>
            </Box>
          </Box> */}
        </>
      )}
    </Paper>
  );
};

export default ClassAttendanceAnalysis;