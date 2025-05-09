import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getSubjectProgress } from '../services/studentDService';

ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: (chart) => {
    const { width } = chart;
    const { ctx } = chart;
    const value = chart.config.options.plugins.centerText?.value;

    if (value !== undefined) {
      ctx.save();
      const fontSize = (width / 12).toFixed(0);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textBaseline = 'middle';
      // ctx.fillStyle = '#333';

      const textX = Math.round((chart.width - ctx.measureText(`${value}%`).width) / 2);
      const textY = chart.height / 2;

      ctx.fillText(`${value}%`, textX, textY);
      ctx.restore();
    }
  },
};

ChartJS.register(centerTextPlugin);

const SubjectProgress = ({ studentId, classId }) => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSubjectProgress(studentId, classId);
        setSubjects(data);
      } catch (error) {
        console.error('Failed to fetch subject progress', error);
      }
    };
    fetchData();
  }, [studentId, classId]);

  const renderChart = (label, value, index) => {
    const data = {
      datasets: [
        {
          data: [value, 100 - value],
          backgroundColor: ['#8346e5', '#e5e7eb'],
          borderWidth: 0,
        },
      ],
      labels: [label],
    };

    const options = {
      cutout: '70%',
      responsive: true,
      // maintainAspectRatio: false,
      aspectRatio: 1.8,
      plugins: {
        legend: { display: false },
        centerText: { value }
      },
    };

    return (
      <Grid item xs={12} sm={4} md={4} lg={3} key={index} sx={{ py:0.8 }}>
        <Paper elevation={0} sx={{ p: 0, textAlign: 'center',display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width:'100%'}}>
            <Doughnut data={data} options={options} />
          </Box>
          <Typography variant="body1" mt={0} fontWeight="bold " pb={0}>
            {label}
          </Typography>
        </Paper>
      </Grid>
    );
  };

  return (
    <Box sx={{ bgcolor: 'white', p: 0, borderRadius: 2, boxShadow: 3, mr: 2, ml: 5, mt:2 }}>
      <Box sx={{ p: 0, bm :1, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Typography variant="h4" mb={2} fontWeight="bold" sx={{ pt: 3, pl: 3 }} >
        Subject Progress
      </Typography>
      </Box>
      <Grid container spacing={0} justifyContent="space-evenly" sx={{ p: 0 }}>
        {subjects.map((s, index) =>
          renderChart(s.subject_name, s.progress_percentage, index)
        )}
      </Grid>
    </Box>
  );
};

export default SubjectProgress;
