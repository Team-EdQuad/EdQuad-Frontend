import React from "react";
import { Grid, Typography, Card, CardContent } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart) => {
    const { width } = chart;
    const { ctx } = chart;
    const value = chart.config.options.plugins.centerText?.value;
    if (value !== undefined) {
      ctx.restore();
      const fontSize = (width / 8).toFixed(0);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#333";

      const textX = Math.round((chart.width - ctx.measureText(value + "%").width) / 2);
      const textY = chart.height / 2;

      ctx.fillText(value + "%", textX, textY);
      ctx.save();
    }
  },
};

ChartJS.register(centerTextPlugin);

const subjects = [
  { name: "Sinhala", value: 55, color: "#ba68c8" },
  { name: "Mathematics", value: 35, color: "#7986cb" },
  { name: "Science", value: 45, color: "#e57373" },
  { name: "History", value: 35, color: "#4db6ac" },
  { name: "Geography", value: 65, color: "#81c784" },
  { name: "Civics", value: 45, color: "#ffb74d" },
  { name: "Religion", value: 55, color: "#9575cd" },
  { name: "Health", value: 85, color: "#f06292" },
];

const SubjectProgress = () => {
  return (
    <Card elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Subject Progress
      </Typography>
      <Grid container spacing={2}>
        {subjects.map((subject, index) => {
          const data = {
            labels: ["Completed", "Remaining"],
            datasets: [
              {
                data: [subject.value, 100 - subject.value],
                backgroundColor: [subject.color, "#e0e0e0"],
                borderWidth: 0,
              },
            ],
          };

          const options = {
            cutout: "75%",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              centerText: {
                value: subject.value,
              },
            },
          };

          return (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card variant="outlined" sx={{ height: 180 }}>
                <CardContent sx={{ textAlign: "center", p: 1 }}>
                  <div style={{ width: "100%", height: 120, margin: "0 auto" }}>
                    <Doughnut data={data} options={options} />
                  </div>
                  <Typography variant="subtitle2" mt={1}>
                    {subject.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Card>
  );
};

export default SubjectProgress;
