import React, { useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

const LineChartCompo = ({ data }) => {

  useEffect(() => {
    console.log("LineChartCompo mounted or data changed", data);
  }, [data]);

  return (
    <Card sx={{ width: "510px", height: 350, boxShadow: 0 }}>
      <CardContent sx={{ height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          {/* Monthly Data */}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#1976d2"
              fill="#1976d2"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LineChartCompo;

