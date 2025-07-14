import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getAllClasses, getClassExamMarks } from "../services/teacherDService"; 

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Paper, Box, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Height, Margin } from "@mui/icons-material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const currentYear = new Date().getFullYear();

const ClassPerformanceChart = () => {
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(""); // will set default class here
  const [selectedYear, setSelectedYear] = useState("2024"); // set default year to 2024

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await getAllClasses(); // returns { classes: [{ class_id, class_name }, ...] }
        setClassOptions(res.classes);

        // Set default class to "10-A"
        const defaultClass = res.classes.find(cls => cls.class_name === "6-A");
        if (defaultClass) setSelectedClass(defaultClass.class_id); // Set class_id for "10-A"
      } catch (error) {
        console.error("Error loading class list:", error);
      }
    };
    loadClasses();
  }, []);

  useEffect(() => {
    const loadPerformance = async () => {
      if (!selectedClass || !selectedYear) return;
      setLoading(true);
      try {
        const data = await getClassExamMarks(selectedClass, selectedYear);
        const subjects = [...new Set(data.map((d) => d.subject_name))];
        const terms = [1, 2, 3];

        const datasets = terms.map((term, idx) => ({
          label: `${term} Term`,
          data: subjects.map((subject) => {
            const subjectMarks = data.filter(
              (d) => d.subject_name === subject && d.term === term
            );
            const average = subjectMarks.length
              ? subjectMarks.reduce((sum, current) => sum + current.marks, 0) /
                subjectMarks.length
              : 0;
            return average;
          }),
          backgroundColor: ["#428df5", "#12db4b", "#b042f5"][idx % 3],
        }));

        setChartData({ labels: subjects, datasets });
      } catch (error) {
        console.error("Error loading performance chart:", error);
      }
      setLoading(false);
    };

    loadPerformance();
  }, [selectedClass, selectedYear]);

//   <Box sx={{borderBottom: 1, borderColor: "divider", mb:2, pb: 1}}>
//         <Typography variant="h4" gutterBottom fontWeight="bold" >
//           Student Exam Marks by Term - {examYear}
//         </Typography>
//         </Box>
  return (
    <Paper elevation={3} sx={{ mt: 4, p: 3, ml: 5, mr: 2 }}>
        <Box sx={{borderBottom: 1, borderColor: "divider", mb:2, pb: 1}}>
          <Typography variant="h4" gutterBottom fontWeight="bold" >
          Class Performance
          </Typography>
        </Box>
      <Box sx={{ display: "flex", justifyContent: "right", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 6 }}>
          <FormControl size="small">
            <InputLabel>Year</InputLabel>
            <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} label="Year">
              {[2022, 2023, 2024, 2025].map((year) => (
                <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Class</InputLabel>
            <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} label="Class">
              {classOptions.map((cls) => (
                <MenuItem key={cls.class_id} value={cls.class_id}>{cls.class_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      {loading || !chartData ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" align="center" gutterBottom fontWeight={500}>
            {`Class ${classOptions.find(c => c.class_id === selectedClass)?.class_name} Year ${selectedYear}`}
          </Typography>
          <Box  sx={{ height: 400, mx: 5}}>
          <Bar 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "right",
                  labels: {
                    boxWidth: 15,
                    padding: 15,
                  },
                },
                title: {
                  display: true,
                  text: "Class Average (%) by Subject",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
                x: {
                  ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 0,
                  },
                },
              },
              
            }}
          /></Box>
        </>
      )}
    </Paper>
  );
};

export default ClassPerformanceChart;
