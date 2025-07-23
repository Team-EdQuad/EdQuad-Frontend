import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CircularProgress, Box, Typography } from "@mui/material";
import dayjs from "dayjs";
const attendanceModuleUrl = import.meta.env.VITE_ATTENDANCE_MODULE_BACKEND_URL;

const CustomLegend = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      gap: 4,
      mt: 1,
      mb: 2,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{ width: 20, height: 20, backgroundColor: "#1976d2", borderRadius: 0.5 }}
      />
      <Typography variant="body2">Previous (Actual)</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{ width: 20, height: 20, backgroundColor: "#00CADC", borderRadius: 0.5 }}
      />
      <Typography variant="body2">Predicted</Typography>
    </Box>
  </Box>
);

const BarChartPredicted = ({ classId, subjectId }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // const today = dayjs("2025-07-14"); // fixed test date
  const today = dayjs();
  const todayDate = today.format("YYYY-MM-DD");
  const startDate = today.subtract(7, "day").format("YYYY-MM-DD");
  const endDate = today.add(7, "day").format("YYYY-MM-DD");

  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        const url = `${attendanceModuleUrl}/summary?class_id=${classId}&subject_id=${subjectId}&start_date=${startDate}&end_date=${endDate}&current_date=${todayDate}`;
        const res = await fetch(url);
        const data = await res.json();

        console.log("data", data);

        const combinedMap = new Map();

        // Add Actual data with type flag
        Object.entries(data.exist)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .filter(([date]) => dayjs(date).isBefore(today))
          .forEach(([date, value]) => {
            combinedMap.set(date, { date, value, type: "Actual" });
          });

        // Add Predicted data if no Actual exists
        Object.entries(data.predict)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .filter(
            ([date]) => dayjs(date).isSame(today) || dayjs(date).isAfter(today)
          )
          .forEach(([date, value]) => {
            if (!combinedMap.has(date)) {
              combinedMap.set(date, {
                date,
                value: value === -1 ? null : value,
                type: "Predicted",
              });
            }
          });

        const combined = Array.from(combinedMap.values()).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        const filtered = combined.filter(
          (entry) => entry.value !== null && entry.value !== undefined
        );

        setChartData(filtered);
      } catch (error) {
        console.error("Error fetching attendance summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceSummary();
  }, [classId, subjectId, startDate, endDate, todayDate]);

  return (
    <Card sx={{ width: "100%", maxWidth: 800, height: 350, boxShadow: 0 }}>
      <CardContent sx={{ height: "100%", padding: "10px" }}>
        {loading ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                barCategoryGap="20%"
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  type="category"
                  interval={0}
                  tickFormatter={(d) => dayjs(d).format("MM-DD")}
                  tick={{ fontSize: 12 }}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                {/* <Legend />  <-- Remove this line */}
                <Bar
                  dataKey="value"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={40}
                  barSize={40}
                  isAnimationActive={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.type === "Actual" ? "#1976d2" : "#00CADC"}
                    />
                  ))}
                </Bar>
              </BarChart>

            </ResponsiveContainer>
            <CustomLegend />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartPredicted;
