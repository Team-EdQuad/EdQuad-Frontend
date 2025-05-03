import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getStudentExamMarks } from "../services/studentService"; // ✅ Import service
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Paper, Box, Typography, CircularProgress } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentExamMarksChart = ({ studentId, classId, examYear }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getStudentExamMarks(studentId, classId, examYear);

        const subjects = [...new Set(data.map((d) => d.subject_name))];
        const terms = [...new Set(data.map((d) => d.term))];

        const datasets = terms.map((term, idx) => ({
          label: `Term ${term}`,
          data: subjects.map((subject) => {
            const match = data.find((d) => d.subject_name === subject && d.term === term);
            return match ? match.marks : 0;
          }),
          backgroundColor: ["#428df5", "#12db4b", "#b042f5"][idx % 3],
        }));

        setChartData({
          labels: subjects,
          datasets,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error loading student exam marks:", error);
      }
    };

    loadData();
  }, [studentId, classId, examYear]);

  return (
    <Paper elevation={3} sx={{ mt: 4, p: 3, ml:5, mr:2 }}>
      <Box sx={{borderBottom: 1, borderColor: "divider", mb:2, pb: 1}}>
      <Typography variant="h4" gutterBottom fontWeight="bold" >
        Student Exam Marks by Term - {examYear}
      </Typography>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  boxWidth: 20,
                  padding: 15,
                },
              },
              title: {
                display: true,
                text: "Grouped Bar Chart of Exam Marks",
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
                  maxRotation: 90,
                  minRotation: 45,
                },
              },
            },
          }}
          
        />
      )}
    </Paper>
  );
};

export default StudentExamMarksChart;
