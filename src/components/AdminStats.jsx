// import React, { useEffect, useState } from "react";
// import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";
// import { getAdminStats } from "../services/adminDServices";

// const AdminStats = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const data = await getAdminStats();
//         setStats(data);
//       } catch (err) {
//         setError("Failed to fetch statistics");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="100px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="100px">
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box display="flex" justifyContent="space-between" gap={6} mt={3} ml={5} mr={2} >
//       {/* Teachers Card */}
//       <Card sx={{ flex: 1, border: "1px solid #1976d2", borderRadius: 2 }}>
//         <CardContent>
//           <Typography variant="h3" color="info.dark" textAlign="center" fontWeight="bold">
//             Teachers
//           </Typography>
//           <Typography variant="h1" fontWeight="bold" textAlign="center">
//             {stats.total_teachers}
//           </Typography>
//         </CardContent>
//       </Card>

//       {/* Students Card */}
//       <Card sx={{ flex: 1, border: "1px solid #1976d2", borderRadius: 2 }}>
//         <CardContent>
//           <Typography variant="h3" color="info.dark" textAlign="center" fontWeight="bold">
//             Students
//           </Typography>
//           <Typography variant="h1" fontWeight="bold" textAlign="center">
//             {stats.total_students}
//           </Typography>
//         </CardContent>
//       </Card>

//       {/* Active Students Today Card */}
//       <Card sx={{ flex: 1, border: "1px solid #1976d2", borderRadius: 2 }}>
//         <CardContent>
//           <Typography variant="h3" color="info.dark" textAlign="center" fontWeight="bold">
//             Students Active Today
//           </Typography>
//           <Typography variant="h1" fontWeight="bold" textAlign="center">
//             {stats.active_students_today}
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default AdminStats;

import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { getAdminStats } from "../services/adminDServices";

const cardStyles = {
  flex: 1,
  borderRadius: 3,
  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.15)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'default',
  background: 'linear-gradient(145deg, #ffffffff, #c8e6ffff)',
  "&:hover": {
    boxShadow: '0 8px 30px rgba(25, 118, 210, 0.4)',
    transform: 'translateY(-6px)',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px',
};

const iconStyles = {
  fontSize: 48,
  color: '#1565c0',
  marginBottom: 3,
};

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
      <Box display="flex" justifyContent="center" alignItems="center" height="120px">
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="120px">
        <Typography color="error" fontWeight="bold">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="space-between" gap={4} mt={4} mx={5}>
      {/* Teachers Card */}
      <Card sx={cardStyles}>
        <SchoolIcon sx={iconStyles} />
        <Typography variant="h5" color="primary.dark" fontWeight="600" gutterBottom>
          Teachers
        </Typography>
        <Typography variant="h2" fontWeight="700" color="#0d47a1">
          {stats.total_teachers}
        </Typography>
      </Card>

      {/* Students Card */}
      <Card sx={cardStyles}>
        <PeopleIcon sx={iconStyles} />
        <Typography variant="h5" color="primary.dark" fontWeight="600" gutterBottom>
          Students
        </Typography>
        <Typography variant="h2" fontWeight="700" color="#0d47a1">
          {stats.total_students}
        </Typography>
      </Card>

      {/* Active Students Today Card */}
      <Card sx={cardStyles}>
        <HowToRegIcon sx={iconStyles} />
        <Typography variant="h5" color="primary.dark" fontWeight="600" gutterBottom>
          Students Active Today
        </Typography>
        <Typography variant="h2" fontWeight="700" color="#0d47a1">
          {stats.active_students_today}
        </Typography>
      </Card>
    </Box>
  );
};

export default AdminStats;
