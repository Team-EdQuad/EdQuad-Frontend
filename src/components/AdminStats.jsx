import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { getAdminStats } from "../services/adminDServices";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        setError("Failed to fetch statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="space-between" gap={6} mt={3} ml={5} mr={2} >
      {/* Teachers Card */}
      <Card sx={{ flex: 1, border: "1px solid #1976d2", borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h3" color="info.dark" textAlign="center" fontWeight="bold">
            Teachers
          </Typography>
          <Typography variant="h1" fontWeight="bold" textAlign="center">
            {stats.total_teachers}
          </Typography>
        </CardContent>
      </Card>

      {/* Students Card */}
      <Card sx={{ flex: 1, border: "1px solid #1976d2", borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h3" color="info.dark" textAlign="center" fontWeight="bold">
            Students
          </Typography>
          <Typography variant="h1" fontWeight="bold" textAlign="center">
            {stats.total_students}
          </Typography>
        </CardContent>
      </Card>

      {/* Active Students Today Card */}
      <Card sx={{ flex: 1, border: "1px solid #1976d2", borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h3" color="info.dark" textAlign="center" fontWeight="bold">
            Students Active Today
          </Typography>
          <Typography variant="h1" fontWeight="bold" textAlign="center">
            {stats.active_students_today}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminStats;