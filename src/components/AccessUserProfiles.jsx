// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Select,
//   MenuItem,
//   Button,
//   Card,
//   Typography,
//   CircularProgress,
//   Paper,
// } from "@mui/material";
// import { getUserProfiles } from "../services/adminDServices";

// const AccessUserProfiles = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchId, setSearchId] = useState("");
//   const [role, setRole] = useState("");
//   const [classId, setClassId] = useState("");

//   const fetchProfiles = async () => {
//     setLoading(true);
//     try {
//       const data = await getUserProfiles(searchId, role, classId);
//       setProfiles(data);
//     } catch (error) {
//       console.error("Error fetching user profiles:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfiles();
//   }, []);

//   return (
//     <Paper elevation={3} sx={{ mt: 4, p: 3, ml: 5, mr: 2 }}>
//       <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, pb: 1 }}>
//         <Typography variant="h4" gutterBottom fontWeight="bold">
//           Access User Profiles
//         </Typography>
//       </Box>

//       {/* Search and Filters */}
//       <Box display="flex" gap={2} mb={3}>
//         <TextField
//           label="Search by Id"
//           variant="outlined"
//           value={searchId}
//           onChange={(e) => setSearchId(e.target.value)}
//           fullWidth
//         />
//         <Select
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           displayEmpty
//           fullWidth
//         >
//           <MenuItem value="">Role</MenuItem>
//           <MenuItem value="student">Student</MenuItem>
//           <MenuItem value="teacher">Teacher</MenuItem>
//           <MenuItem value="admin">Admin</MenuItem>
//         </Select>
//         <Select
//           value={classId}
//           onChange={(e) => setClassId(e.target.value)}
//           displayEmpty
//           fullWidth
//         >
//           <MenuItem value="">Class</MenuItem>
//           <MenuItem value="Class 1">Class 1</MenuItem>
//           <MenuItem value="Class 2">Class 2</MenuItem>
//           <MenuItem value="Class 3">Class 3</MenuItem>
//         </Select>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={fetchProfiles}
//           sx={{ whiteSpace: "nowrap" }}
//         >
//           Search
//         </Button>
//       </Box>

//       {/* Profiles List */}
//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="200px">
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Box
//           sx={{
//             maxHeight: 265, // Set max height
//             overflow: "auto", // Enable scrolling
//           }}
//         >
//           {profiles.map((profile) => (
//             <Card
//               key={profile.user_id}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 mb: 2,
//                 p: 2,
//                 border: "1px solid #1976d2",
//                 borderRadius: 2,
//               }}
//             >
//               <Box display="flex" alignItems="center">
//                 <Box
//                   sx={{
//                     width: 40,
//                     height: 40,
//                     backgroundColor: "#1976d2",
//                     borderRadius: "50%",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     color: "white",
//                     mr: 2,
//                   }}
//                 >
//                   <Typography variant="h6">{profile.role.charAt(0).toUpperCase()}</Typography>
//                 </Box>
//                 <Typography variant="body1" fontWeight="bold">
//                   {profile.user_id}
//                 </Typography>
//                 <Typography variant="body2" sx={{ ml: 2 }}>
//                   {profile.full_name}
//                 </Typography>
//               </Box>
//               <Button variant="contained" color="primary">
//                 View Profile
//               </Button>
//             </Card>
//           ))}
//         </Box>
//       )}
//     </Paper>
//   );
// };

// export default AccessUserProfiles;

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Card,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { getUserProfiles } from "../services/adminDServices";

const classOptions = [
  { class_id: "CLS001", class_name: "10-A" },
  { class_id: "CLS002", class_name: "10-B" },
  { class_id: "CLS003", class_name: "11-A" },
  { class_id: "CLS004", class_name: "11-B" },
  { class_id: "CLS005", class_name: "12-A" },
  { class_id: "CLS013", class_name: "13-A" },
];

const AccessUserProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [role, setRole] = useState("");
  const [classId, setClassId] = useState("");

  
const fetchProfiles = async () => {
  setLoading(true);
  try {
    const data = await getUserProfiles(searchId, role, classId);
    setProfiles(data || []);
  } catch (error) {
    console.error("Error fetching user profiles:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProfiles(); // Initial load
  }, []);

  return (
    <Paper elevation={3} sx={{ mt: 4, p: 3, ml: 5, mr: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, pb: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Access User Profiles
        </Typography>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search by ID"
          variant="outlined"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          fullWidth
        />

        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="teacher">Teacher</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>

        <Select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">All Classes</MenuItem>
          {classOptions.map((cls) => (
            <MenuItem key={cls.class_id} value={cls.class_id}>
              {cls.class_name}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          color="primary"
          onClick={fetchProfiles}
          sx={{ whiteSpace: "nowrap" }}
        >
          Search
        </Button>
      </Box>

      {/* Profile Cards */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ maxHeight: 265, overflow: "auto" }}>
          {profiles.length === 0 ? (
            <Typography>No matching profiles found.</Typography>
          ) : (
            profiles.map((profile) => (
              <Card
                key={profile.user_id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                  p: 2,
                  border: "1px solid #1976d2",
                  borderRadius: 2,
                }}
              >
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#1976d2",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      mr: 2,
                    }}
                  >
                    <Typography variant="h6">
                      {profile.role.charAt(0).toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="bold">
                    {profile.user_id}
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    {profile.full_name}
                  </Typography>
                </Box>
                <Button variant="contained" color="primary">
                  View Profile
                </Button>
              </Card>
            ))
          )}
        </Box>
      )}
    </Paper>
  );
};

export default AccessUserProfiles;
