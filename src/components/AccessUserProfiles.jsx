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
// import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
// import { getAccessProfile } from "../services/adminDServices";
// import { getUserProfiles } from "../services/adminDServices";

// const classOptions = [
//   { class_id: "CLS001", class_name: "6-A" },
//   { class_id: "CLS002", class_name: "6-B" },
//   { class_id: "CLS003", class_name: "7-A" },
//   { class_id: "CLS004", class_name: "7-B" },
//   { class_id: "CLS005", class_name: "8-A" },
//   { class_id: "CLS006", class_name: "8-B" },
//   { class_id: "CLS007", class_name: "9-A" },
//   { class_id: "CLS008", class_name: "9-B" },
//   { class_id: "CLS009", class_name: "10-A" },
//   { class_id: "CLS010", class_name: "10-B" },
//   { class_id: "CLS011", class_name: "11-A" },
//   { class_id: "CLS012", class_name: "11-B" }
// ];

// const AccessUserProfiles = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchId, setSearchId] = useState("");
//   const [role, setRole] = useState("");
//   const [classId, setClassId] = useState("");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);

  
// const handleViewProfile = async (userId) => {
//   try {
//     const userDetails = await getAccessProfile(userId);
//     setSelectedUser(userDetails);
//     setModalOpen(true);
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//   }
// };


// const fetchProfiles = async (searchIdInput = searchId, roleInput = role, classIdInput = classId) => {
//   setLoading(true);
//   try {
//     const data = await getUserProfiles(searchIdInput, roleInput, classIdInput);
//     setProfiles(data || []);
//   } catch (error) {
//     console.error("Error fetching user profiles:", error);
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchProfiles(); // Initial load
//   }, []);

//   return (<>
//     <Paper elevation={3} sx={{ mt: 4, p: 3, ml: 5, mr: 2 }}>
//       <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, pb: 1 }}>
//         <Typography variant="h4" gutterBottom fontWeight="bold">
//           Access User Profiles
//         </Typography>
//       </Box>

//       {/* Filters */}
//       <Box display="flex" gap={2} mb={3}>
//         <TextField
//           label="Search by ID"
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
//           <MenuItem value="">All Roles</MenuItem>
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
//           <MenuItem value="">All Classes</MenuItem>
//           {classOptions.map((cls) => (
//             <MenuItem key={cls.class_id} value={cls.class_id}>
//               {cls.class_name}
//             </MenuItem>
//           ))}
//         </Select>

//         {/* <Button
//           variant="contained"
//           color="primary"
//           onClick={fetchProfiles}
//           sx={{ whiteSpace: "nowrap" }}
//         >
//           Search
//         </Button> */}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => fetchProfiles(searchId, role, classId)}
//           sx={{ whiteSpace: "nowrap" }}
//         >
//           Search
//       </Button>

//       </Box>

//       {/* Profile Cards */}
//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height={200}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Box sx={{ maxHeight: 265, overflow: "auto" }}>
//           {profiles.length === 0 ? (
//             <Typography>No matching profiles found.</Typography>
//           ) : (
//             profiles.map((profile) => (
//               <Card
//                 key={profile.user_id}
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   mb: 2,
//                   p: 2,
//                   border: "1px solid #1976d2",
//                   borderRadius: 2,
//                 }}
//               >
//                 <Box display="flex" alignItems="center">
//                   <Box
//                     sx={{
//                       width: 40,
//                       height: 40,
//                       backgroundColor: "#1976d2",
//                       borderRadius: "50%",
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       color: "white",
//                       mr: 2,
//                     }}
//                   >
//                     <Typography variant="h6">
//                       {profile.role.charAt(0).toUpperCase()}
//                     </Typography>
//                   </Box>
//                   <Typography variant="body1" fontWeight="bold">
//                     {profile.user_id}
//                   </Typography>
//                   <Typography variant="body2" sx={{ ml: 2 }}>
//                     {profile.full_name}
//                   </Typography>
//                 </Box>
//                 <Button variant="contained" color="primary"onClick={() => handleViewProfile(profile.user_id)}>
//                   View Profile
//                 </Button>
//               </Card>
//             ))
//           )}
//         </Box>
//       )}
//     </Paper>
    
//     <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
//   <DialogTitle sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: '#fff' }}>
//     User Profile
//   </DialogTitle>
//   <DialogContent dividers sx={{ p: 3 }}>
//     {selectedUser ? (
//       <Box>
//         <Box display="flex" alignItems="center" mb={2}>
//           <Box
//             sx={{
//               width: 60,
//               height: 60,
//               backgroundColor: "#1976d2",
//               borderRadius: "50%",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               color: "white",
//               fontSize: 28,
//               fontWeight: 'bold',
//               mr: 2,
//             }}
//           >
//             {selectedUser.full_name?.charAt(0)}
//           </Box>
//           <Box>
//             <Typography variant="h6" fontWeight="bold">
//               {selectedUser.full_name}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {selectedUser.role?.toUpperCase()} | ID: {selectedUser.user_id || selectedUser.student_id || selectedUser.teacher_id || selectedUser.admin_id}
//             </Typography>
//           </Box>
//         </Box>

//         <Box sx={{ mt: 1 }}>
//           <Typography variant="body1"><strong>Gender:</strong> {selectedUser.gender}</Typography>
//           <Typography variant="body1"><strong>Email:</strong> {selectedUser.email}</Typography>
//           <Typography variant="body1"><strong>Phone:</strong> {selectedUser.phone || selectedUser.phone_no || selectedUser.Phone_no}</Typography>
//           <Typography variant="body1"><strong>Join Date:</strong> {selectedUser.join_date}</Typography>
//         </Box>
//       </Box>
//     ) : (
//       <Typography>Loading...</Typography>
//     )}
//   </DialogContent>
//   <DialogActions sx={{ px: 3, py: 2 }}>
//     <Button onClick={() => setModalOpen(false)} variant="contained" color="primary">
//       Close
//     </Button>
//   </DialogActions>
// </Dialog>

//   </>
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
  Avatar,
} from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { getAccessProfile, getUserProfiles } from "../services/adminDServices";

const classOptions = [
  { class_id: "CLS001", class_name: "6-A" },
  { class_id: "CLS002", class_name: "6-B" },
  { class_id: "CLS003", class_name: "7-A" },
  { class_id: "CLS004", class_name: "7-B" },
  { class_id: "CLS005", class_name: "8-A" },
  { class_id: "CLS006", class_name: "8-B" },
  { class_id: "CLS007", class_name: "9-A" },
  { class_id: "CLS008", class_name: "9-B" },
  { class_id: "CLS009", class_name: "10-A" },
  { class_id: "CLS010", class_name: "10-B" },
  { class_id: "CLS011", class_name: "11-A" },
  { class_id: "CLS012", class_name: "11-B" },
];

// Colors by role
const roleColors = {
  student: "#4caf50", 
  teacher: "#2196f3", 
  admin: "#f44336",   
};

const AccessUserProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [role, setRole] = useState("");
  const [classId, setClassId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewProfile = async (userId) => {
    try {
      const userDetails = await getAccessProfile(userId);
      setSelectedUser(userDetails);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchProfiles = async (searchIdInput = searchId, roleInput = role, classIdInput = classId) => {
    setLoading(true);
    try {
      const data = await getUserProfiles(searchIdInput, roleInput, classIdInput);
      setProfiles(data || []);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles(); 
  }, []);

  return (
    <>
      <Paper elevation={3} sx={{ mt: 4, p: 3, ml: 5, mr: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, pb: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
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
            onClick={() => fetchProfiles(searchId, role, classId)}
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
          <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
            {profiles.length === 0 ? (
              <Typography>No matching profiles found.</Typography>
            ) : (
              profiles.map((profile) => {
                const roleColor = roleColors[profile.role] || "#1976d2";
                return (
                  <Card
                    key={profile.user_id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                      p: 2,
                      borderRadius: 3,
                      boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 8px 20px ${roleColor}88`,
                      },
                    }}
                    onClick={() => handleViewProfile(profile.user_id)}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: roleColor,
                          width: 56,
                          height: 56,
                          fontSize: 24,
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {profile.full_name.charAt(0)}
                      </Avatar>

                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {profile.full_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {profile.role.toUpperCase()} | ID: {profile.user_id}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: roleColor,
                        color: roleColor,
                        "&:hover": {
                          backgroundColor: roleColor,
                          color: "#fff",
                          borderColor: roleColor,
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleViewProfile(profile.user_id);
                      }}
                    >
                      View Profile
                    </Button>
                  </Card>
                );
              })
            )}
          </Box>
        )}
      </Paper>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold", bgcolor: "#1976d2", color: "#fff" }}>
          User Profile
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedUser ? (
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: roleColors[selectedUser.role] || "#1976d2",
                    fontSize: 28,
                    fontWeight: "bold",
                    mr: 2,
                  }}
                >
                  {selectedUser.full_name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedUser.full_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.role?.toUpperCase()} | ID:{" "}
                    {selectedUser.user_id ||
                      selectedUser.student_id ||
                      selectedUser.teacher_id ||
                      selectedUser.admin_id}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Typography variant="body1">
                  <strong>Gender:</strong> {selectedUser.gender}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {selectedUser.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> {selectedUser.phone || selectedUser.phone_no || selectedUser.Phone_no}
                </Typography>
                <Typography variant="body1">
                  <strong>Join Date:</strong> {selectedUser.join_date}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setModalOpen(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccessUserProfiles;
