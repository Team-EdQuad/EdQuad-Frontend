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
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { getMonthlyAttendanceRate } from "../services/studentDService";
import { getWeeklyAttendanceRate } from "../services/studentDService";
import { getAttendanceRate } from "../services/studentDService";
import { getNonacademicAttendance } from "../services/studentDService";
import { getEngagementScore } from "../services/studentDService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const shortMonths = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"  
];

const weekdays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
];
const shortWeekdays = [
  "Mon", "Tue", "Wed", "Thu", "Fri" 
];

const AttendanceOverview = ({ studentId, classId }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [weeklyAttendanceData, setWeeklyAttendanceData] = useState(null);
  const [attendanceRate, setAttendanceRate] = useState(null);
  const [engagementScore, setEngagementScore] = useState(null);
  const [nonAcademicData, setNonAcademicData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await getMonthlyAttendanceRate(studentId, classId);
        const weeklyData = await getWeeklyAttendanceRate(studentId, classId);
        const attendanceRatedata = await getAttendanceRate(studentId, classId);
        const engagementScoreData = await getEngagementScore('STU001', 'CLS001');

        const dataMap = new Map(data.map(item => [item.month, item.attendance_rate]));
        const weeklyDataMap = new Map(weeklyData.map(item => [item.weekday, item.attendance_rate]));
      

        const attendanceRates = months.map(month => dataMap.get(month) || 0);
        const weeklyAttendanceRates = weekdays.map(weekday => weeklyDataMap.get(weekday) || 0);     
        
        const nonAcademicResponse = await getNonacademicAttendance(studentId, classId);
        const labels = nonAcademicResponse.activities_attendance.map(item => item.name);
        const presentData = nonAcademicResponse.activities_attendance.map(item => item.present);
        const absentData = nonAcademicResponse.activities_attendance.map(item => item.absent);

        setAttendanceData({
          labels: shortMonths,
          datasets: [
            {
              label: "Attendance Rate (%)",
              data: attendanceRates,
              backgroundColor: "darkviolet",
              
            },
          ],
        });

        setWeeklyAttendanceData({
          labels: shortWeekdays,
          datasets: [
            {
              label: "Attendance Rate (%)",
              data: weeklyAttendanceRates,
              backgroundColor: "#FF7176",
              
            },
          ],
        });

        setAttendanceRate(attendanceRatedata.attendance_rate);
        setEngagementScore(engagementScoreData.engagement_score);

        setNonAcademicData({
          labels,
          datasets: [
            {
              label: "Present",
              data: presentData,
              backgroundColor: "#4caf50",
            },
            {
              label: "Absent",
              data: absentData,
              backgroundColor: "#f44336",
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, [studentId, classId]);

  // Data for the Doughnut chart
  const chartData = {
    datasets: [
      {
        
        data: [attendanceRate, 100 - attendanceRate], 
        backgroundColor: ["#4caf50", "#e0e0e0"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const chartData2 = {
    datasets: [
      {
        
        data: [engagementScore, 100 - engagementScore], 
        backgroundColor: ["#1976d2", "#e0e0e0"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };
  

  // Options for the Doughnut chart
  const chartOptions = {
    aspectRatio: 3,
    rotation: -90, 
    circumference: 180, 
    plugins: {
      legend: { display: true, position: "right" }, 
      // centerText,
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
    cutout: "70%", 
  };

  const chartOptions2 = {
    aspectRatio: 3,
    // rotation: -90, 
    // circumference: 180, 
    plugins: {
      legend: { display: true, position: "right" }, 
      // centerText,
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
    cutout: "80%", 
  };

  // Custom plugin to display text in the center
  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
      const { width } = chart;
      const { ctx } = chart;
      const value = attendanceRate ? `${attendanceRate.toFixed(0)}%` : "0%";

      ctx.save();
      ctx.font = `${width / 13}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fontWeight = "bold";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      ctx.fillText(value, chart.width / 2, chart.height / 1.3); 
      ctx.restore();
    },
  };

  ChartJS.register(centerTextPlugin);

  const centerTextPlugin2 = {
    id: "centerText",
    beforeDraw: (chart) => {
      const { width } = chart;
      const { ctx } = chart;
      const value = engagementScore ? `${engagementScore.toFixed(0)}%` : "0%";

      ctx.save();
      ctx.font = `${width / 13}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fontWeight = "bold";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      ctx.fillText(value, chart.width / 2, chart.height / 2); 
      ctx.restore();
    },
  };

  ChartJS.register(centerTextPlugin2);

  return (
    <Paper elevation={3} sx={{ padding: 4, borderRadius: 4, mt: 4, ml: 5, mr: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, pb: 1 }}>
        <Typography variant="h4" fontWeight={600}>
          Attendance Overview
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Box display={"flex"} flexDirection="column" alignItems="left" justifyContent="center" width="47%">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight={500} mb={2} sx={{ pl: 4 }}>
              Attendance History
            </Typography>
              <Button variant="contained" sx={{ color: "white", backgroundColor: "#1976d2" ,borderRadius: 2 , "&:hover": { backgroundColor: "#115293" }}} onClick={() => window.location.href = "/attendance/analysis"}>
                View Attendance History
              </Button>
          </Box>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Bar
              data={attendanceData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      stepSize: 20,
                      callback: function (value) {
                        return value ;
                      },
                      
                    },
                    title: {
                      display: true,
                      // text: "Attendance Rate (%)",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },                    
                    ticks: {
                      autoSkip: false,
                      maxRotation: 45,
                      // minRotation: 45,

                    },
                  },
                },
              }}
            
            />
          )}
          </Box>
          <Box display={"flex"} flexDirection="column" alignItems="right" justifyContent="center" width="47%" >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" fontWeight={500} mb={2} sx={{ pl: 4 }}>
                Monthly Attendance
              </Typography>
            </Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Bar
                data={weeklyAttendanceData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        stepSize: 20,
                        callback: function (value) {
                          return value ;
                        },
                        
                      },
                      title: {
                        display: true,
                        // text: "Attendance Rate (%)",
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },                    
                      ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        // minRotation: 45,
                      },
        
                    },
                  },
                }}
              
              />
            )}
          </Box>
        </Grid>
        <Grid container spacing={3}>
          <Box display={"flex"} flexDirection="column" alignItems="left" justifyContent="center" width="47%" mt={5}>
            <Typography variant="h5" fontWeight={500} mb={2} sx={{ pl: 4 }}>
                Current Attendance Rate
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 250 ,width: "50%" }}>
                <Doughnut data={chartData} options={chartOptions}  plugins={[centerTextPlugin]}/>
              </Box>
            )}
            </Box>
            <Box display={"flex"} flexDirection="column" alignItems="right" justifyContent="center" width="47%" mt={7}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight={500} mb={2} sx={{ pl: 4 }}>
                  Content Engagement Rate
                </Typography>
              </Box>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 250 }}>
                  <Doughnut data={chartData2} options={chartOptions2} plugins={[centerTextPlugin2]}/>
                </Box>
          )}
          </Box>
        </Grid>
        <Grid container spacing={3}>
          <Box display={"flex"} flexDirection="column" alignItems="left" justifyContent="center" width="50%" mt={1}>
            <Typography variant="h5" fontWeight={500} mb={3} sx={{ pl: 4 }}>
                Extra Curricular Attendance
            </Typography>
            {loading || !nonAcademicData ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Bar
              sx={{ ml: 4 }}
                data={nonAcademicData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "right",
                      labels: {
                        boxWidth: 20,
                        padding: 20,
                        font: {
                          weight: "bold",
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        stepSize: 25,
                      },
                    },
                    x: {
                      grid: { display: false },
                    },
                  },
                }}
              />
            )}
          </Box>
        </Grid>
    </Paper>
  );
};

export default AttendanceOverview;
