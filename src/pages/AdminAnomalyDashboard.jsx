import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Alert
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const Url = import.meta.env.VITE_BACKEND_URL;

const AdminAnomalyDashboard = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnomalies = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const loggedInRole = localStorage.getItem("role");
    const loggedInUsername = localStorage.getItem("email"); // Still retrieve for potential debug/logging

    if (!token || !loggedInRole) {
      setError("Authentication details (token or role) are missing. Please log in.");
      setLoading(false);
      return;
    }

    let queryParams = new URLSearchParams();

    // Conditionally add query parameters ---
    if (loggedInRole === "admin") {
      console.log("Admin user detected. Fetching all anomaly results without user-specific filters.");
    } else {
      console.log(`Non-admin user '${loggedInUsername}' detected. This endpoint is typically for admins.`);
      if (loggedInUsername) {
        queryParams.append("username", loggedInUsername);
      }
      queryParams.append("role", loggedInRole);
    }
    // --- END CRUCIAL CHANGE ---

    try {
      const queryString = queryParams.toString();
      const url = `${Url}/api/anomaly-detection/results${queryString ? `?${queryString}` : ''}`;

      console.log("Attempting to fetch anomalies from URL:", url); // Very useful for debugging the URL

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Backend Error Response (raw data):", errorData);

        let errorMessage = "An unknown error occurred.";
        if (errorData && typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
        } else if (errorData && Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map(err => {
                const loc = err.loc && err.loc.length > 0 ? err.loc.join('.') + ': ' : '';
                return `${loc}${err.msg}`;
            }).join('; ');
        } else if (errorData) {
            errorMessage = JSON.stringify(errorData);
        }
        errorMessage = errorMessage || `HTTP error! status: ${res.status}`;

        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("Successfully fetched data:", data);

      if (data && Array.isArray(data.results)) {
        setAnomalies(data.results);
        setFiltered(data.results);
      } else {
        setError("Unexpected data format from API. Expected an object with a 'results' array.");
        setAnomalies([]);
        setFiltered([]);
      }
    } catch (error) {
      console.error("Failed to fetch anomaly results:", error);
      setError(error.message || "An unknown error occurred while fetching anomalies.");
      setAnomalies([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  useEffect(() => {
    if (anomalies.length > 0) {
      const filteredData = anomalies.filter(item =>
        item.username.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(filteredData);
    } else {
        setFiltered([]);
    }
  }, [search, anomalies]);

  const columns = [
    { field: "_id", headerName: "ID", width: 90, hide: true },
    { field: "username", headerName: "Username", width: 150 },
    { field: "role", headerName: "Role", width: 100 },
    { field: "hour", headerName: "Hour", width: 80 },
    { field: "location", headerName: "Location", width: 200 },
    { field: "device", headerName: "Device", width: 250 },
    {
      field: "is_overall_anomaly",
      headerName: "Anomaly",
      width: 120,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    { field: "timestamp", headerName: "Timestamp", width: 180 },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Login Anomaly Results
      </Typography>

      <TextField
        label="Search by Username"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3}>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={filtered}
              columns={columns}
              getRowId={(row) => row._id}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AdminAnomalyDashboard;