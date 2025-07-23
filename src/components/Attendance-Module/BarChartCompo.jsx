import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

const BarChartCompo = ({ data }) => {
  return (
    <Card sx={{ width: "510px", height: 350, boxShadow: 0 }}>
      <CardContent sx={{ height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          {/* Monthly Data */}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" padding={{ left: 0, right: 0 }} />
            <YAxis padding={{ top: 0, bottom: 0 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#1976d2" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartCompo;



