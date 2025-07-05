// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   TextField,
//   Typography,
//   CircularProgress,
//   Paper,
//   Alert // Added for error display
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";

// const AdminAnomalyDashboard = () => {
//   const [anomalies, setAnomalies] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); // State for error messages

//   const fetchAnomalies = async () => {
//     setLoading(true);
//     setError(null); // Clear previous errors

//     // Retrieve token, username, and role from localStorage
//     // IMPORTANT: Ensure these are correctly stored upon successful login
//     const token = localStorage.getItem("token");
//     const loggedInUsername = localStorage.getItem("email"); // e.g., "shiny@example.com"
//     const loggedInRole = localStorage.getItem("role");         // e.g., "admin"

//     if (!token || !loggedInUsername || !loggedInRole) {
//       setError("Authentication details (token, username, or role) are missing. Please log in.");
//       setLoading(false);
//       return;
//     }

//     // Construct query parameters
//     const queryParams = new URLSearchParams({
//       username: loggedInUsername,
//       role: loggedInRole,
//     }).toString();

//     try {
//       // 1. Point to the API Gateway (port 8000)
//       // 2. Include Authorization header with the token
//       // 3. Add query parameters
//       const res = await fetch(
//         `http://localhost:8000/api/anomaly-detection/results?${queryParams}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`, // Include the Bearer token
//           },
//         }
//       );

//       if (!res.ok) {
//         // If the response is not OK (e.g., 401, 403, 500)
//         const errorData = await res.json();
//         throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json(); // Parse the JSON response
//       console.log("Fetched data:", data); // Log the data to inspect its structure

//       // The API returns an object with a 'results' key
//       if (data && Array.isArray(data.results)) {
//         setAnomalies(data.results);
//         setFiltered(data.results);
//       } else {
//         setError("Unexpected data format from API. Expected an object with a 'results' array.");
//         setAnomalies([]);
//         setFiltered([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch anomaly results:", error);
//       setError(error.message || "An unknown error occurred while fetching anomalies.");
//       setAnomalies([]); // Clear data on error
//       setFiltered([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnomalies();
//   }, []); // Empty dependency array means this runs once on mount

//   useEffect(() => {
//     const filteredData = anomalies.filter(item =>
//       item.username.toLowerCase().includes(search.toLowerCase())
//     );
//     // Ensure each item has a unique 'id' for DataGrid
//     setFiltered(filteredData.map((item, index) => ({ ...item, id: item._id || index })));
//   }, [search, anomalies]);

//   // Define columns for DataGrid
//   const columns = [
//     { field: "id", headerName: "ID", width: 90, hide: true }, // Hidden ID field for DataGrid requirement
//     { field: "username", headerName: "Username", width: 150 },
//     { field: "role", headerName: "Role", width: 100 },
//     { field: "hour", headerName: "Hour", width: 80 },
//     { field: "location", headerName: "Location", width: 200 },
//     { field: "device", headerName: "Device", width: 250 },
//     {
//       field: "is_overall_anomaly",
//       headerName: "Anomaly",
//       width: 120,
//       renderCell: (params) => (params.value ? "Yes" : "No"),
//     },
//     { field: "timestamp", headerName: "Timestamp", width: 180 },
//   ];

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>
//         Login Anomaly Results
//       </Typography>

//       <TextField
//         label="Search by Username"
//         variant="outlined"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         fullWidth
//         sx={{ mb: 2 }}
//       />

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="200px">
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Paper elevation={3}>
//           <Box sx={{ height: 600, width: "100%" }}>
//             <DataGrid
//               // Ensure each row has a unique 'id' field, using _id from MongoDB or index as fallback
//               rows={filtered}
//               columns={columns}
//               getRowId={(row) => row._id}
//               initialState={{
//                 pagination: {
//                   paginationModel: {
//                     pageSize: 10,
//                   },
//                 },
//               }}
//               pageSizeOptions={[5, 10, 20]} // Correct way to specify page size options
//               disableRowSelectionOnClick // Correct prop name
//             />
//           </Box>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default AdminAnomalyDashboard;

// services/user-management/frontend/src/components/AdminAnomalyDashboard.jsx

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   TextField,
//   Typography,
//   CircularProgress,
//   Paper,
//   Alert
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";

// // Assuming Url is defined globally or imported
// const Url = import.meta.env.VITE_BACKEND_URL; // Make sure this is still correct

// const AdminAnomalyDashboard = () => {
//   const [anomalies, setAnomalies] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchAnomalies = async () => {
//     setLoading(true);
//     setError(null);

//     const token = localStorage.getItem("token");
//     // const loggedInUsername = localStorage.getItem("userEmail"); // No longer needed for 'all data' query
//     const loggedInRole = localStorage.getItem("role");

//     if (!token || !loggedInRole) {
//       setError("Authentication details (token or role) are missing. Please log in.");
//       setLoading(false);
//       return;
//     }

//     // Build query parameters conditionally
//     let queryParams = new URLSearchParams();

//     // If the logged-in user is an admin, they should see all data by default.
//     // We should NOT add 'username' or 'role' to the query parameters
//     // UNLESS you later implement specific filter inputs for the admin.
//     if (loggedInRole === "admin") {
//       // For an admin user, if they want to see ALL data, we send no specific user/role filters.
//       // The backend will receive an empty query, returning all.
//       // If you implement a search bar specifically for filtering users by admin,
//       // you would add: if (search) { queryParams.append("username", search); }
//     } else {
//       // This block is for non-admin users.
//       // With your current backend, non-admins are denied access to this endpoint.
//       // But if allowed, they would only see their own data.
//       const loggedInUsername = localStorage.getItem("userEmail"); // Get it only if needed
//       if (loggedInUsername) {
//         queryParams.append("username", loggedInUsername);
//       }
//       queryParams.append("role", loggedInRole);
//     }

//     try {
//       const queryString = queryParams.toString();
//       const url = `${Url}/api/anomaly-detection/results${queryString ? `?${queryString}` : ''}`;

//       console.log("Fetching anomalies from URL:", url);

//       const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json", // This is fine for GET requests
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         // --- START MODIFIED ERROR HANDLING BLOCK ---
//         const errorData = await res.json();
//         console.error("Backend Error Response (raw data):", errorData); // Crucial for debugging!

//         let errorMessage = "An unknown error occurred.";
//         if (errorData && typeof errorData.detail === 'string') {
//             // Case 1: 'detail' is a simple string (e.g., {"detail": "Error message"})
//             errorMessage = errorData.detail;
//         } else if (errorData && Array.isArray(errorData.detail)) {
//             // Case 2: 'detail' is an array of objects (e.g., FastAPI validation errors)
//             // Example: {"detail": [{"loc": ["query", "username"], "msg": "value is not a valid email address", "type": "value_error.email"}]}
//             errorMessage = errorData.detail.map(err => {
//                 const loc = err.loc && err.loc.length > 0 ? err.loc.join('.') + ': ' : '';
//                 return `${loc}${err.msg}`;
//             }).join('; ');
//         } else if (errorData) {
//             // Case 3: 'detail' is an object but not an array, or no 'detail' field exists
//             errorMessage = JSON.stringify(errorData); // Stringify the whole error object
//         }
//         // Fallback if none of the above matches, though rare
//         errorMessage = errorMessage || `HTTP error! status: ${res.status}`;

//         throw new Error(errorMessage);
//         // --- END MODIFIED ERROR HANDLING BLOCK ---
//       }

//       const data = await res.json();
//       console.log("Fetched data:", data);

//       // ... (rest of your success handling) ...

//     } catch (error) {
//       console.error("Failed to fetch anomaly results:", error);
//       setError(error.message || "An unknown error occurred while fetching anomalies.");
//       setAnomalies([]);
//       setFiltered([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnomalies();
//     // Re-fetch if 'search' changes ONLY IF 'search' is meant for backend filtering.
//     // Currently, your search filters client-side, so no need to add 'search' here.
//   }, []); // Empty dependency array means it runs once on mount.

//   // This useEffect handles client-side filtering based on the search input
//   useEffect(() => {
//     if (anomalies.length > 0) {
//       const filteredData = anomalies.filter(item =>
//         item.username.toLowerCase().includes(search.toLowerCase())
//       );
//       setFiltered(filteredData); // No need for .map with id here, getRowId handles it
//     } else {
//         setFiltered([]);
//     }
//   }, [search, anomalies]); // Re-filters when search input or original anomalies change

//   const columns = [
//     { field: "_id", headerName: "ID", width: 90, hide: true }, // Changed from 'id' to '_id' for clarity
//     { field: "username", headerName: "Username", width: 150 },
//     { field: "role", headerName: "Role", width: 100 },
//     { field: "hour", headerName: "Hour", width: 80 },
//     { field: "location", headerName: "Location", width: 200 },
//     { field: "device", headerName: "Device", width: 250 },
//     {
//       field: "is_overall_anomaly",
//       headerName: "Anomaly",
//       width: 120,
//       renderCell: (params) => (params.value ? "Yes" : "No"),
//     },
//     { field: "timestamp", headerName: "Timestamp", width: 180 },
//   ];

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>
//         Login Anomaly Results
//       </Typography>

//       <TextField
//         label="Search by Username"
//         variant="outlined"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         fullWidth
//         sx={{ mb: 2 }}
//       />

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="200px">
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Paper elevation={3}>
//           <Box sx={{ height: 600, width: "100%" }}>
//             <DataGrid
//               rows={filtered}
//               columns={columns}
//               getRowId={(row) => row._id} // Ensures _id is used as the unique identifier
//               initialState={{
//                 pagination: {
//                   paginationModel: {
//                     pageSize: 10,
//                   },
//                 },
//               }}
//               pageSizeOptions={[5, 10, 20]}
//               disableRowSelectionOnClick
//             />
//           </Box>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default AdminAnomalyDashboard;


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

const Url = "http://localhost:8000"; // Ensure this URL is correct for your backend

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

    // --- CRUCIAL CHANGE: Conditionally add query parameters ---
    if (loggedInRole === "admin") {
      // For an admin, we want to fetch ALL anomaly data.
      // So, we do NOT append username or role to queryParams.
      // The backend's @router.get("/anomaly-detection/results") should handle empty query for admins.
      console.log("Admin user detected. Fetching all anomaly results without user-specific filters.");
    } else {
      // Although this endpoint is restricted to admins, if a non-admin somehow
      // tried to access it, we'd still send their details for filtering (if allowed).
      // However, the backend should block non-admins.
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